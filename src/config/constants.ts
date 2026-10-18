export const BUSINESS_STATUS_CODE = {
  ERROR: 0,
  SUCCESS: 1,
  WARNING: 2,
};

export const DB_NAME = "post_db";

// 是否開放註冊（只在伺服器端呼叫；非 NEXT_PUBLIC 的環境變數在瀏覽器讀不到）
export const isRegisterEnabled = () => process.env.ENABLE_REGISTER === "true";
