import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Layout from "@/components/layout";
import Avatar from "@/components/avatar";
import PostList, { PostListSkeleton } from "@/modules/home/post-list";
import PostBtn from "@/modules/home/post-btn";
import { getAuthorProfile } from "@/services/db/post";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

// 作者頁：顯示作者資訊與他的所有文章；登入者看自己的頁面時即為「我的文章」
export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const [author, session] = await Promise.all([getAuthorProfile(id), auth()]);
  const isMe = session?.user?.id === id;

  // 還沒發過文的登入者，用 session 的名字顯示自己的頁面，而不是 404
  const profile =
    author ??
    (isMe ? { id, name: session?.user?.name ?? "", postCount: 0 } : null);
  if (!profile) notFound();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-white/50 hover:text-white transition inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> 返回首頁
        </Link>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Avatar name={profile.name} size="xl" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white truncate">
                {profile.name}
              </h1>
              {isMe && (
                <span className="shrink-0 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                  你
                </span>
              )}
            </div>
            <p className="text-sm text-white/40 mt-1">
              發表了 {profile.postCount} 篇文章
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {isMe ? "我的文章" : "所有文章"}
          </h2>
          {isMe && <PostBtn isLoggedIn />}
        </div>

        <Suspense fallback={<PostListSkeleton />}>
          <PostList authorId={id} />
        </Suspense>
      </div>
    </Layout>
  );
}
