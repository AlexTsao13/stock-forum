import Link from "next/link";
import LogoMark from "@/components/logo-mark";
import { auth, signOut } from "@/auth";
import UserMenu from "@/components/user-menu";
import { isRegisterEnabled } from "@/config/constants";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="fixed top-0 left-0 w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-50">
      {/* 左側：首頁按鈕 */}
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition"
      >
        <LogoMark className="w-7 h-7" />
        Stock Forum
      </Link>
      {/* 右側：登入狀態 */}
      <div className="flex items-center gap-4">
        {session ? (
          // 使用者選單：我的文章、登出
          <UserMenu
            userId={session.user?.id}
            name={session.user?.name}
            email={session.user?.email}
            guestExpiresAt={session.user?.guestExpiresAt}
            signOutAction={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          />
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm hover:text-blue-400 transition"
            >
              登入
            </Link>
            {isRegisterEnabled() && (
              <Link
                href="/register"
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
              >
                註冊
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
