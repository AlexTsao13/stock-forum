import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { postSchema } from "@/schemas/post";
import { ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";
import { v4 as uuidv4 } from "uuid";
import { setupIndexes } from "./initIndexes";

// 舊資料的作者快照可能含 email，讀取時一律排除，避免透過公開 API 外流
const PUBLIC_POST_PROJECTION = { "author.email": 0 };

export async function createPost(
  rawData: unknown,
  author: { id?: string | null; name?: string | null },
) {
  // 1. Zod schema validation
  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new ValidationError(
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
            { $project: PUBLIC_POST_PROJECTION },
          ],
          totalCount: [
            { $count: "total" },
          ],
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
  return await collection.findOne({ id }, { projection: PUBLIC_POST_PROJECTION });
}

// 帶作者條件的寫入沒有命中時，再查一次文章是否存在，區分 404 與 403
async function throwPostNotFoundOrForbidden(id: string): Promise<never> {
  const client = await clientPromise;
  const exists = await client
    .db(DB_NAME)
    .collection("posts")
    .countDocuments({ id }, { limit: 1 });

  if (!exists) {
    throw new NotFoundError("找不到這篇文章");
  }
  throw new ForbiddenError("只有作者可以修改這篇文章");
}

export async function updatePost(
  id: string,
  rawData: unknown,
  authorId: string,
) {
  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new ValidationError(
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
    await throwPostNotFoundOrForbidden(id);
  }

  return { id, title, content, updatedAt };
}

export async function deletePost(id: string, authorId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  // 文章與其留言在同一個交易中刪除：任一步失敗就整個回滾，不會留下孤兒留言
  // （交易需要 replica set，MongoDB Atlas 預設即是）
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const result = await collection.findOneAndDelete(
        { id, "author.id": authorId },
        { session },
      );
      if (!result) {
        await throwPostNotFoundOrForbidden(id);
      }

      await db.collection("comments").deleteMany({ postId: id }, { session });
    });
  } finally {
    await session.endSession();
  }

  return { id };
}
