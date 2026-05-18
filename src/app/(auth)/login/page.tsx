"use client";
import { loginAction } from "./action";
import { useActionState } from "react";

export default function LoginPage() {
  // state 會接住 action 回傳的結果
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          歡迎回來
        </h1>

        {/* 顯示錯誤訊息 */}
        {state?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="密碼"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isPending ? "登入中..." : "登入"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          還沒有帳號？{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            立即註冊
          </a>
        </p>
      </div>
    </div>
  );
}
