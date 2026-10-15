import { readFileSync } from "node:fs";

// 讀取 .env（只支援 KEY=VALUE 與 # 註解，足夠本專案使用）
export function readEnvFile(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return env;
}

// 尚未填寫：空值，或仍是範本裡的 <...> 佔位文字
export function isUnset(value) {
  return !value || /<[^>]*>/.test(value);
}

export const REQUIRED_KEYS = ["MONGODB_URI", "AUTH_SECRET", "DEMO_EMAIL", "DEMO_PASSWORD"];
