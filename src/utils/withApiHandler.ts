import { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";
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
  defaultStatus = BUSINESS_STATUS_CODE.ERROR,
) {
  return async (req: NextRequest, context: RouteContext<T>) => {
    try {
      return await handler(req, context);
    } catch (err: any) {
      console.error("API Error:", err);
      return Response.json(
        error(err.message || "Internal Server Error", defaultStatus),
        { status: defaultStatus },
      );
    }
  };
}
