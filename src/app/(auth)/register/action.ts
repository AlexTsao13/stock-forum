"use server";

import { createUser } from "@/service/user";
import { redirect } from "next/navigation";
export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  if (!email || !password) {
    return { error: "請填寫完整資訊" };
  }
  try {
    // 呼叫 createUser 服務
    await createUser(email, password, name);
  } catch (error: any) {
    return { error: error.message || "註冊失敗" };
  }
  // 註冊成功後，自動跳轉到登入頁面
  redirect("/login");
}
