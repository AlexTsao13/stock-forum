import Script from "next/script";

const SYMBOLS = [
  "FOREXCOM:SPXUSD",
  "FOREXCOM:NSXUSD",
  "FOREXCOM:DJI",
  "FX:EURUSD",
  "BITSTAMP:BTCUSD",
  "BITSTAMP:ETHUSD",
  "CMCMARKETS:GOLD",
].join(",");

// TradingView 即時行情跑馬燈
export default function TickerTape() {
  return (
    <>
      <Script
        type="module"
        src="https://widgets.tradingview-widget.com/w/zh_TW/tv-ticker-tape.js"
        strategy="afterInteractive"
      />
      {/* compact + 隱藏迷你走勢圖，讓跑馬燈不會比 Navbar 還搶眼 */}
      <tv-ticker-tape
        symbols={SYMBOLS}
        item-size="compact"
        hide-chart
      ></tv-ticker-tape>
    </>
  );
}
