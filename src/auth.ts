import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb"; // 注意這裡的路徑
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./service/user";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 連結你的 MongoDB
  adapter: MongoDBAdapter(clientPromise),
  // 使用 JWT 策略來管理 Session，這對效能跟安全都很平衡
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // 1. 去資料庫找看看有沒有這個 Email
        const user = await getUserByEmail(credentials.email as string);

        // 2. 如果有這個人，且他有密碼（第三方登入的人可能沒密碼）
        if (user && user.password) {
          // 3. 驗證密碼
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );
          if (isPasswordCorrect) {
            // 驗證成功！回傳資料給 Auth.js 存入 Session
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        }
        // 驗證失敗
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // 自定義登入頁面路徑
  },
});
