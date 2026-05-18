"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    // 呼叫 Auth.js 提供的登入函式
    // "credentials" 對應到在 auth.ts 裡設定的名稱
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // 登入成功後導向首頁
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "信箱或密碼錯誤" };
        default:
          return { error: "登入發生錯誤" };
      }
    }
    // 注意：redirect 內部也是拋出錯誤，所以這裡必須把非 AuthError 拋出去
    throw error;
  }
}
