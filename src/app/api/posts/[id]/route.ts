import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
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
      return Response.json(error("Post not found"), { status: 404 });
    }

    return Response.json(success(post), { status: 200 });
  },
);

// PUT /api/posts/[id] — 更新文章（需登入且為作者）
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
    const body = await request.json();
    const { title, content } = body;

    try {
      const updated = await updatePost(
        id,
        { title, content },
        session.user.id as string,
      );
      return Response.json(success(updated), { status: 200 });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "更新文章失敗，請重試";
      const status = message.startsWith("Forbidden") ? 403 : 400;
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status,
      });
    }
  },
);

// DELETE /api/posts/[id] — 刪除文章（需登入且為作者）
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

    try {
      const result = await deletePost(id, session.user.id as string);
      return Response.json(success(result), { status: 200 });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "刪除文章失敗，請重試";
      const status = message.startsWith("Forbidden") ? 403 : 400;
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status,
      });
    }
  },
);
