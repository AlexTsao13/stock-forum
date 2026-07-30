import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/services/client/comment";

const useMutationCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      // 只讓「這篇貼文」的留言列表重新抓取,不影響其他貼文
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};

export default useMutationCreateComment;
