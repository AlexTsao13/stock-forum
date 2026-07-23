import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "請輸入電子信箱").email("請輸入正確的電子信箱格式"),
  password: z.string().min(4, "密碼長度至少需要 4 個字元"),
  // 測試環境先不大幅限制密碼長度
});

export type LoginInput = z.infer<typeof loginSchema>;
