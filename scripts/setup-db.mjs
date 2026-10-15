// 檢查資料庫連線、是否支援 transaction，並在缺少時建立訪客示範帳號
// 用法：npm run setup:db（讀取專案根目錄的 .env）
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readEnvFile, isUnset, REQUIRED_KEYS } from "./env.mjs";

// 與 src/config/constants.ts 的 DB_NAME 相同
const DB_NAME = "post_db";

const env = readEnvFile(".env");
const missing = REQUIRED_KEYS.filter((key) => isUnset(env[key]));
if (missing.length > 0) {
  console.error(`.env 缺少設定：${missing.join("、")}`);
  process.exit(1);
}

const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  console.log("資料庫連線成功。");

  // 1. transaction 需要 replica set（或分片叢集）
  const hello = await client.db("admin").command({ hello: 1 });
  if (hello.setName || hello.msg === "isdbgrid") {
    console.log("資料庫支援 transaction。");
  } else {
    console.warn(
      "警告：資料庫是單機模式，不支援 transaction，刪除文章會失敗。" +
        "請改用 MongoDB Atlas，或把本機 MongoDB 啟動成單節點 replica set。",
    );
  }

  // 2. 訪客示範帳號
  const users = client.db(DB_NAME).collection("users");
  const demoUser = await users.findOne({ email: env.DEMO_EMAIL });

  if (!demoUser) {
    await users.insertOne({
      id: uuidv4(),
      email: env.DEMO_EMAIL,
      password: await bcrypt.hash(env.DEMO_PASSWORD, 10),
      name: "訪客",
      createdAt: new Date(),
    });
    console.log(`已建立訪客帳號 ${env.DEMO_EMAIL}。`);
  } else if (await bcrypt.compare(env.DEMO_PASSWORD, demoUser.password ?? "")) {
    console.log(`訪客帳號 ${env.DEMO_EMAIL} 已存在，密碼正確。`);
  } else {
    // 不覆寫既有帳號的密碼，避免影響正在使用的環境
    console.error(
      `錯誤：訪客帳號 ${env.DEMO_EMAIL} 已存在，但密碼與 .env 的 DEMO_PASSWORD 不同，` +
        "「訪客一鍵體驗」會登入失敗。請把 DEMO_PASSWORD 改成資料庫裡的密碼。",
    );
    process.exitCode = 1;
  }
} catch (err) {
  console.error("資料庫設定失敗：", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await client.close();
}
