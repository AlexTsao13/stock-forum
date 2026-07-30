import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "@/services/client/comment";

const useMutationUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};

export default useMutationUpdateComment;
