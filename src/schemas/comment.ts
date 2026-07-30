import { z } from "zod";

export const commentSchema = z.object({
  postId: z.string().min(1, "貼文 ID 不能為空"),
  content: z.string().min(1, "留言內容不能為空").max(500, "留言最多 500 個字"),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const commentContentSchema = z.object({
  content: z.string().min(1, "留言內容不可為空").max(500, "留言最多 500 個字"),
});

export type CommentContentInput = z.infer<typeof commentContentSchema>;
