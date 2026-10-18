import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { postSchema, PostInput } from "@/schemas/post";
import { v4 as uuidv4 } from "uuid";
import { setupIndexes } from "./initIndexes";

export async function createPost(
  rawData: PostInput,
  author: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    // 訪客的內容帶上與帳號相同的到期時間，由 TTL 索引自動刪除
    expiresAt?: Date;
  },
) {
  // 1. Zod schema validation
  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(
      "Invalid post data: " +
        JSON.stringify(parsed.error.flatten().fieldErrors),
    );
  }

  const { title, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newPost = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date(),
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
    ...(author.expiresAt && { expiresAt: author.expiresAt }),
  };

  await db.collection("posts").insertOne(newPost);
  return newPost;
}

export async function getPostList(
  page: number,
  limit: number,
  authorId?: string,
) {
  await setupIndexes();
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const skip = (page - 1) * limit;

  const [result] = await collection
    .aggregate([
      // 有傳 authorId 時只取該作者的文章（作者頁使用）
      { $match: authorId ? { "author.id": authorId } : {} },
      {
        $facet: {
          posts: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            // 只對這一頁的文章計算留言數（使用 comments 的 postId 索引）
            {
              $lookup: {
                from: "comments",
                let: { postId: "$id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
                  { $count: "count" },
                ],
                as: "commentStats",
              },
            },
            {
              $addFields: {
                commentCount: {
                  $ifNull: [{ $first: "$commentStats.count" }, 0],
                },
              },
            },
            // 不把作者 email 傳到前端
            { $project: { commentStats: 0, "author.email": 0 } },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ])
    .toArray();

  const posts = result?.posts || [];
  const total = result?.totalCount[0]?.total || 0;

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// 作者頁標題用：從該作者最新一篇文章取得名稱，並計算文章數
export async function getAuthorProfile(authorId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const latestPost = await collection.findOne(
    { "author.id": authorId },
    { sort: { createdAt: -1 }, projection: { "author.name": 1 } },
  );
  if (!latestPost) return null;

  const postCount = await collection.countDocuments({
    "author.id": authorId,
  });

  return {
    id: authorId,
    name: latestPost.author?.name as string,
    postCount,
  };
}

export async function getPostById(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  // 不把作者 email 傳到前端
  const post = await collection.findOne(
    { id },
    { projection: { "author.email": 0 } },
  );
  if (!post) return null;

  // 側邊欄作者卡片用：該作者的文章總數
  const authorPostCount = post.author?.id
    ? await collection.countDocuments({ "author.id": post.author.id })
    : 0;

  return { ...post, authorPostCount };
}

export async function updatePost(
  id: string,
  rawData: PostInput,
  authorId: string,
) {
  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(
      "Invalid post data: " +
        JSON.stringify(parsed.error.flatten().fieldErrors),
    );
  }

  const { title, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const updatedAt = new Date();
  const result = await collection.findOneAndUpdate(
    { id, "author.id": authorId },
    { $set: { title, content, updatedAt } },
    { returnDocument: "after" },
  );

  if (!result) {
    throw new Error("Post not found or Forbidden");
  }

  return { id, title, content, updatedAt };
}

export async function deletePost(id: string, authorId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const result = await collection.findOneAndDelete({
    id,
    "author.id": authorId,
  });
  if (!result) {
    throw new Error("Post not found or Forbidden");
  }

  return { id };
}

// 相關文章：優先取同作者的其他文章，不足再用最新文章補滿
export async function getRelatedPosts(id: string, limit: number) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const current = await collection.findOne(
    { id },
    { projection: { "author.id": 1 } },
  );
  if (!current) return [];

  const projection = {
    _id: 0,
    id: 1,
    title: 1,
    content: 1,
    createdAt: 1,
    "author.id": 1,
    "author.name": 1,
  };

  const sameAuthorPosts = current.author?.id
    ? await collection
        .find(
          { id: { $ne: id }, "author.id": current.author.id },
          { projection },
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray()
    : [];

  const remaining = limit - sameAuthorPosts.length;
  if (remaining <= 0) return sameAuthorPosts;

  const latestPosts = await collection
    .find(
      { id: { $nin: [id, ...sameAuthorPosts.map((post) => post.id)] } },
      { projection },
    )
    .sort({ createdAt: -1 })
    .limit(remaining)
    .toArray();

  return [...sameAuthorPosts, ...latestPosts];
}

// 首頁 banner 用：全站文章數與會員數
export async function getForumStats() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const [postCount, userCount] = await Promise.all([
    db.collection("posts").countDocuments(),
    db.collection("users").countDocuments(),
  ]);

  return { postCount, userCount };
}
