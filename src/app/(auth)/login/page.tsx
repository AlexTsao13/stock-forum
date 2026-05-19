"use client";
import { loginAction } from "./action";
import { useActionState } from "react";

export default function LoginPage() {
  // state 會接住 action 回傳的結果
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl">
        {/* LOGO 與標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2 mb-2">
            <span>📈</span> Stock Forum
          </h1>
        </div>

        {/* 顯示錯誤訊息 */}
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
              電子信箱
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
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
              required
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all duration-300 mt-2 cursor-pointer text-sm"
          >
            {isPending ? "登入中..." : "登入"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          還沒有帳號？{" "}
          <a
            href="/register"
            className="text-blue-400 hover:underline font-semibold transition-all duration-200"
          >
            立即註冊
          </a>
        </p>
      </div>
    </div>
  );
}
