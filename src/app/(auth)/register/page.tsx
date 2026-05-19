"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          🔒
        </div>
        <h1 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          註冊功能已暫時關閉
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          此為專案展示，目前會員註冊功能已關閉。 我們已為您準備了{" "}
          <span className="text-blue-400 font-semibold">體驗帳號</span>
          ，請返回登入頁面即可開始使用。
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all duration-300 text-sm cursor-pointer"
        >
          前往登入頁面
        </Link>
      </div>
    </div>
  );
}
