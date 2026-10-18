import { useEffect } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPostList } from "@/services/client/post";

// 預載資料在這段時間內視為新鮮，切換頁面時直接使用，不會重複請求
const POST_LIST_STALE_TIME = 30 * 1000;

const useQueryPostList = () => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => getPostList(currentPage),
    staleTime: POST_LIST_STALE_TIME,
    // 跳到還沒預載的頁面時，先保留上一頁的資料，避免閃出 Loading
    placeholderData: keepPreviousData,
  });

  const totalPages = query.data?.totalPages;

  // 預先載入上一頁與下一頁
  useEffect(() => {
    if (!totalPages) return;
    const page = Number(currentPage);

    [page - 1, page + 1]
      .filter((p) => p >= 1 && p <= totalPages)
      .forEach((p) => {
        queryClient.prefetchQuery({
          queryKey: ["posts", String(p)],
          queryFn: () => getPostList(String(p)),
          staleTime: POST_LIST_STALE_TIME,
        });
      });
  }, [currentPage, totalPages, queryClient]);

  return query;
};

export default useQueryPostList;
