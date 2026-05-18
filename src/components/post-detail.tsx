// 文章全文

export const PostDetail = ({ post }: { post: Post }) => {
  return (
    <div className="w-full pb-10">
      {/* 作者資訊 */}
      <div className="flex items-center gap-3 mb-6 text-gray-400 text-sm">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          {post.author?.name?.[0]}
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-white font-medium">{post.author?.name}</p>
          <span className="text-white/20">|</span>
          <p className="text-white/40">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* 標題 */}
      <h1 className="text-4xl font-extrabold text-white mb-8 leading-tight">
        {post.title}
      </h1>
      {/* 文章內容 */}
      <div className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap border-t border-white/10 pt-8">
        {post.content}
      </div>
    </div>
  );
};
