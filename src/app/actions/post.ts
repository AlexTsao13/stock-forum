"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPost } from "@/services/db/post";
import { postSchema } from "@/schemas/post";

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
  formData: FormData
): Promise<AddPostState> {
  // 1. 確認已登入
  const session = await auth();
  if (!session?.user) {
    return { error: "請先登入才能發文" };
  }

  const title = formData.get("title");
  const content = formData.get("content");

  // 2. 用 Zod 驗證表單資料
  const parsed = postSchema.safeParse({ title, content });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 3. 呼叫伺服器端資料庫服務寫入
    await createPost(parsed.data, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });

    // 4. 清除快取以立即更新首頁
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "發文失敗，請重試" };
  }
}
