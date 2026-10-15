import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { readJsonBody } from "@/utils/request";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { getPostList, createPost } from "@/services/db/post";

// GET /api/posts?page=1&limit=5 — 取得分頁文章列表
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "5";

  const result = await getPostList(Number(page), Number(limit));

  return Response.json(success(result), { status: 200 });
});

// POST /api/posts — 建立新文章（需登入）
// 資料驗證失敗時 service 丟出 ValidationError，由 withApiHandler 轉成 400
export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const body = await readJsonBody(request);

  const newPost = await createPost(body, {
    id: session.user.id,
    name: session.user.name,
  });

  return Response.json(success({ id: newPost.id }), { status: 201 });
});
