"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "@/schemas/auth";

export type LoginState = {
  error?: string | null;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate inputs using Zod Schema
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/", // Redirect to home on success
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log(error);
          return { error: "信箱或密碼錯誤" };
        default:
          return { error: "登入發生錯誤" };
      }
    }

    throw error;
  }
}

// 訪客匿名登入：每次建立一個獨立的暫時帳號（見 auth.ts 的 guest provider）
export async function loginAsGuestAction(): Promise<LoginState> {
  try {
    await signIn("guest", { redirectTo: "/" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "訪客登入失敗，請稍後再試" };
    }
    throw error;
  }
}
