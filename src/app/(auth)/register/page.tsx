"use client";

import { registerAction } from "./action";
import { useActionState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">註冊帳號</h1>

        {/* 成功訊息：包含跳轉按鈕 */}
        {state?.success && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded text-center w-full">
              註冊成功！
            </div>
            <Link
              href="/login"
              className="w-full bg-blue-600 text-white text-center py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              前往登入
            </Link>
          </div>
        )}
        {/* 錯誤訊息 */}
        {state?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {state.error}
          </div>
        )}
        {/* 成功後隱藏原本的註冊表單 */}
        {!state?.success && (
          <form action={formAction} className="flex flex-col gap-4">
            <input
              name="name"
              type="text"
              placeholder="您的名字"
              className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="password"
              type="password"
              placeholder="密碼"
              required
              className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isPending ? "註冊中..." : "註冊"}
            </button>
          </form>
        )}
        {!state?.success && (
          <p className="mt-4 text-center text-sm text-gray-600">
            已經有帳號？{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              立即登入
            </Link>
          </p>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //     <div className="p-8 bg-white shadow-md rounded-lg w-96">
  //       <h1 className="text-2xl font-bold mb-6 text-center text-black">
  //         註冊帳號
  //       </h1>

  //       <form action={registerAction} className="flex flex-col gap-4">
  //         <input
  //           name="name"
  //           type="text"
  //           placeholder="顯示名稱"
  //           className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
  //         />
  //         <input
  //           name="email"
  //           type="email"
  //           placeholder="Email"
  //           required
  //           className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
  //         />
  //         <input
  //           name="password"
  //           type="password"
  //           placeholder="密碼"
  //           required
  //           className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
  //         />
  //         <button
  //           type="submit"
  //           className="bg-blue-500 text-white p-2 rounded font-bold hover:bg-blue-600 transition"
  //         >
  //           立即註冊
  //         </button>
  //       </form>
  //       <p className="mt-4 text-center text-sm text-gray-600">
  //         已有帳號？{" "}
  //         <a href="/login" className="text-blue-500 hover:underline">
  //           至登入頁面
  //         </a>
  //       </p>
  //     </div>
  //   </div>
  // );
}
