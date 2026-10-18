import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth, getGuestExpiresAt } from "@/auth";
import { getPostList, createPost } from "@/services/db/post";

// GET /api/posts?page=1&limit=5&author=xxx — 取得分頁文章列表（author 選填）
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "5";
  const author = searchParams.get("author") || undefined;

  const result = await getPostList(Number(page), Number(limit), author);

  return Response.json(success(result), { status: 200 });
});

// POST /api/posts — 建立新文章（需登入）
export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const body = await request.json();

  try {
    const newPost = await createPost(body, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      expiresAt: getGuestExpiresAt(session),
    });

    return Response.json(success({ id: newPost.id }), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid post data";
    return Response.json(
      error(message, BUSINESS_STATUS_CODE.WARNING),
      { status: 400 }
    );
  }
});
