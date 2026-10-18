import Link from "next/link";

export default function RegisterClosed() {
  return (
    <div className="flex flex-col items-center text-white px-4 py-10 sm:py-14">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
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
          className="inline-block w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-white/60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition cursor-pointer text-sm"
        >
          前往登入頁面
        </Link>
      </div>
    </div>
  );
}
