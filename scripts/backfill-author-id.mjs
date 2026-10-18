// 修補舊資料：早期建立的文章／留言 author.id 為 null
// 依 author.email 對應 users 集合，補上正確的 author.id
// 用法：
//   node scripts/backfill-author-id.mjs          只列出會修改的資料，不寫入
//   node scripts/backfill-author-id.mjs --apply  實際寫入資料庫
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const DB_NAME = "post_db";
const COLLECTIONS = ["posts", "comments"];

// Node 18 不支援 --env-file，手動讀取 .env
function loadEnv() {
  try {
    const content = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // 沒有 .env 就使用系統環境變數
  }
}

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("找不到 MONGODB_URI，請確認 .env 設定");
  }

  const apply = process.argv.includes("--apply");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(DB_NAME);

  try {
    const users = await db
      .collection("users")
      .find({}, { projection: { id: 1, email: 1 } })
      .toArray();
    const userIdByEmail = new Map(users.map((user) => [user.email, user.id]));

    for (const name of COLLECTIONS) {
      const collection = db.collection(name);
      const docs = await collection
        .find(
          { "author.id": null, "author.email": { $exists: true } },
          { projection: { id: 1, "author.email": 1 } },
        )
        .toArray();

      // 依 email 分組，每個作者一次 updateMany
      const countByEmail = new Map();
      for (const doc of docs) {
        const email = doc.author.email;
        countByEmail.set(email, (countByEmail.get(email) ?? 0) + 1);
      }

      console.log(`\n[${name}] author.id 為 null：${docs.length} 筆`);
      for (const [email, count] of countByEmail) {
        const userId = userIdByEmail.get(email);
        if (!userId) {
          console.log(`  ✗ ${email}（${count} 筆）：users 中找不到此 email，略過`);
          continue;
        }
        if (apply) {
          const result = await collection.updateMany(
            { "author.id": null, "author.email": email },
            { $set: { "author.id": userId } },
          );
          console.log(`  ✓ ${email} → ${userId}：已更新 ${result.modifiedCount} 筆`);
        } else {
          console.log(`  • ${email} → ${userId}：將更新 ${count} 筆`);
        }
      }
    }

    if (!apply) {
      console.log("\n以上為預覽，加上 --apply 才會實際寫入。");
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
