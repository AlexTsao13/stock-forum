import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { commentSchema, CommentInput } from "@/schemas/comment";
import { v4 as uuidv4 } from "uuid";

// 根據文章 ID 取得所有留言（依時間正序）
export async function getCommentsByPostId(postId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  return await collection
    .find({ postId })
    .sort({ createdAt: 1 })
    .toArray();
}

// 建立新留言
export async function createComment(
  rawData: CommentInput,
  author: { id?: string | null; name?: string | null; email?: string | null }
) {
  // 1. Zod schema validation
  const parsed = commentSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const message =
      firstError.content?.[0] || firstError.postId?.[0] || "資料格式錯誤";
    throw new Error(message);
  }

  const { postId, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const newComment = {
    id: uuidv4(),
    postId,
    content,
    createdAt: new Date().getTime(),
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
  };

  await collection.insertOne(newComment);
  return newComment;
}
