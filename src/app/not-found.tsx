import Link from "next/link";

// 全站 404 頁面（找不到路由，或頁面呼叫 notFound() 時顯示）
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <p className="text-6xl font-extrabold text-white/10">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">找不到這個頁面</h1>
      <p className="mt-2 text-sm text-white/50">
        網址可能有誤，或這個頁面已經被刪除了。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition"
      >
        ← 回到首頁
      </Link>
    </div>
  );
}
