import { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";

type RouteContext = { params: Promise<Record<string, string>> };

type RouteHandler = (
  req: NextRequest,
  context: RouteContext
) => Promise<Response>;

export function withApiHandler(
  handler: RouteHandler,
  defaultStatus = BUSINESS_STATUS_CODE.ERROR,
) {
  return async (req: NextRequest, context: RouteContext) => {
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
