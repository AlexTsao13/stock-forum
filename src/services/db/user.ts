import "server-only";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { Collection } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { DB_NAME } from "@/config/constants";
import { setupIndexes } from "./initIndexes";

// 註冊新使用者
export async function createUser(
  email: string,
  password: string,
  name?: string,
) {
  await setupIndexes();
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // 1. 檢查使用者是否已存在
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error("此 Email 已被註冊");
  }

  // 2. 【資安重點】雜湊加密密碼
  // bcrypt 會產生一個帶有「鹽值」的雜湊，即便兩個人的密碼一樣，存進資料庫也會長得不一樣
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. 存入資料庫
  const result = await db.collection("users").insertOne({
    id: uuidv4(),
    email,
    password: hashedPassword,
    name: name || email.split("@")[0], // 如果沒給名字，就用 Email 前綴
    createdAt: new Date(),
  });

  return result;
}

// 根據 Email 找人（登入時使用）
export async function getUserByEmail(email: string) {
  await setupIndexes();
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return await db.collection("users").findOne({ email });
}

// 訪客帳號存活時間：到期後由 MongoDB TTL 索引自動刪除帳號與其文章、留言
export const GUEST_TTL_MS = 24 * 60 * 60 * 1000;

// 訪客名稱：參考 Google 文件的「匿名動物」，搭配股票主題的形容詞，例如「長線水獺」
const GUEST_ADJECTIVES = [
  "長線",
  "短線",
  "多頭",
  "空頭",
  "穩健",
  "存股",
  "價值",
  "波段",
  "樂觀",
  "冷靜",
  "佛系",
  "觀望",
];
const GUEST_ANIMALS = [
  "水獺",
  "企鵝",
  "狐狸",
  "貓頭鷹",
  "松鼠",
  "海豚",
  "刺蝟",
  "無尾熊",
  "柴犬",
  "海獺",
  "樹懶",
  "浣熊",
];

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

// 避開目前還在使用中的訪客名稱；試幾次都重複就在後面加數字
async function generateGuestName(users: Collection) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const name = pick(GUEST_ADJECTIVES) + pick(GUEST_ANIMALS);
    const taken = await users.findOne(
      { name, isGuest: true },
      { projection: { _id: 1 } },
    );
    if (!taken) return name;
  }
  return (
    pick(GUEST_ADJECTIVES) +
    pick(GUEST_ANIMALS) +
    Math.floor(10 + Math.random() * 90)
  );
}

// 建立暫時訪客帳號（匿名登入）：每位訪客各自獨立，不需要密碼
export async function createGuestUser() {
  await setupIndexes();
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const id = uuidv4();
  const guest = {
    id,
    // email 有唯一索引，訪客也要給一個不會重複的值
    email: `guest-${id}@guest.local`,
    name: await generateGuestName(db.collection("users")),
    isGuest: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + GUEST_TTL_MS),
  };

  await db.collection("users").insertOne(guest);
  return guest;
}
