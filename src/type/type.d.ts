interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  author?: {
    id: string;
    name: string;
  };
  // 只有文章詳情 API 會回傳
  authorPostCount?: number;
  // 只有文章列表 API 會回傳
  commentCount?: number;
}

interface ForumComment {
  id: string;
  postId: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  isDeleted?: boolean;
  deletedAt?: number | null;
  author?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  };
}
