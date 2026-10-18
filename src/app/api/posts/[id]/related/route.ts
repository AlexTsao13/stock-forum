import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { success } from "@/utils/apiResponse";
import { getRelatedPosts } from "@/services/db/post";

const RELATED_POSTS_LIMIT = 3;

// GET /api/posts/[id]/related — 取得相關文章
export const GET = withApiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    const posts = await getRelatedPosts(id, RELATED_POSTS_LIMIT);

    return Response.json(success(posts), { status: 200 });
  },
);
