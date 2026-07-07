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
import { postSchema } from "@/schemas/post";

interface PostEditorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PostEditor = ({ isOpen, setIsOpen }: PostEditorProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string[];
    content?: string[];
  }>({});

  const {
    mutate: addPost,
    isPending,
    error,
    isSuccess,
    reset,
  } = useMutationAddPost();

  // 成功後關閉 Modal、清空表單、重新整理首頁
  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      setTitle("");
      setContent("");
      router.refresh();
      reset(); // 重置 mutation 狀態,避免下次打開 Modal 殘留上次的成功狀態
    }
  }, [isSuccess, setIsOpen, router, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 前端先用 Zod 驗證一次
    const parsed = postSchema.safeParse({ title, content });
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    addPost(parsed.data);
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
          What&apos;s on your mind?
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
              {error instanceof Error ? error.message : "發文失敗，請重試"}
            </p>
          )}

          <div className="flex gap-4 text-sm justify-end">
            <button
              type="button"
              className="text-white/50 font-bold cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white font-bold cursor-pointer disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

export default PostEditor;
