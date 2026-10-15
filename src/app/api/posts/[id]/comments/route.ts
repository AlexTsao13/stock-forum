import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { readJsonBody } from "@/utils/request";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import {
  getCommentsByPostId,
  createComment,
} from "@/services/db/comment";

// GET /api/posts/[id]/comments — 取得該文章的留言列表
export const GET = withApiHandler(
  async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id: postId } = await params;

    const comments = await getCommentsByPostId(postId);

    return Response.json(success(comments), { status: 200 });
  }
);

// POST /api/posts/[id]/comments — 在指定文章下新增留言（需登入）
// 資料驗證失敗時 service 丟出 ValidationError，由 withApiHandler 轉成 400
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id: postId } = await params;
    const body = await readJsonBody(request);

    const newComment = await createComment(
      { postId, content: body.content },
      {
        id: session.user.id,
        name: session.user.name,
      }
    );

    return Response.json(success(newComment), { status: 201 });
  }
);
