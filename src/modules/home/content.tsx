import PostBtn from "@/modules/home/post-btn";
import Image from "next/image";
import { auth } from "@/auth";
import PostList from "./post-list";

interface ContentProps {
  page?: number;
}

export default async function Content({ page = 1 }: ContentProps) {
  const session = await auth(); // 在後端取得目前的 Session
  const isLoggedIn = !!session?.user; // 判斷有沒有使用者資料
  return (
    <div className="max-w-3xl mx-auto">
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
        investment insights. From blue-chip stocks to emerging sectors, discuss
        trends with professional traders and retail investors.
      </p>
      <div className="w-full mt-8">
        <PostBtn isLoggedIn={isLoggedIn} />
      </div>

      <PostList page={page} />
    </div>
  );
}
