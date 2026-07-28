export const getCommentList = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/posts/${postId}/comments`);
  const resData = await response.json();
  return resData.data || [];
};

export const addComment = async (data: {
  postId: string;
  content: string;
}): Promise<Comment> => {
  const response = await fetch(`/api/posts/${data.postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: data.content }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to add comment");
  }
  return resData.data;
};
