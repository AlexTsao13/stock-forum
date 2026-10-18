"use client";
import { useState } from "react";
import useQueryPost from "@/hooks/use-query-post";
import { PostDetail } from "./post-detail";
import { CommentsSection } from "./comments-section";
import { RelatedPosts } from "./related-posts";
import { PostSidebar } from "./post-sidebar";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import PostEditor from "@/modules/home/post-editor";

interface ContentProps {
  session: Session | null;
}

const Content = ({ session }: ContentProps) => {
  const router = useRouter();
  const { data: post, isLoading, error } = useQueryPost();
  const [isEditOpen, setIsEditOpen] = useState(false);

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
    // 桌面版：左側文章 + 右側作者卡片與市場概覽；手機版只顯示文章
    <div className="max-w-2xl mx-auto px-4 py-8 lg:max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:items-start">
      <div className="min-w-0">
        <button
          onClick={() => router.back()}
          className="text-sm text-white/50 hover:text-white transition flex items-center gap-2 mb-8"
        >
          <span>←</span> 返回列表
        </button>
        <PostDetail
          post={post}
          session={session}
          onEditClick={() => setIsEditOpen(true)}
        />
        <CommentsSection postId={post.id} session={session} />
        <RelatedPosts postId={post.id} />
      </div>

      {/* top-24：避開 fixed 的 Navbar（h-16）再留一點間距 */}
      <aside className="hidden lg:block sticky top-24">
        <PostSidebar post={post} />
      </aside>

      {/* 編輯文章 Modal（僅在作者點擊編輯時渲染） */}
      <PostEditor isOpen={isEditOpen} setIsOpen={setIsEditOpen} post={post} />
    </div>
  );
};
export default Content;
