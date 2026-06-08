import Layout from "@/components/layout";
import Content from "@/modules/home/content";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Content page={currentPage} />
      </Suspense>
    </Layout>
  );
}
