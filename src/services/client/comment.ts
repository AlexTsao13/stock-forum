export const getCommentList = async (postId: string): Promise<ForumComment[]> => {
  const response = await fetch(`/api/posts/${postId}/comments`);
  const resData = await response.json();
  return resData.data || [];
};

export const createComment = async (data: {
  postId: string;
  content: string;
}): Promise<ForumComment> => {
  const response = await fetch(`/api/posts/${data.postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: data.content }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to create comment");
  }
  return resData.data;
};

export const updateComment = async (data: {
  postId: string;
  id: string;
  content: string;
}): Promise<Pick<ForumComment, "id" | "content">> => {
  const response = await fetch(`/api/posts/${data.postId}/comments`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId: data.id, content: data.content }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to update comment");
  }

  return resData.data;
};

export const deleteComment = async (
  data: { postId: string; id: string },
): Promise<Pick<ForumComment, "id">> => {
  const response = await fetch(`/api/posts/${data.postId}/comments`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId: data.id }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to delete comment");
  }

  return resData.data;
};
