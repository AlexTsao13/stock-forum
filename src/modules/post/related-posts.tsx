"use client";

import Link from "next/link";
import useQueryRelatedPosts from "@/hooks/use-query-related-posts";

interface RelatedPostsProps {
  postId: string;
}

export const RelatedPosts = ({ postId }: RelatedPostsProps) => {
  const { data: posts = [], isLoading } = useQueryRelatedPosts(postId);

  // 沒有其他文章時整個區塊不顯示
  if (!isLoading && posts.length === 0) return null;

  return (
    <div className="w-full mt-10 pt-10 border-t border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">相關文章</h2>

      {/* 與留言區相同的容器樣式，每篇文章一列 */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 space-y-2 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-24 rounded bg-white/5" />
              </div>
            ))
          : posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="group flex items-center gap-4 p-4 hover:bg-white/[0.04] transition"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/50 truncate">
                    {post.content}
                  </p>
                  <p className="mt-2 text-[11px] text-white/30">
                    {post.author?.name}
                    <span className="mx-1.5">·</span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <svg
                  className="w-4 h-4 shrink-0 text-white/20 group-hover:text-blue-400 group-hover:translate-x-0.5 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
      </div>
    </div>
  );
};
