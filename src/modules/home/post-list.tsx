import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { PostCard } from "@/components/post-card";
import Pagination from "@/modules/home/pagination";

const POSTS_PER_PAGE = 5;

interface PostListProps {
  page?: number;
}

// Server Component：直接在伺服器查資料庫，不需要 useQuery、不需要 API route
const PostList = async ({ page = 1 }: PostListProps) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");

  const total = await collection.countDocuments();
  const posts = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .toArray();

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mt-8">
      {posts.length === 0 && (
        <p className="text-white/50 text-center py-8">目前還沒有文章</p>
      )}
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <PostCard post={post as unknown as Post} />
        </Link>
      ))}
      <div className="mt-8">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default PostList;
