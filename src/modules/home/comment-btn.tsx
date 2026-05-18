"use client";

import { useState } from "react";
import CommentEditor from "./comment-editor";
import { useRouter } from "next/navigation";

interface CommentBtnProps {
  isLoggedIn: boolean; // 接收登入狀態
}

const CommentBtn = ({ isLoggedIn }: CommentBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBtnClick = () => {
    if (!isLoggedIn) {
      // 如果沒登入，就導向登入頁
      router.push("/login");
      return;
    }
    // 有登入才打開編輯器
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleBtnClick}
        className="w-full h-[32px] flex justify-center items-center rounded-lg bg-white rounded-ld p-4 text-sm text-black font-bold cursor-pointer"
      >
        發表文章
      </button>
      <CommentEditor isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CommentBtn;
