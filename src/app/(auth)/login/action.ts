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
  formData: FormData
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
          return { error: "信箱或密碼錯誤" };
        default:
          return { error: "登入發生錯誤" };
      }
    }
    throw error;
  }
}

export async function loginAsGuestAction(): Promise<LoginState> {
  const email = process.env.DEMO_EMAIL || "visitor@stockmarket.com";
  const password = process.env.DEMO_PASSWORD || "123456";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Redirect to home on success
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "訪客帳號登入失敗，請確認伺服器設定" };
    }
    throw error;
  }
}
