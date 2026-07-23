import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE } from "@/config/constants";
import { auth } from "@/auth";
import { createPost } from "@/services/db/post";

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    // 若未登入，回傳 401 Unauthorized
    return Response.json(error("Unauthorized", BUSINESS_STATUS_CODE.ERROR), {
      status: 401,
    });
  }

  const body = await request.json();

  try {
    // 呼叫伺服器端資料庫服務（內部已含 Zod 驗證）
    const newPost = await createPost(body, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });

    return Response.json(
      success({
        id: newPost.id,
      }),
      {
        status: 200,
      },
    );
  } catch (err: any) {
    return Response.json(
      error(err.message || "Invalid post data", BUSINESS_STATUS_CODE.WARNING),
      {
        status: 400,
      },
    );
  }
});
