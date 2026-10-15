import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { readJsonBody } from "@/utils/request";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { updateComment, deleteComment } from "@/services/db/comment";

// PATCH /api/posts/[id]/comments/[commentId] 更新單則留言
// 驗證失敗、找不到、非作者等錯誤由 service 丟出型別化錯誤，交給 withApiHandler 轉成 400／404／403
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
    const body = await readJsonBody(request);

    const updated = await updateComment(
      commentId,
      { content: body.content },
      session.user.id as string
    );

    return Response.json(success({ ...updated, postId }), { status: 200 });
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

    const { commentId } = await params;

    await deleteComment(commentId, session.user.id as string);
    return new Response(null, { status: 204 });
  }
);
