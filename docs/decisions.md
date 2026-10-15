# 技術決定紀錄

記錄有取捨的技術決定，讓之後接手的人或 AI 知道「為什麼這樣做」，避免重複討論或不小心推翻。
新的決定加在最上面；推翻舊決定時不要刪除原紀錄，改在原紀錄標註「已被 Dxx 取代」。

格式：日期、決定、原因、影響或代價。

---

## D9 · 2026-10-14 · 升級 Next.js 15.5.27、next-auth beta.32，並覆寫 Next.js 的 PostCSS 版本

- **決定**：`next` 15.4.10 → 15.5.27（`eslint-config-next` 同步，兩者固定版本）、`next-auth` beta.31 → beta.32、`@auth/mongodb-adapter` 3.11.3、`uuid` 13.0.2，並執行 `npm audit fix`。另以 `overrides` 讓 `next` 使用 `postcss` ^8.5.30。
- **原因**：`npm audit` 回報正式環境依賴有 9 個漏洞（4 個 critical）。Next.js 15 鎖定 PostCSS 8.4.31，相關漏洞 npm 只建議升到 Next 16（大版本）；PostCSS 8.5 與 8.4 同一主版本、相容，Tailwind 本來就使用 8.5.30。
- **影響**：正式環境依賴降為 0 個漏洞。已用正式建置驗證：登入、權限、文章、留言、刪除連帶刪留言等端對端流程全部通過。升級到 Next 16 時應移除這個 override，改用 Next.js 自帶的版本。

## D8 · 2026-10-14 · 一鍵建置環境：setup.bat ＋ .env.example ＋ setup:db

- **決定**：提供 `setup.bat` 串起 Node.js 檢查、`npm ci`、建立 `.env`、`npm run setup:db`、`npm run check`；`.env.example` 提交到 repo（`.gitignore` 加上 `!.env.example` 例外）。
- **原因**：註冊功能關閉，全新資料庫沒有訪客帳號就無法體驗；刪除文章需要 replica set，單機 MongoDB 會失敗；原本也沒有環境變數範本。
- **影響**：`setup:db` 只在帳號不存在時建立，不覆寫既有帳號的密碼；密碼與 `.env` 不符時會中止並提示。`setup.bat` 只用純 ASCII（避免 Windows 字碼頁造成亂碼）。

## D7 · 2026-10-14 · AI 協作文件以 AGENTS.md 為唯一來源

- **決定**：共用規範只寫在 `AGENTS.md`；`CLAUDE.md`、`GEMINI.md` 以匯入語法載入它，只補充工具專屬事項。
- **原因**：原本 `AGENTS.md` 與 `GEMINI.md` 內容重複，且一起過時（例如寫了沒用到的 Zustand）。多數 AI 工具都能直接讀 `AGENTS.md`，Claude Code 與 Gemini CLI 也支援匯入。
- **影響**：改規範只改一個地方。不支援匯入的工具需要自行設定讀取 `AGENTS.md`。

## D6 · 2026-10-14 · ESLint 使用 9 版與 eslint-config-next 15.4.10

- **決定**：`npm run lint` 直接執行 `eslint .`（flat config：`eslint.config.mjs`），不用 `next lint`。
- **原因**：專案原本的 `lint` script 沒有安裝 ESLint，實際上無法執行。`eslint-config-next` 15 版只支援到 ESLint 9；`next lint` 在 Next.js 15.5 起被標為淘汰。
- **影響**：升級 Next.js 大版本時，要一起升級 `eslint-config-next`，並評估是否升到 ESLint 10。

## D5 · 2026-10-14 · 區分 403 與 404，接受透露 id 是否存在

- **決定**：帶作者條件的寫入沒有命中時，再查一次資料是否存在，存在回 403、不存在回 404。
- **原因**：使用者需要知道是「沒有權限」還是「已不存在」。
- **影響**：非作者可藉此得知某個 id 是否存在；id 是 UUID 無法猜測，風險可接受。「檢查」和「寫入」之間有極短的時間差，最壞情況只是回錯 403／404，不會寫錯資料。

## D4 · 2026-10-14 · 刪除文章與其留言使用 transaction

- **決定**：`deletePost` 在同一個 transaction 中刪除文章與該文章的所有留言；新增留言前先確認文章存在。
- **原因**：避免文章刪除後留下孤兒留言，或只刪一半。
- **影響**：MongoDB 必須是 replica set（Atlas 預設即是）。本機開發若使用單機 MongoDB，需要啟動成單節點 replica set。

## D3 · 2026-10-14 · 作者快照不存 email

- **決定**：文章與留言的 `author` 只存 `{ id, name }`；讀取時以 projection 排除 `author.email`。
- **原因**：公開的 GET API 原本會回傳作者 email，有個資外洩風險。
- **影響**：舊資料仍存有 email，目前靠讀取時排除。建議執行一次清理（見 `docs/known-issues.md`），之後新的讀取路徑才不必記得排除。

## D2 · 2026-10-14 · 型別化錯誤，由 withApiHandler 統一轉換

- **決定**：service 層丟出 `ValidationError`／`ForbiddenError`／`NotFoundError`，`withApiHandler` 依類別轉成 400／403／404；其他錯誤回 500 與通用訊息。
- **原因**：原本以錯誤訊息字串判斷狀態碼，字串對不上導致 403／404 都變成 400；未預期錯誤時還把業務代碼 0 當成 HTTP 狀態碼，回應本身失敗。
- **影響**：路由不需要自己 try/catch。新增錯誤種類時，在 `src/utils/errors.ts` 擴充即可。

## D1 · 2026 年 5–8 月 · 既有架構決定（追記）

- **MongoDB 原生 driver，不用 ORM**：自行掌握索引與 aggregation；資料以「文章 + 內嵌作者快照」的讀取型態為主。
- **API 採 RESTful**：2026-07-28 由 RPC 風格重構；留言為文章的子資源。
- **JWT session**：Credentials provider 搭配 JWT，無伺服器端 session 儲存；代價是無法即時撤銷登入。
- **分頁以 `$facet` 一次取得資料與總數**：減少一次資料庫往返。
