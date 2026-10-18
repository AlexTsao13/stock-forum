"use client";
import { loginAction, loginAsGuestAction, type LoginState } from "./action";
import Link from "next/link";
import LogoMark from "@/components/logo-mark";
import { useActionState, useState, useTransition } from "react";
import { loginSchema } from "@/schemas/auth";

interface LoginFormProps {
  isRegisterEnabled: boolean;
}

export default function LoginForm({ isRegisterEnabled }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGuestPending, startGuestTransition] = useTransition();
  const [guestError, setGuestError] = useState<string | null>(null);
  const [clientFieldErrors, setClientFieldErrors] =
    useState<LoginState["fieldErrors"]>(undefined);

  // 前端驗證失敗時直接顯示前端錯誤，不沿用上一次 Server Action 的結果
  const fieldErrors = clientFieldErrors ?? state?.fieldErrors;
  const formError = guestError ?? (clientFieldErrors ? null : state?.error);
  const isBusy = isPending || isGuestPending;

  // 有錯誤時改用紅框 + 紅色光暈標註
  const getInputClassName = (hasError: boolean) =>
    `w-full p-3 bg-black/40 border rounded-xl text-white outline-none focus:ring-2 transition-all duration-200 text-sm ${
      hasError
        ? "border-red-500/70 ring-2 ring-red-500/20 focus:ring-red-500/30 focus:border-red-500"
        : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500"
    }`;

  // 送出前先在前端用 Zod 驗證，格式錯誤就不呼叫 Server Action，避免閃過 loading
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      e.preventDefault();
      setClientFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setClientFieldErrors(undefined);
    setGuestError(null);
  };

  // 訪客匿名登入：伺服器建立暫時帳號並登入，成功時直接導回首頁
  const handleGuestLogin = () => {
    setGuestError(null);
    startGuestTransition(async () => {
      const result = await loginAsGuestAction();
      if (result?.error) setGuestError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-center text-white px-4 py-10 sm:py-14">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold  flex items-center justify-center gap-2 mb-2">
            <LogoMark className="w-9 h-9" /> Stock Forum
          </h1>
        </div>

        {/* 顯示錯誤訊息 */}
        {formError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
            {formError}
          </div>
        )}

        {/* 1. 傳統登入表單區塊 */}
        {/* noValidate：關閉瀏覽器原生驗證泡泡，統一由 Zod (loginSchema) 顯示錯誤 */}
        <form
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
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
              aria-invalid={!!fieldErrors?.email}
              className={getInputClassName(!!fieldErrors?.email)}
            />
            {fieldErrors?.email && (
              <p className="text-red-400 text-xs mt-1.5">
                {fieldErrors.email[0]}
              </p>
            )}
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
              aria-invalid={!!fieldErrors?.password}
              className={getInputClassName(!!fieldErrors?.password)}
            />
            {fieldErrors?.password && (
              <p className="text-red-400 text-xs mt-1.5">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* 一般登入提交按鈕 */}
          <button
            type="submit"
            disabled={isBusy}
            className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-white/60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition cursor-pointer text-sm"
          >
            {isPending ? "登入中..." : "登入"}
          </button>
        </form>

        {/*  分隔線  */}
        <div className="my-6 border-t border-white/5" />

        {/*  訪客體驗專區 */}
        <div className="flex flex-col gap-4">
          {/* 訪客一鍵體驗按鈕 */}
          <button
            type="button"
            disabled={isBusy}
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 disabled:opacity-50 text-white font-bold rounded-xl active:scale-[0.98] transition cursor-pointer text-sm"
          >
            {isGuestPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                訪客登入中...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                訪客一鍵體驗
              </>
            )}
          </button>

          {/* 說明文字 */}
          <div className="flex flex-col gap-1 text-center text-xs text-white/40 leading-relaxed">
            {!isRegisterEnabled && (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                本專案目前為展示模式，已關閉新會員註冊。
              </span>
            )}
            <span>
              點擊上方{" "}
              <span className="text-blue-400 font-semibold">訪客一鍵體驗</span>
              ，免註冊即可發文、留言；訪客帳號與內容會在 24 小時後自動刪除。
            </span>
          </div>
        </div>

        {isRegisterEnabled && (
          <p className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-white/40">
            還沒有帳號？{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              立即註冊
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
