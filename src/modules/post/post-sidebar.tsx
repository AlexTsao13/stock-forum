"use client";

import Link from "next/link";
import MarketOverview from "@/components/market-overview";
import Avatar from "@/components/avatar";

interface PostSidebarProps {
  post: Post;
}

const cardClassName =
  "block rounded-2xl border border-white/10 bg-white/[0.02] p-5";

// 文章內頁右側欄：作者卡片 + 市場概覽
export const PostSidebar = ({ post }: PostSidebarProps) => {
  const authorId = post.author?.id;

  const cardContent = (
    <>
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
        關於作者
      </p>
      <div className="flex items-center gap-3">
        <Avatar name={post.author?.name} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold truncate group-hover:text-blue-400 transition">
            {post.author?.name}
          </p>
          {post.authorPostCount !== undefined && (
            <p className="text-xs text-white/40 mt-0.5">
              發表了 {post.authorPostCount} 篇文章
            </p>
          )}
        </div>
        {authorId && (
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
        )}
      </div>
      {authorId && (
        <p className="mt-4 text-xs text-white/40 group-hover:text-white/60 transition">
          查看作者的所有文章
        </p>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* 舊資料可能沒有 author.id，此時仍顯示卡片，只是不能點 */}
      {authorId ? (
        <Link
          href={`/author/${authorId}`}
          className={`group ${cardClassName} hover:bg-white/[0.05] hover:border-white/20 transition`}
        >
          {cardContent}
        </Link>
      ) : (
        <section className={cardClassName}>{cardContent}</section>
      )}

      <MarketOverview />
    </div>
  );
};
