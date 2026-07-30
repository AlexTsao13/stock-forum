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
