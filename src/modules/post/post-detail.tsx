"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import useMutationDeletePost from "@/hooks/use-mutation-delete-post";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ConfirmDialog from "@/components/confirm-dialog";
import useQueryComments from "@/hooks/use-query-comments";
import Avatar from "@/components/avatar";
import MarkdownContent from "@/components/markdown-content";
import { formatRelativeTime } from "@/utils/text";

interface PostDetailProps {
  post: Post;
  session: Session | null;
  onEditClick: () => void;
}

export const PostDetail = ({ post, session, onEditClick }: PostDetailProps) => {
  const router = useRouter();
  const isAuthor = session?.user?.id === post.author?.id;
  const isEdited = !!post.updatedAt && post.updatedAt > post.createdAt;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // 與留言區共用同一個 query key，React Query 不會重複請求
  const { data: comments } = useQueryComments(post.id);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch {
      // 瀏覽器不允許存取剪貼簿時不做任何事
    }
  };

  const handleScrollToComments = () => {
    document
      .getElementById("comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const {
    mutate: deletePost,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    reset: resetDelete,
  } = useMutationDeletePost();

  useEffect(() => {
    if (isDeleteSuccess) {
      router.push("/");
    }
  }, [isDeleteSuccess, router]);

  const handleOpenDeleteDialog = () => {
    resetDelete();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePost(post.id);
  };

  return (
    <div className="w-full pb-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Avatar name={post.author?.name} size="sm" />
          <div className="flex gap-2 items-center">
            {post.author?.id ? (
              <Link
                href={`/author/${post.author.id}`}
                className="text-white font-medium hover:text-blue-400 transition"
              >
                {post.author.name}
              </Link>
            ) : (
              <p className="text-white font-medium">{post.author?.name}</p>
            )}
            <span className="text-white/20">|</span>
            <time
              dateTime={new Date(post.createdAt).toISOString()}
              title={new Date(post.createdAt).toLocaleString()}
              className="text-white/40"
            >
              {formatRelativeTime(post.createdAt)}
            </time>
            {comments && (
              <>
                <span className="text-white/20">|</span>
                <p className="text-white/40">{comments.length} 則留言</p>
              </>
            )}
            {isEdited && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
                已編輯
              </span>
            )}
          </div>
        </div>

        {isAuthor && (
          <Menu as="div" className="relative">
            <MenuButton
              aria-label="貼文操作"
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
                  <span>編輯</span>
                </button>
              </MenuItem>

              <MenuItem>
                <button
                  onClick={handleOpenDeleteDialog}
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
                  <span>{isDeleting ? "刪除中..." : "刪除"}</span>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        )}
      </div>

      <h1 className="text-4xl font-extrabold text-white mb-8 leading-tight">
        {post.title}
      </h1>

      {/* 內文以 Markdown 渲染（粗體、清單、連結等） */}
      <div className="text-lg text-white/80 leading-relaxed break-words border-t border-white/10 pt-8">
        <MarkdownContent content={post.content} />
      </div>

      {/* 文末操作列 */}
      <div className="flex items-center gap-2 mt-10">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition cursor-pointer"
        >
          {isLinkCopied ? (
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
          <span>{isLinkCopied ? "已複製連結" : "複製連結"}</span>
        </button>

        <button
          type="button"
          onClick={handleScrollToComments}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition cursor-pointer"
        >
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
          <span>前往留言</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="刪除貼文"
        description="確定要刪除這篇貼文嗎？刪除後無法復原。"
        isPending={isDeleting || isDeleteSuccess}
        error={
          deleteError
            ? deleteError instanceof Error
              ? deleteError.message
              : "刪除貼文失敗"
            : null
        }
      />
    </div>
  );
};
