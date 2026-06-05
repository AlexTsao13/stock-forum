export const getCommentList = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/comment/list?postId=${postId}`);
  const resData = await response.json();
  return resData.data || [];
};

export const addComment = async (data: {
  postId: string;
  content: string;
}): Promise<Comment> => {
  const response = await fetch("/api/comment/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to add comment");
  }
  return resData.data;
};
