export const getCommentList = async (
  postId: string,
): Promise<ForumComment[]> => {
  const response = await fetch(`/api/posts/${postId}/comments`);
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "無法載入留言");
  }
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
  const response = await fetch(
    `/api/posts/${data.postId}/comments/${data.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: data.content }),
    },
  );

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to update comment");
  }

  return resData.data;
};

export const deleteComment = async (data: {
  postId: string;
  id: string;
}): Promise<void> => {
  const response = await fetch(
    `/api/posts/${data.postId}/comments/${data.id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(errData.message || "Failed to delete comment");
  }
  // 204 No Content — 無 body 可解析
};
