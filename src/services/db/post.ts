import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { postSchema, PostInput } from "@/schemas/post";
import { v4 as uuidv4 } from "uuid";

export async function createPost(
  rawData: PostInput,
  author: { id?: string | null; name?: string | null; email?: string | null }
) {
  // 1. Zod schema validation
  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid post data: " + JSON.stringify(parsed.error.flatten().fieldErrors));
  }

  const { title, content } = parsed.data;
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newPost = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().getTime(),
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
  };

  await db.collection("posts").insertOne(newPost);
  return newPost;
}

export async function getPostList(page: number, limit: number) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  const total = await collection.countDocuments();
  const posts = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPostById(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  return await collection.findOne({ id });
}
