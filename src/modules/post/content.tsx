"use client";
import useQueryPost from "@/hooks/use-query-post";
import { PostDetail } from "./post-detail";
import { CommentsSection } from "./comments-section";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface ContentProps {
  session: Session | null;
}

const Content = ({ session }: ContentProps) => {
  const router = useRouter();
  const { data: post, isLoading, error } = useQueryPost();
  //  處理載入中狀態
  if (isLoading) {
    return <div className="py-20 text-center text-white/50">文章載入中...</div>;
  }
  //  處理錯誤或找不到文章
  if (error || !post) {
    return (
      <div className="py-20 text-center text-white/50">
        找不到這篇文章
        <button
          onClick={() => router.back()}
          className="block mx-auto mt-4 text-blue-400"
        >
          返回
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-white/50 hover:text-white transition flex items-center gap-2 mb-8"
      >
        <span>←</span> 返回列表
      </button>
      <PostDetail post={post} />
      <CommentsSection postId={post.id} session={session} />
    </div>
  );
};
export default Content;
