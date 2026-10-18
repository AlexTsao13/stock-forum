import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isRegisterEnabled } from "@/config/constants";
import RegisterForm from "./register-form";
import RegisterClosed from "./register-closed";

// 依 ENABLE_REGISTER 決定顯示註冊表單或「註冊已關閉」提示
export default async function RegisterPage() {
  // 已登入就不需要再註冊，直接導回首頁
  const session = await auth();
  if (session?.user) redirect("/");

  return isRegisterEnabled() ? <RegisterForm /> : <RegisterClosed />;
}
