import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/services/client/post";

const useMutationUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (_, variables) => {
      // 讓文章列表與該篇文章詳情重新獲取最新資料
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
    },
  });
};

export default useMutationUpdatePost;
