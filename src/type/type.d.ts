interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  author?: {
    id: string;
    name: string;
  };
}
