import Layout from "@/components/layout";
import Content from "@/modules/home/content";
import { Suspense } from "react";
import { PostListSkeleton } from "@/modules/home/post-list";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <Layout>
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto">
            <PostListSkeleton />
          </div>
        }
      >
        <Content page={currentPage} />
      </Suspense>
    </Layout>
  );
}
