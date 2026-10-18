"use client";

import { useState } from "react";
import PostEditor from "./post-editor";
import { useRouter } from "next/navigation";

interface PostBtnProps {
  isLoggedIn: boolean;
}

const PostBtn = ({ isLoggedIn }: PostBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBtnClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleBtnClick}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 px-3.5 py-2 text-sm text-white font-semibold transition cursor-pointer shadow-md shadow-blue-600/20"
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
            strokeWidth={2.5}
            d="M12 5v14M5 12h14"
          />
        </svg>
        發表文章
      </button>
      <PostEditor isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default PostBtn;
