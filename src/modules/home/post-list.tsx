"use client";

import Link from "next/link";
import Pagination from "@/modules/home/pagination";
import useQueryPostList from "@/hooks/use-query-post-list";
import { PostCard } from "@/components/post-card";

// 載入中的骨架畫面，形狀與 PostCard 相同；也給頁面的 Suspense fallback 使用
export const PostListSkeleton = () => (
  <div className="mt-2" aria-label="文章載入中">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="py-4 px-4 border-b border-white/10 space-y-3 animate-pulse"
      >
        <div className="h-5 w-2/3 rounded bg-white/10" />
        <div className="h-3.5 w-full rounded bg-white/5" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/5" />
        </div>
      </div>
    ))}
  </div>
);

interface PostListProps {
  page?: number;
  // 選填：只顯示該作者的文章
  authorId?: string;
}

const PostList = ({ authorId }: PostListProps) => {
  const { data, isLoading, error, isPlaceholderData } =
    useQueryPostList(authorId);
  const { posts = [], totalPages = 1 } = data || {};
  return (
    // 顯示上一頁暫存資料時稍微淡化，讓使用者知道新資料載入中
    <div
      className={`mt-2 transition-opacity duration-200 ${
        isPlaceholderData ? "opacity-60" : ""
      }`}
    >
      {isLoading && <PostListSkeleton />}
      {error && (
        <div className="py-12 text-center text-sm text-red-400">
          文章載入失敗，請稍後再試
        </div>
      )}
      {!isLoading && !error && posts.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-semibold text-white/50">目前還沒有文章</p>
          <p className="mt-1 text-xs text-white/30">成為第一個發文的人吧</p>
        </div>
      )}
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
