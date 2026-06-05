import { useQuery } from "@tanstack/react-query";
import { getCommentList } from "@/services/comment";

const useQueryComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentList(postId),
    enabled: !!postId,
  });
};

export default useQueryComments;
