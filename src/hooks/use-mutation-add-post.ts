import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPost } from "@/services/api/post";

const useMutationAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      // 新增成功後,讓貼文列表重新抓取最新資料
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useMutationAddPost;
