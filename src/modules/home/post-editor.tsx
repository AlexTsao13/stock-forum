"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import useMutationAddPost from "@/hooks/use-mutation-add-post";
import useMutationUpdatePost from "@/hooks/use-mutation-update-post";
import { postSchema } from "@/schemas/post";

interface PostEditorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // 選填：若傳入 post 則為編輯模式，否則為新增模式
  post?: Pick<Post, "id" | "title" | "content">;
}

const PostEditor = ({ isOpen, setIsOpen, post }: PostEditorProps) => {
  const isEditMode = !!post;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string[];
    content?: string[];
  }>({});

  // 當 Modal 打開時，依模式填入初始值
  useEffect(() => {
    if (isOpen) {
      setTitle(isEditMode ? post.title : "");
      setContent(isEditMode ? post.content : "");
      setFieldErrors({});
    }
  }, [isOpen, isEditMode, post]);

  const {
    mutate: addPost,
    isPending: isAdding,
    error: addError,
    isSuccess: isAddSuccess,
    reset: resetAdd,
  } = useMutationAddPost();

  const {
    mutate: updatePost,
    isPending: isUpdating,
    error: updateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdate,
  } = useMutationUpdatePost();

  const isPending = isAdding || isUpdating;
  const error = addError || updateError;

  // 新增或編輯成功後，關閉 Modal 並重新整理頁面
  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      setIsOpen(false);
      router.refresh();
      resetAdd();
      resetUpdate();
    }
  }, [isAddSuccess, isUpdateSuccess, setIsOpen, router, resetAdd, resetUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 前端先用 Zod 驗證一次
    const parsed = postSchema.safeParse({ title, content });
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    if (isEditMode) {
      updatePost({ id: post.id, ...parsed.data });
    } else {
      addPost(parsed.data);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70" />
      <DialogPanel className="w-full max-w-lg z-50 space-y-4 bg-[#131313] border border-white/10 p-4 rounded-lg">
        <DialogTitle className="font-bold text-white">
          {isEditMode ? "編輯文章" : "What's on your mind?"}
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="title"
              placeholder="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[40px] border text-sm border-white/10 rounded-md p-2 focus:outline-none"
            />
            {fieldErrors.title && (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.title[0]}
              </p>
            )}
          </div>

          <div>
            <textarea
              name="content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[100px] border text-sm border-white/10 rounded-md p-2 focus:outline-none"
            />
            {fieldErrors.content && (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.content[0]}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs">
              {error instanceof Error
                ? error.message
                : isEditMode
                  ? "更新失敗，請重試"
                  : "發文失敗，請重試"}
            </p>
          )}

          <div className="flex gap-3 text-sm justify-end pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
              disabled={isPending}
            >
              {isPending && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>
                {isPending
                  ? isEditMode
                    ? "儲存中..."
                    : "發布中..."
                  : isEditMode
                    ? "儲存修改"
                    : "發布文章"}
              </span>
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

export default PostEditor;
