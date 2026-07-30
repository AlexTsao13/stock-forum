import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/services/client/post";

const useMutationUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (_data, variables) => {
      // 更新成功後，讓貼文列表與該貼文詳情重新抓取最新資料
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
    },
  });
};

export default useMutationUpdatePost;
