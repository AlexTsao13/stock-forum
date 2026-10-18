"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Avatar from "@/components/avatar";

interface UserMenuProps {
  userId?: string;
  name?: string | null;
  email?: string | null;
  // 訪客帳號的到期時間（ISO 字串）；一般使用者為 undefined
  guestExpiresAt?: string;
  // 由 Navbar（Server Component）傳入的登出 Server Action
  signOutAction: () => Promise<void>;
}

const itemClassName =
  "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition cursor-pointer";

// 登入後 Navbar 右上角的使用者選單
export default function UserMenu({
  userId,
  name,
  email,
  guestExpiresAt,
  signOutAction,
}: UserMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 pl-1 pr-3 py-1 transition cursor-pointer focus:outline-none data-open:bg-white/10">
        <Avatar name={name} size="xs" />
        <span className="text-sm text-white font-medium max-w-[120px] truncate">
          {name}
        </span>
        <svg
          className="w-3.5 h-3.5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-56 mt-2 origin-top-right rounded-xl bg-[#1a1a1a] border border-white/10 p-1 shadow-xl shadow-black/50 focus:outline-none transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 z-50"
      >
        <div className="px-3 py-2.5 mb-1 border-b border-white/10">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          {guestExpiresAt ? (
            // 訪客的 email 是系統產生的，不顯示；改為提示到期時間
            <p className="mt-1 text-xs leading-relaxed text-amber-400/80">
              訪客帳號，將於{" "}
              {new Date(guestExpiresAt).toLocaleString([], {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              自動刪除
            </p>
          ) : (
            email && <p className="text-xs text-white/40 truncate">{email}</p>
          )}
        </div>

        {userId && (
          <MenuItem>
            <Link
              href={`/author/${userId}`}
              className={`${itemClassName} text-white/80 data-focus:bg-white/10 data-focus:text-white`}
            >
              <svg
                className="w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              我的文章
            </Link>
          </MenuItem>
        )}

        <div className="my-1 border-t border-white/10" />

        <form action={signOutAction}>
          <MenuItem>
            <button
              type="submit"
              className={`${itemClassName} text-red-400 data-focus:bg-red-500/10 data-focus:text-red-300`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              登出
            </button>
          </MenuItem>
        </form>
      </MenuItems>
    </Menu>
  );
}
