"use client";

import Link from "next/link";
import Pagination from "@/modules/home/pagination";
import useQueryPostList from "@/hooks/use-query-post-list";
import { PostCard } from "@/components/post-card";

interface PostListProps {
  page?: number;
}

const PostList = ({ page = 1 }: PostListProps) => {
  const { data, isLoading, error, isPlaceholderData } = useQueryPostList();
  const { posts = [], totalPages = 1 } = data || {};
  return (
    // 顯示上一頁暫存資料時稍微淡化，讓使用者知道新資料載入中
    <div
      className={`mt-8 transition-opacity duration-200 ${
        isPlaceholderData ? "opacity-60" : ""
      }`}
    >
      {isLoading && <p>Loading...</p>}
      {error && <div>{error.message}</div>}
      {!isLoading && posts.length === 0 && !isLoading && <p>No posts found</p>}
      {!isLoading &&
        posts.map((post: Post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      <div className="mt-8">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default PostList;
