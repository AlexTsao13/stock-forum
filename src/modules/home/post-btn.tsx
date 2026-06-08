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
        className="w-full h-[32px] flex justify-center items-center rounded-lg bg-white rounded-ld p-4 text-sm text-black font-bold cursor-pointer"
      >
        發表文章
      </button>
      <PostEditor isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default PostBtn;
