import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";

export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return Response.json(error("postId is required"), {
      status: 400,
    });
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("comments");

  const comments = await collection
    .find({ postId })
    .sort({ createdAt: 1 }) // Older comments first
    .toArray();

  return Response.json(success(comments), {
    status: 200,
  });
});
