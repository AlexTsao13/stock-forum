// 貼文列表卡片
export const PostCard = ({ post }: { post: Post }) => {
  const isEdited = !!post.updatedAt && post.updatedAt > post.createdAt;

  return (
    <div className="w-full py-4 px-4 hover:bg-white/5 transition group border-b border-white/10">
      <h3 className="text-lg text-white font-bold group-hover:text-blue-400 transition">
        {post.title}
      </h3>
      <p className="text-sm text-white/60 mt-2 line-clamp-3 leading-relaxed">
        {post.content}
      </p>
      <div className="flex justify-between items-center mt-4 text-xs text-white/30">
        <span>{post.author?.name}</span>
        <div className="flex items-center gap-2">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {isEdited && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
              已編輯
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
