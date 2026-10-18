import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { postSchema, PostInput } from "@/schemas/post";
import { v4 as uuidv4 } from "uuid";
import { setupIndexes } from "./initIndexes";

export async function createPost(
  rawData: PostInput,
  author: { id?: string | null; name?: string | null; email?: string | null },
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
  };

  await db.collection("posts").insertOne(newPost);
  return newPost;
}

export async function getPostList(page: number, limit: number) {
  await setupIndexes();
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const skip = (page - 1) * limit;

  const [result] = await collection
    .aggregate([
      {
        $facet: {
          posts: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
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

export async function getPostById(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  return await collection.findOne({ id });
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
