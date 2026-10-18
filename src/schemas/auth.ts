import { z } from "zod";

// 信箱統一去除空白並轉小寫，避免同一個信箱因大小寫不同被當成兩個帳號
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "請輸入電子信箱")
  .email("請輸入正確的電子信箱格式");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(4, "密碼長度至少需要 4 個字元"),
  // 測試環境先不大幅限制密碼長度
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "請輸入暱稱").max(20, "暱稱最多 20 個字"),
    email: emailSchema,
    password: z
      .string()
      .min(6, "密碼長度至少需要 6 個字元")
      .max(72, "密碼最多 72 個字元"), // bcrypt 只取前 72 bytes
    confirmPassword: z.string().min(1, "請再次輸入密碼"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
