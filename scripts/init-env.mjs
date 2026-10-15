// 建立並檢查 .env
// 結束代碼：0 = 已可使用；2 = 還有欄位要填；1 = 其他錯誤
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { readEnvFile, isUnset, REQUIRED_KEYS } from "./env.mjs";

const ENV_PATH = ".env";
const EXAMPLE_PATH = ".env.example";

try {
  if (!existsSync(ENV_PATH)) {
    // 由範本建立 .env，並自動產生 AUTH_SECRET
    const secret = randomBytes(32).toString("base64");
    const content = readFileSync(EXAMPLE_PATH, "utf8").replace(
      /^AUTH_SECRET=.*$/m,
      `AUTH_SECRET=${secret}`,
    );
    writeFileSync(ENV_PATH, content);
    console.log("已由 .env.example 建立 .env，並自動產生 AUTH_SECRET。");
  }

  const env = readEnvFile(ENV_PATH);
  const missing = REQUIRED_KEYS.filter((key) => isUnset(env[key]));

  if (missing.length > 0) {
    console.log(`.env 還有欄位需要填寫：${missing.join("、")}`);
    process.exit(2);
  }

  console.log(".env 已設定完成。");
} catch (err) {
  console.error("處理 .env 時發生錯誤：", err);
  process.exit(1);
}
