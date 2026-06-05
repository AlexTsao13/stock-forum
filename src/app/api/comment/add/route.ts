import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }
  const body = await request.json();
  const { postId, content } = body;

  if (!postId || !content) {
    return Response.json(
      error("postId and content are required", BUSINESS_STATUS_CODE.WARNING),
      {
        status: 400,
      },
    );
  }

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
