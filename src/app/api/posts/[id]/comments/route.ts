import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
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
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
        status: 401,
      });
    }

    const { id: postId } = await params;
    const body = await request.json();

    try {
      const newComment = await createComment(
        { postId, content: body.content },
        {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        }
      );

      return Response.json(success(newComment), { status: 201 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "資料格式錯誤";
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status: 400,
      });
    }
  }
);

