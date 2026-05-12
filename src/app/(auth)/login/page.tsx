import { loginAction } from "./action";
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          歡迎回來
        </h1>
        <form action={loginAction} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="密碼"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition"
          >
            登入
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          還沒有帳號？{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            立即註冊
          </a>
        </p>
      </div>
    </div>
  );
}
