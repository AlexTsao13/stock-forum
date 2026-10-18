"use server";

import { signIn } from "@/auth";
import { createUser } from "@/services/db/user";
import { registerSchema } from "@/schemas/auth";
import { isRegisterEnabled } from "@/config/constants";

export type RegisterState = {
  error?: string | null;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function registerAction(
  _prevState: RegisterState | null,
  formData: FormData,
): Promise<RegisterState> {
  // 後端也要檢查開關，避免關閉註冊時被直接呼叫
  if (!isRegisterEnabled()) {
    return { error: "目前未開放註冊" };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  try {
    await createUser(email, password, name);
  } catch (error) {
    // createUser 先查重複；同時送出時則由 email 唯一索引擋下（E11000）
    const message = error instanceof Error ? error.message : "";
    if (message.includes("已被註冊") || message.includes("E11000")) {
      return { fieldErrors: { email: ["此信箱已被註冊"] } };
    }
    console.error("Register error:", error);
    return { error: "註冊失敗，請稍後再試" };
  }

  // 註冊成功後直接登入並導回首頁
  // signIn 成功時會丟出 redirect，所以不能包在 try/catch 裡
  await signIn("credentials", { email, password, redirectTo: "/" });
  return {};
}
