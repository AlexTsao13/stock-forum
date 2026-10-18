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
      <tv-ticker-tape symbols={SYMBOLS}></tv-ticker-tape>
    </>
  );
}
