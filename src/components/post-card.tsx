// 文章列表卡片
export const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="w-full py-4 px-4 hover:bg-white/5 transition rounded-xl group border-b border-white/10">
      <h3 className="text-lg text-white font-bold group-hover:text-blue-400 transition">
        {post.title}
      </h3>
      <p className="text-sm text-white/60 mt-2 line-clamp-3 leading-relaxed">
        {post.content}
      </p>
      <div className="flex justify-between items-center mt-4 text-xs text-white/30">
        <span>{post.author?.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
