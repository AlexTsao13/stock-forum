import { useQuery } from "@tanstack/react-query";
import { getRelatedPosts } from "@/services/client/post";

const useQueryRelatedPosts = (postId: string) => {
  return useQuery({
    queryKey: ["posts", "related", postId],
    queryFn: () => getRelatedPosts(postId),
  });
};

export default useQueryRelatedPosts;
