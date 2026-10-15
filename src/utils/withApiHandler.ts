import { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";
import { ApiError } from "@/utils/errors";
import { BUSINESS_STATUS_CODE } from "@/config/constants";

export type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
};

export type RouteHandler<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  context: RouteContext<T>
) => Promise<Response>;

export function withApiHandler<T extends Record<string, string> = Record<string, string>>(
  handler: RouteHandler<T>,
) {
  return async (req: NextRequest, context: RouteContext<T>) => {
    try {
      return await handler(req, context);
    } catch (err: unknown) {
      // 可預期的業務錯誤：依錯誤類別回傳 400／403／404
      if (err instanceof ApiError) {
        return Response.json(
          error(err.message, BUSINESS_STATUS_CODE.WARNING),
          { status: err.httpStatus },
        );
      }

      // 未預期的錯誤：記錄細節，對外只回傳通用訊息
      console.error("API Error:", err);
      return Response.json(
        error("伺服器發生錯誤，請稍後再試", BUSINESS_STATUS_CODE.ERROR),
        { status: 500 },
      );
    }
  };
}
