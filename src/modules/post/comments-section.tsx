"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useQueryComments from "@/hooks/use-query-comments";
import useMutationCreateComment from "@/hooks/use-mutation-create-comment";
import useMutationUpdateComment from "@/hooks/use-mutation-update-comment";
import useMutationDeleteComment from "@/hooks/use-mutation-delete-comment";
import { commentContentSchema } from "@/schemas/comment";

interface CommentsSectionProps {
  postId: string;
  session: Session | null;
}

export const CommentsSection = ({ postId, session }: CommentsSectionProps) => {
  const [commentContent, setCommentContent] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingFieldError, setEditingFieldError] = useState<string | null>(null);
  const router = useRouter();

  // Query Comments (不變)
  const { data: comments = [], isLoading, error } = useQueryComments(postId);

  const {
    mutate: createComment,
    isPending,
    error: submitError,
  } = useMutationCreateComment(postId);
  const { mutate: updateComment, isPending: isUpdating } = useMutationUpdateComment(postId);
  const { mutate: removeComment, isPending: isDeleting } = useMutationDeleteComment(postId);

  const isLoggedIn = !!session?.user;

  const resetEditingState = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setEditingFieldError(null);
  };

  const handleStartEdit = (comment: ForumComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setEditingFieldError(null);
  };

  const handleCancelEdit = () => {
    resetEditingState();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    const parsed = commentContentSchema.safeParse({ content: commentContent });

    // 前端先用 Zod 驗證一次
    // const parsed = commentSchema.safeParse({ postId, content: commentContent });
    if (!parsed.success) {
      const firstError = parsed.error.flatten().fieldErrors;
      setFieldError(firstError.content?.[0] ?? "資料格式錯誤");
      return;
    }

    createComment({ postId, content: parsed.data.content }, {
      onSuccess: () => {
        setCommentContent("");
      },
    });
  };

  const handleUpdateSubmit = (commentId: string) => {
    setEditingFieldError(null);
    const parsed = commentContentSchema.safeParse({ content: editingContent });

    if (!parsed.success) {
      const firstError = parsed.error.flatten().fieldErrors;
      setEditingFieldError(firstError.content?.[0] ?? "資料格式錯誤");
      return;
    }

    updateComment(
      { postId, id: commentId, content: parsed.data.content },
      {
        onSuccess: () => {
          resetEditingState();
        },
        onError: (error) => {
          setEditingFieldError(
            error instanceof Error ? error.message : "更新留言失敗",
          );
        },
      },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm("確定要刪除這則留言嗎？")) {
      return;
    }

    removeComment(
      { postId, id: commentId },
      {
        onError: (error) => {
          alert(error instanceof Error ? error.message : "刪除留言失敗");
        },
      },
    );
    if (editingCommentId === commentId) {
      resetEditingState();
    }
  };

  return (
    <div className="w-full mt-10 pt-10 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-white">留言區</h2>
        <span className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/5">
          {comments.length}
        </span>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {isLoading && (
          <div className="py-8 text-center text-white/30 text-sm flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white/85 rounded-full animate-spin" />
            <span>載入留言中...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-400 text-sm">
            留言載入失敗，請稍後再試
          </div>
        )}

        {!isLoading && !error && comments.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">
            <p className="font-semibold text-white/40">目前還沒有留言</p>
            <p className="text-xs mt-1 text-white/20">成為第一個留言的人吧</p>
          </div>
        )}

        {!isLoading && !error && comments.length > 0 && (
          <div className="divide-y divide-white/5">
            {comments.map((comment: ForumComment) => {
              const isAuthor = session?.user?.id === comment.author?.id;
              const isEditing = editingCommentId === comment.id;
              const isDeleted = !!comment.isDeleted;
              const isEdited = !!comment.updatedAt && !isDeleted;

              return (
                <div
                  key={comment.id}
                  className="hover:bg-white/[0.02] p-4 transition-all duration-300 group relative"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 via-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0 select-none">
                      {comment.author?.name?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold text-xs">
                            {comment.author?.name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-white/30 text-[10px]">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            {isEdited && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
                                已編輯
                              </span>
                            )}
                            {isDeleted && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40">
                                已刪除
                              </span>
                            )}
                          </div>
                        </div>

                        {isAuthor && !isDeleted && (
                          <Menu as="div" className="relative shrink-0">
                            <MenuButton
                              aria-label="留言操作"
                              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </MenuButton>

                            <MenuItems className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-[#1a1a1a] border border-white/10 p-1 shadow-xl shadow-black/50 focus:outline-none z-50">
                              <MenuItem>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(comment)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                                >
                                  <span>編輯</span>
                                </button>
                              </MenuItem>
                              <MenuItem>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  disabled={isDeleting}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer disabled:opacity-50"
                                >
                                  <span>{isDeleting ? "刪除中..." : "刪除"}</span>
                                </button>
                              </MenuItem>
                            </MenuItems>
                          </Menu>
                        )}
                      </div>

                      {isDeleted ? (
                        <p className="mt-3 text-sm italic text-white/35">
                          此留言已刪除
                        </p>
                      ) : isEditing ? (
                        <div className="mt-3 space-y-3">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full min-h-[96px] rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 resize-none"
                            placeholder="編輯留言內容..."
                          />
                          {editingFieldError && (
                            <p className="text-red-400 text-xs">{editingFieldError}</p>
                          )}
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition cursor-pointer"
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateSubmit(comment.id)}
                              disabled={isUpdating || !editingContent.trim()}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdating ? "儲存中..." : "儲存"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white/80 text-sm mt-1.5 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoggedIn ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white/[0.01] hover:bg-white/[0.02] focus-within:bg-white/[0.03] transition-all duration-300"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 select-none">
                {session.user?.name?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <textarea
                  name="content"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="輸入你的留言..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none min-h-[80px] leading-relaxed pt-1"
                />

                {(fieldError || submitError) && (
                  <p className="text-red-400 text-xs mt-1">
                    {fieldError ??
                      (submitError instanceof Error
                        ? submitError.message
                        : "留言失敗，請重試")}
                  </p>
                )}

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30">
                    以{" "}
                    <span className="text-white/60 font-medium">
                      {session.user?.name}
                    </span>{" "}
                    留言
                  </span>
                  <button
                    type="submit"
                    disabled={isPending || !commentContent.trim()}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 disabled:cursor-not-allowed rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    {isPending ? "送出中..." : "送出留言"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            onClick={() => router.push("/login")}
            className="p-4 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all duration-300 group"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/40 font-bold text-sm shadow-md flex-shrink-0 select-none">
                ?
              </div>

              <div className="flex-1">
                <textarea
                  readOnly
                  placeholder="登入後即可留言..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none min-h-[80px] leading-relaxed pt-1 cursor-pointer"
                />

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30 group-hover:text-white/50 transition">
                    先登入再開始留言
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    登入
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
