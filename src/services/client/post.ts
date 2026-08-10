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
  if (!response.ok) {
    throw new Error(resData.message || "無法載入文章列表");
  }
  return resData.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`);
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "無法載入文章");
  }
  return resData.data;
};

export const createPost = async (data: { title: string; content: string }) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "建立文章失敗");
  }
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "更新文章失敗");
  }
  return resData.data;
};

export const deletePost = async (id: string) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(errData.message || "刪除文章失敗，請重試");
  }
  // 204 No Content — 無 body 可解析
};
