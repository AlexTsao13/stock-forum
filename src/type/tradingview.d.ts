import type { DetailedHTMLProps, HTMLAttributes } from "react";

type CustomElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

// 讓 TypeScript 認得 TradingView 的自訂元素
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tv-ticker-tape": CustomElementProps & {
        symbols?: string;
        "item-size"?: "compact" | "normal";
        "hide-chart"?: boolean;
      };
      "tv-market-overview": CustomElementProps & {
        // JSON 字串：[{ sectionName, symbols: string[] }]
        "symbol-sectors"?: string;
        "chart-size"?: "compact" | "normal" | "large";
        "item-size"?: string;
        "time-frame"?: string;
      };
    }
  }
}
