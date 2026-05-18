interface PostProps {
  post?: Post;
}

const Post = ({ post }: PostProps) => {
  const {
    title = "--",
    content = "-",
    createdAt = 0,
    author = { name: "-" },
  } = post || {};

  return (
    <div className="w-full border-b border-white/10 py-6 ">
      <h3 className="text-lg text-white font-bold">{title}</h3>
      <p className="text-sm text-white/70 mt-2 leading-relaxed">{content}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">發文者：{author.name}</span>
        <p className="text-xs text-white/30">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Post;
