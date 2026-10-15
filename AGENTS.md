# Stock Forum — AI 協作規範

這份檔案是所有 AI 開發工具（Claude Code、Codex、Gemini CLI、Cursor、GitHub Copilot 等）**共用的唯一規範來源**。
`CLAUDE.md`、`GEMINI.md` 只匯入本檔並補充該工具專屬的設定，不重複這裡的內容。
要改規範就改這份；改了指令、技術棧或慣例，請在同一個 PR 裡更新本檔。

相關文件：

- `docs/decisions.md`：重要技術決定與取捨（開工前先讀）
- `docs/known-issues.md`：已知問題與待辦（修好就從清單移除）

## 專案概要

投資主題的社群論壇，使用者可以發文、留言討論市場觀點與交易策略。

- 文章：新增、編輯、刪除（限作者）；首頁分頁列表，每頁 5 篇
- 留言：新增、編輯、軟刪除（限作者，上限 500 字）
- 登入：Email／密碼（Server Action），以及「訪客一鍵體驗」（使用 `DEMO_EMAIL`／`DEMO_PASSWORD`）
- 註冊目前**關閉**：`/register` 只顯示說明頁，沒有註冊 API；`ENABLE_REGISTER` 只控制導覽列是否顯示註冊連結
- 尚未串接任何股票行情資料

## 技術棧

| 類別 | 使用 | 備註 |
|---|---|---|
| 框架 | Next.js 15.5（App Router）、React 19.1 | 開發模式使用 Turbopack；查文件請以 Next.js 15 為準 |
| 語言 | TypeScript（strict） | 路徑別名 `@/*` → `src/*` |
| 樣式 | Tailwind CSS 4、Headless UI | 目前只有深色主題 |
| 伺服器狀態 | TanStack React Query 5 | |
| 驗證 | Zod 4 | 前後端共用 `src/schemas/*` |
| 認證 | Auth.js v5（next-auth beta）、bcryptjs | Credentials provider + JWT session |
| 資料庫 | MongoDB 原生 driver 6.10 | **不使用** Mongoose 或其他 ORM |
| 品質 | ESLint 9（eslint-config-next 15.5.27）、Prettier | 尚無測試框架 |

`next` 與 `eslint-config-next` 固定在同一個版本，要一起升級。`package.json` 的 `overrides` 讓 Next.js 改用已修補的 PostCSS（見 `docs/decisions.md` D9），升級 Next.js 時要確認是否還需要。

沒有使用 Zustand、Redux 等用戶端狀態管理套件。要引入新的狀態管理、ORM、UI 套件之前，先在 `docs/decisions.md` 記錄理由。

## 常用指令

第一次建立環境（Windows）：雙擊 `setup.bat`，或在專案根目錄執行它。它會依序檢查 Node.js、執行 `npm ci`、
由 `.env.example` 建立 `.env`（自動產生 `AUTH_SECRET`）、檢查資料庫與訪客帳號、跑 `npm run check`。重複執行是安全的。

```bash
npm install         # 安裝依賴
npm run setup:db    # 檢查資料庫是否支援 transaction，缺少訪客帳號時自動建立
npm run dev         # 開發伺服器 http://localhost:3000
npm run check       # lint + 型別檢查，交付前必須通過
npm run lint        # 只跑 ESLint
npm run typecheck   # 只跑 tsc --noEmit
npm run prettier    # 格式化 src/
npm run build       # 正式建置
```

## 環境變數（`.env`，不可提交）

範本是 `.env.example`（有提交到 repo）。新增或修改環境變數時，要同步更新 `.env.example` 與下表。
Node.js 建議使用 22 LTS（最低 18.18；部分 lint 套件要求 20.19 以上）。

| 變數 | 用途 |
|---|---|
| `MONGODB_URI` | MongoDB 連線字串。刪除文章用到 transaction，資料庫必須是 replica set（Atlas 預設即是） |
| `AUTH_SECRET` | Auth.js 金鑰（`npx auth secret` 產生） |
| `DEMO_EMAIL`、`DEMO_PASSWORD` | 訪客一鍵登入使用的示範帳號 |
| `ENABLE_REGISTER` | 設為 `"true"` 時導覽列顯示註冊連結 |
| `AUTH_TRUST_HOST` | 自行架設正式環境（`next start`、Docker）時設為 `true`；Vercel 與本機開發不需要 |

## 目錄結構

```
src/
├── app/                 # 路由：頁面、API Route Handlers、(auth) 路由群組
│   └── api/posts/       # RESTful API（見下方 API 一節）
├── components/          # 跨頁共用元件（navbar、layout、post-card）
├── modules/             # 依功能分組的頁面 UI（home/、post/）
├── hooks/               # React Query hooks：use-query-*、use-mutation-*
├── services/
│   ├── client/          # 瀏覽器端 fetch 封裝
│   └── db/              # 伺服器端資料存取（server-only），含 initIndexes.ts
├── schemas/             # Zod schema（前後端共用）
├── utils/               # withApiHandler、apiResponse、errors、request
├── lib/mongodb.ts       # MongoClient 單例
├── providers/           # QueryClient Provider
├── type/type.d.ts       # 全域型別 Post、ForumComment
└── auth.ts              # Auth.js 設定
```

資料流：元件 → `hooks/` → `services/client/` → `app/api/` Route Handler（`withApiHandler` + `auth()`）→ `services/db/`（Zod 驗證 + MongoDB）。
登入／登出走 Server Action，不經過 REST API。

## API

| 方法 | 路徑 | 權限 |
|---|---|---|
| GET | `/api/posts?page=&limit=` | 公開 |
| POST | `/api/posts` | 需登入，回 201 |
| GET | `/api/posts/[id]` | 公開 |
| PUT | `/api/posts/[id]` | 限作者 |
| DELETE | `/api/posts/[id]` | 限作者，連同留言一起刪除，回 204 |
| GET | `/api/posts/[id]/comments` | 公開 |
| POST | `/api/posts/[id]/comments` | 需登入，回 201 |
| PATCH | `/api/posts/[id]/comments/[commentId]` | 限作者 |
| DELETE | `/api/posts/[id]/comments/[commentId]` | 限作者，軟刪除，回 204 |

回應一律是 `{ status, message, data }`（`src/utils/apiResponse.ts` 的 `success()`／`error()`）；
`status` 是業務代碼（`ERROR=0`、`SUCCESS=1`、`WARNING=2`），**不是** HTTP 狀態碼。

## 程式慣例

### API 與錯誤處理

- 每個 Route Handler 都用 `withApiHandler` 包起來。
- 可預期的錯誤在 service 層丟出 `src/utils/errors.ts` 的 `ValidationError`（400）、`ForbiddenError`（403）、`NotFoundError`（404），
  由 `withApiHandler` 統一轉成回應。**不要**在路由裡 try/catch 再比對錯誤訊息字串。
- 讀取請求內容用 `readJsonBody(request)`，不要直接呼叫 `request.json()`。
- 未預期的錯誤一律回 500 與通用訊息，細節只寫進 log，不回傳給使用者。
- 給使用者看的訊息用繁體中文。

### 資料庫

- `services/db/` 每個檔案開頭都要 `import "server-only"`。
- Zod 驗證放在 service 層，service 的輸入參數型別用 `unknown`，驗證後才使用。
- 對外識別用應用層產生的 UUID 欄位 `id`，不使用 `_id`。
- 作者權限寫在查詢條件裡，例如 `findOneAndUpdate({ id, "author.id": userId }, …)`，**不要**先讀出來比對再寫入。
- 作者快照 `author` 只存 `{ id, name }`，**不可存 email**；讀取文章、留言時要排除 `author.email`（舊資料可能還有）。
- 需要多個集合一起成功或一起失敗的寫入，使用 transaction。
- 新的查詢條件或排序要有對應索引，加在 `services/db/initIndexes.ts`。

### 前端

- 伺服器資料一律透過 `hooks/` 的 React Query hook 取得，不在元件裡直接 fetch。
- mutation 成功後只 invalidate 相關的 query key：`["posts"]`、`["post", id]`、`["comments", postId]`。
- `services/client/` 的 fetch 要檢查 `response.ok`，失敗時丟出帶 `message` 的錯誤。
- 表單驗證使用與後端相同的 Zod schema。

### TypeScript

- 不使用 `any`，改用 `unknown`、泛型或明確型別。
- 共用的資料型別放在 `src/type/type.d.ts`。

## 不要做的事

- 不要修改 `.agents/skills/`：這是第三方 Vercel agent skills，版本由 `skills-lock.json` 管理。
- 不要提交 `.env`、`node_modules/`、`.next/`。
- 不要順手大規模重構，或格式化與任務無關的檔案。
- 不要直接推到 `main`。

## 多 AI 協作規則

同一個專案可能同時有多個 AI（或 AI 和人）在開發，以下規則用來避免互相覆蓋、重工與規範分歧。

### 1. 開工前

- 先執行 `git status`。看到**不是自己造成的**未提交變更時，停下來告知人類，不要覆蓋、還原或一起提交。
- 讀 `docs/decisions.md` 與 `docs/known-issues.md`，確認任務沒有和既有決定衝突，也沒有人正在處理。

### 2. 一個任務一個分支

- 分支命名：`<工具>/<類型>-<主題>`，例如 `claude/fix-comment-postid`、`codex/feat-search`、`gemini/docs-readme`。
- 多個 AI 同時作業時，各自使用獨立的 git worktree，不要在同一個工作目錄裡同時改檔：
  ```bash
  git worktree add ../stock-forum-<主題> -b <分支名稱>
  ```
- 透過 PR 合併到 `main`，一個 PR 只做一件事。

### 3. 共用契約要特別小心

下列檔案是多個功能共同依賴的「契約」。修改時在 PR 說明中標出影響範圍，必要時同步更新本檔：

- `src/utils/errors.ts`、`src/utils/withApiHandler.ts`、`src/utils/apiResponse.ts`、`src/utils/request.ts`
- `src/schemas/*`、`src/type/type.d.ts`
- API 路徑、HTTP 方法與回應格式
- `src/services/db/initIndexes.ts`、資料欄位結構
- `package.json` 的依賴與 scripts

### 4. 完成的定義

- `npm run check` 通過，而且沒有新增 lint 警告。
- 改到 API 或資料行為時，寫出驗證方式（目前沒有自動化測試：附上驗證腳本或手動步驟）。
- 改了指令、技術棧或慣例 → 同一個 PR 更新本檔。
- 做了有取捨的技術決定 → 在 `docs/decisions.md` 新增一條。
- 修好 `docs/known-issues.md` 裡的問題 → 從清單移除；發現新問題但不在本次範圍 → 加進清單。

### 5. 交接

PR 描述（或最後一個 commit 的內文）要寫清楚，讓下一個接手的人或 AI 不必重新調查：

- 做了什麼、為什麼這樣做
- 怎麼驗證的
- 還沒做完的部分與已知限制

### 6. Commit 格式

沿用專案既有的 Conventional Commits，描述用繁體中文，內文條列細節：

```
fix(comment): 修正留言 API 未檢查文章 ID 的問題

- PATCH／DELETE 查詢條件加入 postId
- 文章與留言不相符時回傳 404
```

類型：`feat`、`fix`、`refactor`、`perf`、`docs`、`chore`。
由 AI 產生的 commit，在結尾加上該工具的 `Co-Authored-By` 標記，方便事後追溯是哪個工具改的。
