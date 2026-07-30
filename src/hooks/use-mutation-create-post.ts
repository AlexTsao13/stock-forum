import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/services/client/post";

const useMutationCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 新增成功後,讓貼文列表重新抓取最新資料
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useMutationCreatePost;
