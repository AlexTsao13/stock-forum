import type { DetailedHTMLProps, HTMLAttributes } from "react";

// 讓 TypeScript 認得 TradingView 的自訂元素 <tv-ticker-tape>
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tv-ticker-tape": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        symbols?: string;
      };
    }
  }
}
