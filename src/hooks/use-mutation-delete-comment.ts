import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/services/client/comment";

const useMutationDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};

export default useMutationDeleteComment;
