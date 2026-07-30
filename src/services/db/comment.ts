import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import {
  commentSchema,
  commentContentSchema,
  CommentInput,
  CommentContentInput,
} from "@/schemas/comment";
import { v4 as uuidv4 } from "uuid";

// 根據文章 ID 取得所有留言（依時間正序）
export async function getCommentsByPostId(postId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const comments = await collection
    .find({ postId })
    .sort({ createdAt: 1 })
    .toArray();

  return comments.map((comment) => ({
    ...comment,
    content: comment.isDeleted ? "" : comment.content,
  }));
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
    isDeleted: false,
    deletedAt: null,
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
  };

  await collection.insertOne(newComment);
  return newComment;
}

export async function updateComment(
  id: string,
  rawData: CommentContentInput,
  authorId: string,
) {
  const parsed = commentContentSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const message = firstError.content?.[0] || "Invalid comment data";
    throw new Error(message);
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const comment = await collection.findOne({ id });
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.author?.id !== authorId) {
    throw new Error("Forbidden: You are not the author of this comment");
  }

  if (comment.isDeleted) {
    throw new Error("Comment not found");
  }

  const { content } = parsed.data;
  await collection.updateOne(
    { id },
    { $set: { content, updatedAt: new Date().getTime() } },
  );

  return { id, content };
}

export async function deleteComment(id: string, authorId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const comment = await collection.findOne({ id });
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.author?.id !== authorId) {
    throw new Error("Forbidden: You are not the author of this comment");
  }

  await collection.updateOne(
    { id },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date().getTime(),
      },
    },
  );
  return { id };
}
