import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isRegisterEnabled } from "@/config/constants";
import LoginForm from "./login-form";

// Server Component：讀取 ENABLE_REGISTER 後傳給登入表單
export default async function LoginPage() {
  // 已登入就不需要再登入，直接導回首頁
  const session = await auth();
  if (session?.user) redirect("/");

  return <LoginForm isRegisterEnabled={isRegisterEnabled()} />;
}
