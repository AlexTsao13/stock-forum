import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { commentSchema, commentContentSchema } from "@/schemas/comment";
import { ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";
import { v4 as uuidv4 } from "uuid";

// 根據文章 ID 取得所有留言（依時間正序）
export async function getCommentsByPostId(postId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const comments = await collection
    // 舊資料的作者快照可能含 email，讀取時排除，避免透過公開 API 外流
    .find({ postId }, { projection: { "author.email": 0 } })
    .sort({ createdAt: 1 })
    .toArray();

  return comments.map((comment) => ({
    ...comment,
    content: comment.isDeleted ? "" : comment.content,
  }));
}

// 建立新留言
export async function createComment(
  rawData: unknown,
  author: { id?: string | null; name?: string | null },
) {
  // 1. Zod schema validation
  const parsed = commentSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const message =
      firstError.content?.[0] || firstError.postId?.[0] || "資料格式錯誤";
    throw new ValidationError(message);
  }

  const { postId, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  // 文章不存在時不建立留言，避免產生孤兒資料
  const postExists = await db
    .collection("posts")
    .countDocuments({ id: postId }, { limit: 1 });
  if (!postExists) {
    throw new NotFoundError("找不到這篇文章");
  }

  const newComment = {
    id: uuidv4(),
    postId,
    content,
    createdAt: new Date(),
    isDeleted: false,
    deletedAt: null,
    author: {
      id: author.id,
      name: author.name,
    },
  };

  await collection.insertOne(newComment);
  return newComment;
}

// 帶作者條件的寫入沒有命中時，再查一次留言是否存在，區分 404 與 403
async function throwCommentNotFoundOrForbidden(id: string): Promise<never> {
  const client = await clientPromise;
  const comment = await client
    .db(DB_NAME)
    .collection("comments")
    .findOne({ id }, { projection: { isDeleted: 1 } });

  if (!comment || comment.isDeleted) {
    throw new NotFoundError("找不到這則留言");
  }
  throw new ForbiddenError("只有作者可以修改這則留言");
}

export async function updateComment(
  id: string,
  rawData: unknown,
  authorId: string,
) {
  const parsed = commentContentSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const message = firstError.content?.[0] || "Invalid comment data";
    throw new ValidationError(message);
  }

  const { content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const result = await collection.findOneAndUpdate(
    { id, "author.id": authorId, isDeleted: false },
    { $set: { content, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!result) {
    await throwCommentNotFoundOrForbidden(id);
  }

  return { id, content };
}

export async function deleteComment(id: string, authorId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  // 不限定 isDeleted:false：重複刪除（連點、重送）仍回成功，保持冪等
  const result = await collection.findOneAndUpdate(
    { id, "author.id": authorId },
    { $set: { isDeleted: true, deletedAt: new Date() } },
  );

  if (!result) {
    await throwCommentNotFoundOrForbidden(id);
  }

  return { id };
}
