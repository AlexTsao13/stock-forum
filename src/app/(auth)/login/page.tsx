"use client";
import { loginAction } from "./action";
import { useActionState, useState, useRef } from "react";

export default function LoginPage() {
  // state 會接住 action 回傳的結果
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDemoLogin = () => {
    setIsDemoLoggingIn(true);
    const targetEmail = "visitor@stockmarket.com";
    const targetPassword = "123456";

    // 仿生自動輸入效果
    setEmail(targetEmail);
    setPassword(targetPassword);

    // 延遲 400ms 讓使用者目睹「帳密自動輸入」的精緻視覺效果後再提交
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold  flex items-center justify-center gap-2 mb-2">
            <span>📈</span> Stock Forum
          </h1>
        </div>

        {/* 顯示錯誤訊息 */}
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
            {state.error}
          </div>
        )}

        {/* 1. 傳統登入表單區塊 */}
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
              電子信箱
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={isDemoLoggingIn}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
              密碼
            </label>
            <input
              name="password"
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              readOnly={isDemoLoggingIn}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 text-sm"
            />
          </div>

          {/* 一般登入提交按鈕 */}
          <button
            type="submit"
            disabled={isPending || isDemoLoggingIn}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all duration-300 mt-2 cursor-pointer text-sm"
          >
            {isPending && !isDemoLoggingIn ? "登入中..." : "登入"}
          </button>
        </form>

        {/*  分隔線  */}
        <div className="my-6 border-t border-white/5" />

        {/*  訪客體驗專區 */}
        <div className="flex flex-col gap-4">
          {/* 訪客一鍵體驗按鈕 */}
          <button
            type="button"
            disabled={isPending || isDemoLoggingIn}
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-800 disabled:to-indigo-800 text-white font-extrabold rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            {isDemoLoggingIn ||
            (isPending && email === "visitor@stockmarket.com") ? (
              <span>🚀 訪客模式登入中...</span>
            ) : (
              <>
                <span>✨</span> 訪客一鍵體驗
              </>
            )}
          </button>

          {/* 說明文字 */}
          <div className="flex flex-col gap-1 text-center text-xs text-white/40 leading-relaxed">
            <span>💡 本專案目前為展示模式，已關閉新會員註冊。</span>
            <span>
              點擊上方{" "}
              <span className="text-blue-400 font-semibold">訪客一鍵體驗</span>
              ，系統將自動為您填入測試帳密並登入。
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
