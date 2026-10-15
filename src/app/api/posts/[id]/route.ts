import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { readJsonBody } from "@/utils/request";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { getPostById, updatePost, deletePost } from "@/services/db/post";

// GET /api/posts/[id] — 取得文章詳情
export const GET = withApiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    const post = await getPostById(id);
    if (!post) {
      return Response.json(error("Post not found", BUSINESS_STATUS_CODE.WARNING), {
        status: 404,
      });
    }

    return Response.json(success(post), { status: 200 });
  },
);

// PUT /api/posts/[id] — 更新文章（需登入且為作者）
// 驗證失敗、找不到、非作者等錯誤由 service 丟出型別化錯誤，交給 withApiHandler 轉成 400／404／403
export const PUT = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id } = await params;
    const body = await readJsonBody(request);
    const { title, content } = body;

    const updated = await updatePost(
      id,
      { title, content },
      session.user.id as string,
    );
    return Response.json(success(updated), { status: 200 });
  },
);

// DELETE /api/posts/[id] — 刪除文章與其留言（需登入且為作者）
export const DELETE = withApiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id } = await params;

    await deletePost(id, session.user.id as string);
    return new Response(null, { status: 204 });
  },
);
