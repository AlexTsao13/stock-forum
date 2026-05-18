"use client";

import Link from "next/link";
import Pagination from "@/modules/home/pagination";
import useQueryPostList from "@/app/hooks/use-query-post-list";
import { PostCard } from "@/components/post-card";

const PostList = () => {
  const { data, isLoading, error } = useQueryPostList();
  const { posts = [], totalPages } = data || {};
  return (
    <div className="mt-8 ">
      {isLoading && <p>Loading...</p>}
      {error && <div>{error.message}</div>}
      {!isLoading && posts.length === 0 && !isLoading && <p>No posts found</p>}
      {!isLoading &&
        posts.map((post: Post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      <div className="mt-8">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default PostList;
