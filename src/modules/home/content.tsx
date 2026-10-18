import PostBtn from "@/modules/home/post-btn";
import Image from "next/image";
import LogoMark from "@/components/logo-mark";
import { auth } from "@/auth";
import PostList from "./post-list";
import MarketOverview from "@/components/market-overview";
import { getForumStats } from "@/services/db/post";

interface ContentProps {
  page?: number;
}

export default async function Content({ page = 1 }: ContentProps) {
  const [session, stats] = await Promise.all([auth(), getForumStats()]);
  const isLoggedIn = !!session?.user; // 判斷有沒有使用者資料
  return (
    // 桌面版：左側文章 + 右側市場概覽；手機版只顯示文章
    <div className="max-w-3xl mx-auto lg:max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:items-start">
      <div className="min-w-0">
        {/* 精簡 banner：圖片當背景、加暗色漸層，文字疊在圖上，讓文章能出現在第一個畫面 */}
        <section className="relative h-44 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/images/stock-banner.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 780px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />

          <div className="relative h-full flex flex-col justify-center px-6 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <LogoMark className="w-8 h-8" /> Stock Forum
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/70">
              分享市場觀點、交易策略與投資心得
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/50">
              <span>
                <span className="text-white font-semibold">
                  {stats.postCount}
                </span>{" "}
                篇文章
              </span>
              <span className="text-white/20">|</span>
              <span>
                <span className="text-white font-semibold">
                  {stats.userCount}
                </span>{" "}
                位會員
              </span>
            </div>
          </div>
        </section>

        {/* 文章列表標題列：左邊標題、右邊發文按鈕 */}
        <div className="flex items-center justify-between mt-8 pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">最新文章</h2>
          <PostBtn isLoggedIn={isLoggedIn} />
        </div>

        <PostList page={page} />
      </div>

      {/* top-24：避開 fixed 的 Navbar（h-16）再留一點間距 */}
      <aside className="hidden lg:block sticky top-24">
        <MarketOverview />
      </aside>
    </div>
  );
}
