import Link from "next/link";
import LogoMark from "@/components/logo-mark";
import { auth } from "@/auth";
import { isRegisterEnabled } from "@/config/constants";

const TECH_STACK = ["Next.js", "React", "MongoDB", "TanStack Query", "Tailwind"];

const linkClassName = "text-white/50 hover:text-white transition";

// 全站頁尾：品牌介紹 + 連結欄 + 底部版權列
export default async function Footer() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        {/* 手機：品牌、資料來源各佔一整列，「網站」「專案」並排；桌面：四欄 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* 品牌 */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold text-white hover:opacity-80 transition"
            >
              <LogoMark className="w-6 h-6" /> Stock Forum
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              一個讓投資人交流市場觀點、交易策略與投資心得的討論社群。
            </p>
          </div>

          {/* 網站 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              網站
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className={linkClassName}>
                  最新文章
                </Link>
              </li>
              {/* 已登入顯示「我的文章」；未登入才顯示登入、註冊 */}
              {userId ? (
                <li>
                  <Link href={`/author/${userId}`} className={linkClassName}>
                    我的文章
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login" className={linkClassName}>
                      登入
                    </Link>
                  </li>
                  {isRegisterEnabled() && (
                    <li>
                      <Link href="/register" className={linkClassName}>
                        註冊帳號
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>

          {/* 專案 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              專案
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/AlexTsao13/stock-forum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-1.5`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  GitHub 原始碼
                </a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 資料來源 */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              資料來源
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              行情資料由{" "}
              <a
                href="https://www.tradingview.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white underline underline-offset-2 transition"
              >
                TradingView
              </a>{" "}
              提供，可能有延遲。
            </p>
          </div>
        </div>

        {/* 底部版權列 */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Stock Forum</p>
          <p>本站內容僅供交流討論，不構成任何投資建議</p>
        </div>
      </div>
    </footer>
  );
}
