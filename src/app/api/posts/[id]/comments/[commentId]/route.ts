import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { updateComment, deleteComment } from "@/services/db/comment";

// PATCH /api/posts/[id]/comments/[commentId] 更新單則留言
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; commentId: string }> }
  ) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id: postId, commentId } = await params;
    const body = await request.json();

    try {
      const updated = await updateComment(
        commentId,
        { content: body.content },
        session.user.id as string
      );

      return Response.json(success({ ...updated, postId }), { status: 200 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update comment";
      const status = message.startsWith("Forbidden")
        ? 403
        : message === "Comment not found"
          ? 404
          : 400;
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status,
      });
    }
  }
);

// DELETE /api/posts/[id]/comments/[commentId] 刪除單則留言
export const DELETE = withApiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; commentId: string }> }
  ) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id: postId, commentId } = await params;

    try {
      await deleteComment(commentId, session.user.id as string);
      return new Response(null, { status: 204 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete comment";
      const status = message.startsWith("Forbidden")
        ? 403
        : message === "Comment not found"
          ? 404
          : 400;
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status,
      });
    }
  }
);
