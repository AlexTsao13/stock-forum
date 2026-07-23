"use client";

// 文章全文

import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import useMutationDeletePost from "@/hooks/use-mutation-delete-post";
import { useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface PostDetailProps {
  post: Post;
  session: Session | null;
  onEditClick: () => void;
}

export const PostDetail = ({ post, session, onEditClick }: PostDetailProps) => {
  const router = useRouter();
  const isAuthor = session?.user?.id === post.author?.id;

  const {
    mutate: deletePost,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
  } = useMutationDeletePost();

  // 刪除成功後導回首頁
  useEffect(() => {
    if (isDeleteSuccess) {
      router.push("/");
    }
  }, [isDeleteSuccess, router]);

  const handleDelete = () => {
    if (!confirm("確定要刪除這篇文章嗎？此動作無法復原。")) return;
    deletePost(post.id);
  };

  return (
    <div className="w-full pb-10">
      {/* 作者資訊 + 操作按鈕 */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
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

        {/* 僅作者可見的操作選單 (...) */}
        {isAuthor && (
          <Menu as="div" className="relative">
            <MenuButton
              aria-label="更多選項"
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer flex items-center justify-center focus:outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-[#1a1a1a] border border-white/10 p-1 shadow-xl shadow-black/50 focus:outline-none transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 z-50"
            >
              <MenuItem>
                <button
                  onClick={onEditClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>編輯文章</span>
                </button>
              </MenuItem>

              <MenuItem>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>{isDeleting ? "刪除中..." : "刪除文章"}</span>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        )}
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
