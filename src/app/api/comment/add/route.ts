import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { commentSchema } from "@/schemas/comment";

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const body = await request.json();

  // 用 Zod 驗證資料格式
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const message =
      firstError.content?.[0] || firstError.postId?.[0] || "資料格式錯誤";
    return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
      status: 400,
    });
  }

  const { postId, content } = parsed.data;

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const newComment = {
    id: uuidv4(),
    postId,
    content,
    createdAt: new Date().getTime(),
    author: {
      id: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
    },
  };

  await collection.insertOne(newComment);

  return Response.json(success(newComment), {
    status: 200,
  });
});
