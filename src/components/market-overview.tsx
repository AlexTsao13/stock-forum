import Script from "next/script";

const SYMBOL_SECTORS = JSON.stringify([
  {
    sectionName: "指數",
    symbols: [
      "FOREXCOM:SPXUSD",
      "FOREXCOM:NSXUSD",
      "FOREXCOM:DJI",
      "FOREXCOM:UKXGBP",
    ],
  },
  {
    sectionName: "個股",
    symbols: ["NASDAQ:AAPL", "NASDAQ:ADBE", "NASDAQ:NVDA", "NASDAQ:TSLA"],
  },
  {
    sectionName: "加密貨幣",
    symbols: ["BITSTAMP:BTCUSD", "BITSTAMP:ETHUSD", "CRYPTO:XRPUSD"],
  },
]);

// TradingView 市場概覽，用於首頁側邊欄
export default function MarketOverview() {
  return (
    // 不加外框，直接使用 widget 自帶的框，避免框中框
    <section>
      <Script
        type="module"
        src="https://widgets.tradingview-widget.com/w/zh_TW/tv-market-overview.js"
        strategy="afterInteractive"
      />

      <div className="flex items-center gap-2 px-1 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <h2 className="text-sm font-bold text-white">市場概覽</h2>
      </div>

      {/* 預留高度，避免 widget 載入前後版面跳動 */}
      <div className="min-h-[480px]">
        <tv-market-overview
          symbol-sectors={SYMBOL_SECTORS}
        ></tv-market-overview>
      </div>
    </section>
  );
}
