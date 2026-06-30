import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "請輸入電子信箱")
    .email("請輸入正確的電子信箱格式"),
  password: z
    .string()
    .min(6, "密碼長度至少需要 6 個字元"),
});

export type LoginInput = z.infer<typeof loginSchema>;
