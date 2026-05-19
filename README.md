# 📈 Stock Forum | 股票討論社群平台

一個為全球市場、交易策略及投資觀點打造的股票貼文分享平台。本專案基於 **Next.js 15 (App Router)**、**MongoDB**、**Auth.js (NextAuth.js v5)** 與 **TanStack React Query v5** 構建。

---

## 📖 專案簡介 (Project Overview)

- **股市分析分享**：專門供使用者分享全球金融市場、個股交易策略及投資心得的貼文展示平台。
- **投資動態交流**：提供一個簡潔的空間，供使用者發表自己的股市分析看法，並瀏覽其他使用者所發表的投資分析。

---

## ⚙️ 核心功能 (Core Features)

- **會員登入機制**：
  - 支援密碼雜湊加密與安全登入，並提供訪客「一鍵登入」功能供快速體驗（線上展示版不開放註冊）。
- **貼文發表**：
  - 登入後可點擊按鈕開啟發布視窗，填寫標題與內容來發表新貼文。
- **貼文列表分頁**：
  - 首頁展示所有貼文，並支援分頁載入（以頁碼按鈕進行切換）。
- **貼文詳情閱讀**：
  - 支援點擊單一貼文卡片進入詳細頁面 (`/post/[id]`)，閱讀完整的作者資訊、時間與文章內容。

---

## 🛠️ 技術棧 (Tech Stack)

### 前端 / 框架 (Frontend & Framework)

- **Next.js 15 (App Router)** — 現代化 React 框架，運用 React Server Components (RSC)、Server Actions 及 Route Handlers。
- **React 19 & React DOM 19** — 最新 React 特性支援。
- **TanStack React Query v5** — 用於客戶端資料獲取、狀態管理與快取。
- **Tailwind CSS v4** — 實作高階與客製化樣式設計。
- **Headless UI** — 提供無樣式的可存取性 UI 元件。
- **TypeScript** — 確保型別安全與開發體驗。

### 後端 / 資料庫 / 安全 (Backend & Database & Security)

- **MongoDB** — NoSQL 資料庫，儲存使用者帳戶與貼文資訊。
- **@auth/mongodb-adapter** — 官方 MongoDB 連接適配器。
- **bcryptjs** — 密碼雜湊加密，保障帳戶密碼安全。
- **uuid** — 生成唯一的隨機識別碼。

---

## 📂 專案結構 (Directory Structure)

```text
stock-forum/
├── src/
│   ├── app/                      # Next.js App Router 頁面與 API 路由
│   │   ├── (auth)/               # 認證群組頁面 (login, register)
│   │   ├── api/                  # 後端 API 接口 (auth 處理器, 貼文 add/detail/list)
│   │   ├── hooks/                # 客戶端自訂 React Queries Hooks
│   │   ├── post/                 # 貼文詳細頁面路由 (`/post/[id]`)
│   │   ├── globals.css           # 全域 CSS 與 Tailwind 注入點
│   │   ├── layout.tsx            # 全域 Layout 元件
│   │   └── page.tsx              # 首頁 Entry Point
│   ├── components/               # 共享 UI 元件 (Navbar, Layout, PostCard, PostDetail)
│   ├── config/                   # 全域常數設定 (狀態碼、DB名稱等)
│   ├── lib/                      # 外部服務初始化 (MongoDB 連線實例)
│   ├── modules/                  # 模組化功能元件
│   │   ├── home/                 # 首頁專屬元件 (貼文列表、分頁、編輯按鈕)
│   │   └── post/                 # 貼文詳情專屬元件
│   ├── service/                  # 客戶端 fetch 封裝與服務層邏輯
│   ├── type/                     # TypeScript 型別宣告
│   ├── utils/                    # 工具函式 (API 統一格式處理與異常攔截)
│   ├── auth.ts                   # Auth.js 設定檔 (NextAuth)
│   └── middleware.ts             # 路由請求攔截中間件
├── public/                       # 靜態資源 (Images, Icons)
├── .env                          # 環境變數設定檔 (本地開發)
├── package.json                  # 專案套件配置
├── tsconfig.json                 # TypeScript 設定
└── next.config.ts                # Next.js 配置檔
```

---

## 🔑 環境變數設定 (Environment Variables)

請在專案根目錄下建立一個 `.env` 檔案，並填入以下必要設定：

```env
# MongoDB 連線字串 (包含使用者名稱、密碼與 Cluster 位址)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>

# Auth.js 安全金鑰 (可用於 JWT 加密，可透過 `npx auth secret` 产生)
AUTH_SECRET=your_auth_secret_here
```

---

## 🚀 快速開始 (Getting Started)

1. **安裝依賴項目**：

   ```bash
   npm install
   ```

2. **啟動開發伺服器**：

   ```bash
   npm run dev
   ```

   啟動後，請打開瀏覽器造訪 [http://localhost:3000](http://localhost:3000) 瀏覽平台。

3. **建置生產版本**：

   ```bash
   npm run build
   ```

4. **啟動生產伺服器**：

   ```bash
   npm run start
   ```

5. **程式碼格式化**：
   ```bash
   npm run prettier
   ```
