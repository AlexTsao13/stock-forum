"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  // 根據規則產生頁碼清單
  const getPageNumbers = (): (number | string)[] => {
    // 1. 取得當前頁以及前後各 2 頁（限制在 1 ~ totalPages 之間）
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const corePages: number[] = [];
    for (let i = start; i <= end; i++) {
      corePages.push(i);
    }

    const result: (number | string)[] = [];

    // 2. 檢查是否包含第一頁 (1)
    if (!corePages.includes(1)) {
      result.push(1);
      if (corePages[0] > 2) {
        result.push("ellipsis-start");
      }
    }

    // 3. 加入核心頁碼
    result.push(...corePages);

    // 4. 檢查是否包含最後一頁 (totalPages)
    if (!corePages.includes(totalPages)) {
      const lastCore = corePages[corePages.length - 1];
      if (lastCore < totalPages - 1) {
        result.push("ellipsis-end");
      }
      result.push(totalPages);
    }

    return result;
  };

  const pageItems = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium py-4">
      {/* 上一頁按鈕 */}
      {currentPage > 1 ? (
        <Link
          href={`?page=${prevPage}`}
          className="px-3 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95"
        >
          ‹ 上一頁
        </Link>
      ) : (
        <span className="px-3 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/20 border border-white/5 cursor-not-allowed">
          ‹ 上一頁
        </span>
      )}

      {/* 頁碼按鈕列表 */}
      <div className="flex items-center gap-1.5">
        {pageItems.map((item) => {
          if (typeof item === "string") {
            return (
              <span
                key={item}
                className="w-8 h-9 flex items-center justify-center text-white/40 select-none tracking-widest text-xs"
              >
                ...
              </span>
            );
          }

          const pageNum = item;
          const isActive = currentPage === pageNum;
          return (
            <Link
              key={pageNum}
              href={`?page=${pageNum}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 border border-blue-500/50 scale-105"
                  : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white hover:border-white/20 border border-white/10 hover:scale-105 active:scale-95"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* 下一頁按鈕 */}
      {currentPage < totalPages ? (
        <Link
          href={`?page=${nextPage}`}
          className="px-3 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95"
        >
          下一頁 ›
        </Link>
      ) : (
        <span className="px-3 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/20 border border-white/5 cursor-not-allowed">
          下一頁 ›
        </span>
      )}
    </div>
  );
};

export default Pagination;
