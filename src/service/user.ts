import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { DB_NAME } from "@/config/constants";

// 註冊新使用者
export async function createUser(
  email: string,
  password: string,
  name?: string,
) {
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
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return await db.collection("users").findOne({ email });
}
