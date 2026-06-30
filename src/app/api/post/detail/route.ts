import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { getPostById } from "@/services/db/post";

export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json(error("Id is required"), {
      status: 400,
    });
  }

  // Use DB Core Service
  const post = await getPostById(id);

  if (!post) {
    // Code Review #11: Return 404 when post is not found
    return Response.json(error("Post not found"), {
      status: 404,
    });
  }

  return Response.json(success(post), {
    status: 200,
  });
});
