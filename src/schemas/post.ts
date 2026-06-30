import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "標題不能為空")
    .max(100, "標題最多 100 個字"),
  content: z
    .string()
    .min(10, "內容至少需要 10 個字"),
});

export type PostInput = z.infer<typeof postSchema>;
