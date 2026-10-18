"use client";

import Link from "next/link";
import LogoMark from "@/components/logo-mark";
import { useActionState, useState } from "react";
import { registerAction, type RegisterState } from "./action";
import { registerSchema, type RegisterInput } from "@/schemas/auth";

type FieldName = keyof RegisterInput;

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    name: "name",
    label: "暱稱",
    type: "text",
    placeholder: "其他人會看到的名稱",
    autoComplete: "nickname",
  },
  {
    name: "email",
    label: "電子信箱",
    type: "email",
    placeholder: "Email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "密碼",
    type: "password",
    placeholder: "至少 6 個字元",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "確認密碼",
    type: "password",
    placeholder: "再輸入一次密碼",
    autoComplete: "new-password",
  },
];

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [values, setValues] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [clientFieldErrors, setClientFieldErrors] =
    useState<RegisterState["fieldErrors"]>(undefined);

  // 前端驗證失敗時直接顯示前端錯誤，不沿用上一次 Server Action 的結果
  const fieldErrors = clientFieldErrors ?? state?.fieldErrors;
  const formError = clientFieldErrors ? null : state?.error;

  // 有錯誤時改用紅框 + 紅色光暈標註（與登入頁一致）
  const getInputClassName = (hasError: boolean) =>
    `w-full p-3 bg-black/40 border rounded-xl text-white outline-none focus:ring-2 transition-all duration-200 text-sm ${
      hasError
        ? "border-red-500/70 ring-2 ring-red-500/20 focus:ring-red-500/30 focus:border-red-500"
        : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500"
    }`;

  // 送出前先在前端用 Zod 驗證，格式錯誤就不呼叫 Server Action，避免閃過 loading
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      e.preventDefault();
      setClientFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setClientFieldErrors(undefined);
  };

  return (
    <div className="flex flex-col items-center text-white px-4 py-10 sm:py-14">
      <div className="p-8 bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2 mb-2">
            <LogoMark className="w-9 h-9" /> Stock Forum
          </h1>
          <p className="text-sm text-white/50">建立帳號，加入投資討論</p>
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {formError}
          </div>
        )}

        {/* noValidate：關閉瀏覽器原生驗證泡泡，統一由 Zod (registerSchema) 顯示錯誤 */}
        <form
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {FIELDS.map((field) => {
            const error = fieldErrors?.[field.name];
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  required
                  aria-invalid={!!error}
                  className={getInputClassName(!!error)}
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1.5">{error[0]}</p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-white/60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition cursor-pointer text-sm"
          >
            {isPending ? "註冊中..." : "註冊"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          已經有帳號了？{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            前往登入
          </Link>
        </p>
      </div>
    </div>
  );
}
