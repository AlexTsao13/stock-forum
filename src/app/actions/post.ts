"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

// Zod Schema：定義表單的規則（標題、內容的格式要求）
const postSchema = z.object({
  title: z
    .string()
    .min(1, "標題不能為空")
    .max(100, "標題最多 100 個字"),
  content: z.string().min(10, "內容至少需要 10 個字"),
});

export type AddPostState = {
  error?: string | null;
  fieldErrors?: {
    title?: string[];
    content?: string[];
  };
  success?: boolean;
};

export async function addPostAction(
  _prevState: AddPostState,
  formData: FormData,
): Promise<AddPostState> {
  // 1. 確認已登入
  const session = await auth();
  if (!session?.user) {
    return { error: "請先登入才能發文" };
  }

  // 2. 用 Zod 驗證表單資料
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // 3. 寫入資料庫
  const { title, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection("posts").insertOne({
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().getTime(),
    author: {
      id: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
    },
  });

  // 4. 清除首頁快取，讓新文章立即顯示
  revalidatePath("/");

  return { success: true };
}
