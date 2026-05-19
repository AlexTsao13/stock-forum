"use client";
import { registerAction } from "./action";
import { useActionState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl">
        {/* LOGO 與標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2 mb-2">
            <span>📈</span> Stock Forum
          </h1>
        </div>

        {/* 成功訊息：包含漂亮跳轉卡片 */}
        {state?.success && (
          <div className="flex flex-col items-center gap-6 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-2">
              🎉
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl text-center w-full text-sm">
              註冊成功！您的投資探索之旅即將開始。
            </div>
            <Link
              href="/login"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-center py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.25)] text-sm cursor-pointer"
            >
              前往登入
            </Link>
          </div>
        )}

        {/* 錯誤訊息 */}
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
            {state.error}
          </div>
        )}

        {/* 成功後隱藏原本的註冊表單 */}
        {!state?.success && (
          <form action={formAction} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                顯示名稱
              </label>
              <input
                name="name"
                type="text"
                placeholder="您的名字"
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                電子信箱
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-sm"
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
                required
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>

            {/* 註冊提交按鈕 */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-800 disabled:to-indigo-800 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-300 mt-2 cursor-pointer text-sm"
            >
              {isPending ? "註冊中..." : "註冊"}
            </button>
          </form>
        )}

        {/* 前往登入鏈接 */}
        {!state?.success && (
          <p className="mt-6 text-center text-xs text-white/40">
            已經有帳號？{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:underline font-semibold transition-all duration-200"
            >
              立即登入
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
