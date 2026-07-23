import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { deletePost } from "@/services/db/post";

export const DELETE = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      error("Missing post id", BUSINESS_STATUS_CODE.WARNING),
      { status: 400 }
    );
  }

  try {
    const result = await deletePost(id, session.user.id as string);

    return Response.json(success(result), { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "刪除文章失敗，請重試";
    const status = message.startsWith("Forbidden") ? 403 : 400;
    return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
      status,
    });
  }
});
