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
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
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

