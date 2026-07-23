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

export const addPost = async (data: { title: string; content: string }) => {
  const response = await fetch("/api/post/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  return resData.data;
};

export const updatePost = async (data: {
  id: string;
  title: string;
  content: string;
}) => {
  const response = await fetch("/api/post/update", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  return resData.data;
};

export const deletePost = async (id: string) => {
  const response = await fetch(`/api/post/delete?id=${id}`, {
    method: "DELETE",
  });
  const resData = await response.json();
  return resData.data;
};
