import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { commentSchema } from "@/schemas/comment";

// GET /api/posts/[id]/comments — 取得該文章的留言列表
export const GET = withApiHandler(
  async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id: postId } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("comments");

    const comments = await collection
      .find({ postId })
      .sort({ createdAt: 1 })
      .toArray();

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

    // 將 postId 從 URL segment 注入，content 從 body 取得
    const parsed = commentSchema.safeParse({ postId, content: body.content });
    if (!parsed.success) {
      const firstError = parsed.error.flatten().fieldErrors;
      const message =
        firstError.content?.[0] || firstError.postId?.[0] || "資料格式錯誤";
      return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("comments");

    const newComment = {
      id: uuidv4(),
      postId: parsed.data.postId,
      content: parsed.data.content,
      createdAt: new Date().getTime(),
      author: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
      },
    };

    await collection.insertOne(newComment);

    return Response.json(success(newComment), { status: 201 });
  }
);
