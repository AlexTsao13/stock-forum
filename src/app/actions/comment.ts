"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

// Zod Schema：留言內容不能空白
const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1, "留言內容不能為空").max(500, "留言最多 500 個字"),
});

export type AddCommentState = {
  error?: string | null;
  success?: boolean;
};

export async function addCommentAction(
  _prevState: AddCommentState,
  formData: FormData,
): Promise<AddCommentState> {
  // 1. 確認已登入
  const session = await auth();
  if (!session?.user) {
    return { error: "請先登入才能留言" };
  }

  // 2. 用 Zod 驗證
  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    return { error: firstError.content?.[0] ?? "資料格式錯誤" };
  }

  // 3. 寫入資料庫
  const { postId, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection("comments").insertOne({
    id: uuidv4(),
    postId,
    content,
    createdAt: new Date().getTime(),
    author: {
      id: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
    },
  });

  // 4. 清除文章頁快取，讓新留言立即顯示
  revalidatePath(`/post/${postId}`);

  return { success: true };
}
