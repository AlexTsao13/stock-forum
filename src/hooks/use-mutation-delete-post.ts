import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/services/client/post";

const useMutationDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 刪除成功後，讓貼文列表重新獲取最新資料
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useMutationDeletePost;
