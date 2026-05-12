import Link from "next/link";
import { auth, signOut } from "@/auth";
export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black">
      {/* 左側：首頁按鈕 */}
      <Link href="/" className="text-xl font-bold hover:opacity-80 transition">
        📈 Stock Forum
      </Link>
      {/* 右側：登入狀態 */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-white/70">
              Hi, {session.user?.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition">
                登出
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm hover:text-blue-400 transition"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
            >
              註冊
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
