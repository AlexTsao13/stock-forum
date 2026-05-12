import { registerAction } from "./action";
export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          註冊帳號
        </h1>
        <form action={registerAction} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="顯示名稱"
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="密碼"
            required
            className="p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded font-bold hover:bg-blue-600 transition"
          >
            立即註冊
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          已有帳號？{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            至登入頁面
          </a>
        </p>
      </div>
    </div>
  );
}
