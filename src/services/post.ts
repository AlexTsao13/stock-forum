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

export const addPost = async (data: {
  title: string;
  content: string;
}): Promise<Post> => {
  const response = await fetch("/api/post/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  return resData.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/post/detail?id=${id}`);
  const resData = await response.json();
  return resData.data;
};
