interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPostList = async (page: string): Promise<PostListResponse> => {
  const response = await fetch(`/api/posts?page=${page}&limit=5`);
  const resData = await response.json();
  return resData.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`);
  const resData = await response.json();
  return resData.data;
};

export const addPost = async (data: { title: string; content: string }) => {
  const response = await fetch("/api/posts", {
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
  const { id, title, content } = data;
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),
  });
  const resData = await response.json();
  return resData.data;
};

export const deletePost = async (id: string) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
  const resData = await response.json();
  return resData.data;
};
