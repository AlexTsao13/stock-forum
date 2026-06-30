import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { success } from "@/utils/apiResponse";
import { getPostList } from "@/services/db/post";

export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  // Use DB Core Service
  const result = await getPostList(Number(page), Number(limit));

  return Response.json(
    success(result),
    { status: 200 }
  );
});
