import Avatar from "@/components/avatar";
import { formatRelativeTime, stripMarkdown } from "@/utils/text";

// 貼文列表卡片
export const PostCard = ({ post }: { post: Post }) => {
  const isEdited = !!post.updatedAt && post.updatedAt > post.createdAt;

  return (
    <div className="w-full py-4 px-4 hover:bg-white/5 transition group border-b border-white/10">
      <h3 className="text-lg text-white font-bold group-hover:text-blue-400 transition">
        {post.title}
      </h3>
      {/* 摘要去除 Markdown 符號，避免出現 ** 之類的字元 */}
      <p className="text-sm text-white/60 mt-2 line-clamp-2 leading-relaxed">
        {stripMarkdown(post.content)}
      </p>
      <div className="flex items-center justify-between gap-3 mt-4 text-xs text-white/40">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={post.author?.name} size="xs" />
          <span className="text-white/70 font-medium truncate">
            {post.author?.name}
          </span>
          <span className="text-white/20">·</span>
          <time
            dateTime={new Date(post.createdAt).toISOString()}
            title={new Date(post.createdAt).toLocaleString()}
            className="shrink-0"
          >
            {formatRelativeTime(post.createdAt)}
          </time>
          {isEdited && (
            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
              已編輯
            </span>
          )}
        </div>
        {post.commentCount !== undefined && (
          <span className="flex items-center gap-1.5 shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {post.commentCount}
          </span>
        )}
      </div>
    </div>
  );
};
