interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPostList = async (page: string): Promise<PostListResponse> => {
  const response = await fetch(`/api/post/list?page=${page}&limit=5`);
  const resData = await response.json();
  return resData.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/post/detail?id=${id}`);
  const resData = await response.json();
  return resData.data;
};
