"use client";

import { addPostAction, AddPostState } from "@/app/actions/post";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PostEditorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const initialState: AddPostState = {};

const PostEditor = ({ isOpen, setIsOpen }: PostEditorProps) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    addPostAction,
    initialState,
  );

  // 成功後關閉 Modal 並重新整理首頁
  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      router.refresh();
    }
  }, [state.success, setIsOpen, router]);

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

        <form action={formAction} className="space-y-4">
          <div>
            <input
              name="title"
              placeholder="Title"
              type="text"
              className="w-full h-[40px] border text-sm border-white/10 rounded-md p-2 focus:outline-none"
            />
            {state.fieldErrors?.title && (
              <p className="text-red-400 text-xs mt-1">
                {state.fieldErrors.title[0]}
              </p>
            )}
          </div>

          <div>
            <textarea
              name="content"
              placeholder="Content"
              className="w-full h-[100px] border text-sm border-white/10 rounded-md p-2 focus:outline-none"
            />
            {state.fieldErrors?.content && (
              <p className="text-red-400 text-xs mt-1">
                {state.fieldErrors.content[0]}
              </p>
            )}
          </div>

          {state.error && (
            <p className="text-red-400 text-xs">{state.error}</p>
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
