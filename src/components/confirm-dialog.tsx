"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  pendingText?: string;
  isPending?: boolean;
  error?: string | null;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "刪除",
  pendingText = "刪除中...",
  isPending = false,
  error,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      // 刪除進行中不允許關閉，避免使用者以為已取消
      onClose={() => {
        if (!isPending) onClose();
      }}
      transition
      className="fixed inset-0 z-50 flex w-screen items-center justify-center p-4 transition duration-200 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70" />
      <DialogPanel className="relative w-full max-w-sm space-y-4 bg-[#131313] border border-white/10 p-5 rounded-2xl shadow-2xl shadow-black/80">
        <DialogTitle className="font-bold text-white text-lg">
          {title}
        </DialogTitle>

        {description && <p className="text-sm text-white/60">{description}</p>}

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-3 text-sm justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isPending ? pendingText : confirmText}
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default ConfirmDialog;
