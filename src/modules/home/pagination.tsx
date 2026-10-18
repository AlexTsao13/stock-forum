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

  // 手機顯示較少頁碼，避免分頁列超出螢幕。
  const getPageNumbers = (range: number): (number | string)[] => {
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);
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

  const renderPageItems = (pageItems: (number | string)[]) =>
    pageItems.map((item) => {
      if (typeof item === "string") {
        return (
          <span key={item} className="flex h-9 w-6 items-center justify-center text-xs text-white/40 sm:w-8">
            ...
          </span>
        );
      }

      const isActive = currentPage === item;
      return (
        <Link
          key={item}
          href={`?page=${item}`}
          aria-current={isActive ? "page" : undefined}
          className={`flex h-9 w-8 items-center justify-center rounded-lg sm:w-9 ${
            isActive
              ? "scale-105 border border-blue-500/50 bg-blue-600 font-bold text-white shadow-md shadow-blue-600/30"
              : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
          }`}
        >
          {item}
        </Link>
      );
    });

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium py-4">
      {/* 上一頁按鈕 */}
      {currentPage > 1 ? (
        <Link
          href={`?page=${prevPage}`}
          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-white/70 hover:bg-white/15 hover:text-white sm:px-3"
        >
          ‹ <span className="hidden sm:inline">上一頁</span>
        </Link>
      ) : (
        <span className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2 text-white/20 sm:px-3">
          ‹ <span className="hidden sm:inline">上一頁</span>
        </span>
      )}

      {/* 頁碼按鈕列表 */}
      <div className="flex items-center gap-1 sm:hidden">
        {renderPageItems(getPageNumbers(1))}
      </div>
      <div className="hidden items-center gap-1.5 sm:flex">
        {renderPageItems(getPageNumbers(2))}
      </div>

      {/* 下一頁按鈕 */}
      {currentPage < totalPages ? (
        <Link
          href={`?page=${nextPage}`}
          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-white/70 hover:bg-white/15 hover:text-white sm:px-3"
        >
          <span className="hidden sm:inline">下一頁</span> ›
        </Link>
      ) : (
        <span className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2 text-white/20 sm:px-3">
          <span className="hidden sm:inline">下一頁</span> ›
        </span>
      )}
    </div>
  );
};

export default Pagination;
