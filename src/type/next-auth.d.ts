import "next-auth";
import "next-auth/jwt";

// 擴充 Auth.js 型別：訪客帳號的到期時間（ISO 字串；一般使用者沒有這個欄位）
declare module "next-auth" {
  interface User {
    guestExpiresAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    guestExpiresAt?: string;
  }
}
