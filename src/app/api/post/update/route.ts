import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { updatePost } from "@/services/db/post";

export const PUT = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const body = await request.json();
  const { id, title, content } = body;

  if (!id) {
    return Response.json(
      error("Missing post id", BUSINESS_STATUS_CODE.WARNING),
      { status: 400 }
    );
  }

  try {
    const updated = await updatePost(
      id,
      { title, content },
      session.user.id as string
    );

    return Response.json(success(updated), { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "更新文章失敗，請重試";
    const status = message.startsWith("Forbidden") ? 403 : 400;
    return Response.json(error(message, BUSINESS_STATUS_CODE.WARNING), {
      status,
    });
  }
});
