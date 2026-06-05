import Layout from "@/components/layout";
import Content from "@/modules/post/content";
import { auth } from "@/auth";

const Post = async () => {
  const session = await auth();
  return (
    <Layout>
      <Content session={session} />
    </Layout>
  );
};

export default Post;
