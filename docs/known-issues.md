# 已知問題與待辦

修好就從清單移除（在 PR 說明提到即可）；發現新問題但不在當前任務範圍內，就加進來。
開始處理某一項時，在該項後面標註分支名稱，例如「（處理中：`claude/fix-comment-postid`）」，避免多個 AI 同時做同一件事。

## 安全性

- `npm audit --omit=dev`（正式環境依賴）為 0 個漏洞。完整的 `npm audit` 仍有 5 個 high，全部在 ESLint 規則套件的間接依賴（`braces`、`micromatch`、`fast-glob` 等），只在開發時使用，不會進到正式網站；`braces` 目前沒有修補版，npm 建議的「降級到 eslint-config-next 14」不可行，等上游更新。
- 訪客帳密在 `src/app/(auth)/login/action.ts` 有寫死的預設值（環境變數缺少時使用），正式環境應改為缺少時直接報錯。

## 正確性

- 留言的 PATCH／DELETE 沒有比對網址中的文章 id：用其他文章的網址也能修改該留言，回應裡的 `postId` 也會錯，前端因此更新錯誤的留言列表快取。
- `GET /api/posts` 的 `page`、`limit` 沒有驗證：`?page=abc`、`?page=0`、`?limit=0` 會造成 500 或 `totalPages` 為 Infinity。
- 文章 `content` 沒有長度上限。
- `src/type/type.d.ts` 的 `createdAt` 宣告為 `number`，實際上是 `Date`，序列化後是 ISO 字串。

## 資料

- 舊資料的 `author.email` 尚未清除，目前靠讀取時排除。確認後可執行一次：
  `db.posts.updateMany({}, { $unset: { "author.email": "" } })`，`comments` 集合也一樣。
- 索引只在第一次查詢文章列表或使用者時建立（`setupIndexes()`），沒有獨立的初始化或 migration 步驟。

## 工程

- 沒有自動化測試，也沒有 CI。建議：Vitest 單元測試、mongodb-memory-server 測 service、Playwright E2E、GitHub Actions 跑 `npm run check`。
- `Dockerfile` 使用 `node:18` 並執行 `npm run dev`，不是正式版映像；應改為多階段建置（`next build` + `next start`）。
- `src/middleware.ts` 內容整段被註解，等同無作用，且有未使用的 import（lint 警告）。
- `src/modules/home/post-list.tsx` 有未使用的 `page` 參數（lint 警告）。
- `withApiHandler` 之外，401 與 GET 的 404 仍在各路由手寫，可改為丟出 `UnauthorizedError`／`NotFoundError`。
- `throwPostNotFoundOrForbidden` 與 `throwCommentNotFoundOrForbidden` 邏輯幾乎相同，可合併。
- 更新時使用 `findOneAndUpdate` 取回整份文件但沒有用到，可改 `updateOne`。
- `package.json` 的 `name` 仍是 `nextjs-example`；`prettier` 應移到 devDependencies。

## 使用者體驗

- 文章編輯視窗按 Esc 或點背景無法關閉（`Dialog` 的 `onClose` 是空函式）。
- 錯誤提示使用 `alert`／`confirm`。
- 文章列表沒有伺服器端預取，頁面載入後才在瀏覽器端抓資料。
- 首頁橫幅宣告尺寸為 1584×396，實際圖片是 1024×493 的 JPEG（副檔名卻是 .png）。

## 文件

- `setup.bat` 只支援 Windows；macOS／Linux 需手動執行 `npm ci`、複製 `.env.example`、`npm run setup:db`、`npm run check`。
- `README.md` 與實際不符：寫 `src/service/`，實際是 `src/services/`；寫 `app/hooks/`，實際是 `src/hooks/`；功能清單缺少編輯、刪除與留言；沒列出 `DEMO_EMAIL`、`DEMO_PASSWORD`、`ENABLE_REGISTER`。
