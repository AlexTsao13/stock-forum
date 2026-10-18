import PostBtn from "@/modules/home/post-btn";
import Image from "next/image";
import { auth } from "@/auth";
import PostList from "./post-list";
import MarketOverview from "@/components/market-overview";

interface ContentProps {
  page?: number;
}

export default async function Content({ page = 1 }: ContentProps) {
  const session = await auth(); // 在後端取得目前的 Session
  const isLoggedIn = !!session?.user; // 判斷有沒有使用者資料
  return (
    // 桌面版：左側文章 + 右側市場概覽；手機版只顯示文章
    <div className="max-w-3xl mx-auto lg:max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:items-start">
      <div className="min-w-0">
        <Image
          src="/images/stock-banner.png"
          className="w-full rounded-lg border border-white/10"
          width={1584}
          height={396}
          alt="stock-market-banner"
        />
        <h1 className="text-2xl font-bold mt-2">@stockmarket</h1>
        <p className="text-sm text-white/50 mt-2">
          Join the conversation on global markets, trading strategies, and
          investment insights. From blue-chip stocks to emerging sectors,
          discuss trends with professional traders and retail investors.
        </p>
        {/* 文章列表標題列：左邊標題、右邊發文按鈕 */}
        <div className="flex items-center justify-between mt-10 pb-3 border-b border-white/10">
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
