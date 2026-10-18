import "server-only";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";

let indexesCreated = false;

export async function setupIndexes() {
  if (indexesCreated) return;

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 1. Users 集合索引
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ id: 1 }, { unique: true });

    // 2. Posts 集合索引
    await db.collection("posts").createIndex({ id: 1 }, { unique: true });
    await db.collection("posts").createIndex({ createdAt: -1 });
    // 相關文章：依作者查詢並按時間排序
    await db
      .collection("posts")
      .createIndex({ "author.id": 1, createdAt: -1 });

    // 3. Comments 集合索引
    await db.collection("comments").createIndex({ id: 1 }, { unique: true });
    await db.collection("comments").createIndex({ postId: 1, createdAt: 1 });

    indexesCreated = true;
  } catch (error) {
    console.error("Failed to create MongoDB indexes:", error);
  }
}
