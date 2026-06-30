# Stock Forum 專案 Code Review

## 專案概覽
Next.js 15 + MongoDB + NextAuth + TailwindCSS 構成的股票論壇，具備帳號認證、發文、留言等功能。

---

## 🔴 嚴重問題 (Critical)

### 1. 登入頁面硬編碼了訪客帳號密碼

> [!CAUTION]
> [login/page.tsx](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/(auth)/login/page.tsx#L15-L16) 直接在前端原始碼裡寫死了 demo 帳號的 email 和密碼：
> ```ts
> const targetEmail = "visitor@stockmarket.com";
> const targetPassword = "123456";
> ```
> 這段程式碼會被 bundled 到瀏覽器端的 JavaScript 中，任何人在 DevTools 都能看到。  
> 而且密碼 `123456` 極弱，如果其他帳號也使用類似的弱密碼，等於敞開大門。

**建議**：
- 把 demo 帳號的登入做成專用 Server Action（例如 `demoLoginAction`），不要在前端暴露密碼
- 或改用一個特殊的 API endpoint 來處理訪客登入，伺服器端自動填入帳密

### 2. API Route 與 Server Action 重複寫入邏輯 — 發文有兩個入口

> [!WARNING]
> 發文功能同時存在：
> - **Server Action**: [actions/post.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/actions/post.ts) — 有 Zod 驗證
> - **API Route**: [api/post/add/route.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/api/post/add/route.ts) — 沒有 Zod 驗證
>
> 前端實際使用的是 Server Action（透過 `useActionState`），但 API Route 仍然存在並且可以被直接呼叫。攻擊者可以繞過前端，直接 POST 到 `/api/post/add`，跳過 Zod 驗證，只做了很基本的 `!title || !content` 檢查（不限長度、不限內容）。

**建議**：
- 統一只用一種方式（推薦 Server Action），刪除多餘的 API Route
- 若兩者都需保留，必須在 API Route 中也加入完整的 Zod 驗證

### 3. MongoDB 缺乏索引 — 潛在效能炸彈

> [!IMPORTANT]
> 目前所有查詢（`findOne({ id })`, `find({ postId })`, `findOne({ email })`）都沒有對應的 MongoDB 索引。  
> 當資料量增長後，每次查詢都是全表掃描（Collection Scan），效能會急劇下降。

**建議**：對以下欄位建立索引：
- `users` collection: `email`（unique index）
- `posts` collection: `id`（unique index）、`createdAt`（降序）
- `comments` collection: `postId` + `createdAt`（compound index）

---

## 🟠 重要問題 (High)

### 4. `PostList` 的 `page` prop 被忽略了

> [!WARNING]
> [content.tsx](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/home/content.tsx#L33) 把 `page` 傳給了 `PostList`：
> ```tsx
> <PostList page={page} />
> ```
> 但 [post-list.tsx](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/home/post-list.tsx#L8-L9) 的 `PostList` 完全忽略了這個 prop，自己從 `useSearchParams` 重新讀取 page：
> ```tsx
> const PostList = () => {
>   const { data, isLoading, error } = useQueryPostList();
> ```
> 這代表 Server Component 解析的 `page` 參數被浪費了，而且如果 URL params 和 props 不一致可能會造成混淆。

### 5. `QueryClient` 在模組作用域建立 — 多用戶共享快取風險

> [!WARNING]
> [my-query-client.tsx](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/providers/my-query-client.tsx#L5)：
> ```tsx
> const queryClient = new QueryClient();
> ```
> `QueryClient` 被建立在模組頂層，在 SSR 環境中所有請求會共用同一個快取實例，可能導致 **不同用戶看到彼此的快取資料**（隱私問題）。

**建議**：應改為在 component 內用 `useState` 或 `useRef` 建立：
```tsx
const MyQueryClientProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

### 6. XSS 風險 — 使用者內容未做任何清潔處理

> [!WARNING]
> 貼文和留言的 `content` 直接用 `whitespace-pre-wrap` 渲染。雖然 React 預設會 escape HTML，但 `title` 和 `content` 沒有任何輸入清潔（sanitization）。如果未來加入 Markdown 或富文本渲染，就會直接暴露 XSS 攻擊面。

**建議**：在儲存前對 `title` 和 `content` 做 `.trim()` 和基本的 sanitize 處理。

### 7. Dockerfile 品質不佳 — 不適合 Production

[Dockerfile](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/Dockerfile)：

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

問題：
- 使用 `node:18` 而非 `node:18-alpine`，映像檔過大
- **Production 不應該跑 `npm run dev`**，應該 `npm run build` + `npm start`
- 沒有用 multi-stage build
- 沒有設定 `.dockerignore`，會把 `node_modules`、`.next`、`.git` 全部複製進去
- Node 18 已經 EOL，應升級至 Node 20+

---

## 🟡 中等問題 (Medium)

### 8. `services/post.ts` 和 `services/comment.ts` 使用相對路徑的 `fetch`

[services/post.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/services/post.ts#L10):
```ts
const response = await fetch(`/api/post/list?page=${page}&limit=5`);
```

這些函式使用 `/api/...` 相對路徑，只能在瀏覽器端使用。如果將來想在 Server Component 或 Server Action 中重用這些函式，會直接報錯（缺少 origin）。

**建議**：這些 client-side service 的資料夾可以更明確命名（例如 `client-services`），或在 SSR 時使用完整 URL。

### 9. API Response 的 HTTP Status Code 與 Business Code 混淆

[withApiHandler.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/utils/withApiHandler.ts#L7-L8):
```ts
export function withApiHandler(
  handler: (req: NextRequest) => Promise<Response>,
  defaultStatus = BUSINESS_STATUS_CODE.ERROR, // 值為 0
)
```

`BUSINESS_STATUS_CODE.ERROR = 0`，但被當作 HTTP status code 傳入 `Response.json(..., { status: 0 })`。HTTP status code `0` 是無效的。雖然目前 catch block 裡用的是這個值，實際上 `Response.json` 可能會忽略或報錯。

### 10. 沒有對 `page` / `limit` 做邊界驗證

[api/post/list/route.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/api/post/list/route.ts#L9-L10):
```ts
const page = searchParams.get("page") || "1";
const limit = searchParams.get("limit") || "10";
```

攻擊者可以傳入 `?page=-1` 或 `?limit=999999` 來觸發異常行為或大量查詢。

**建議**：用 `Math.max(1, Number(page))` 和 `Math.min(100, Math.max(1, Number(limit)))` 做邊界保護。

### 11. 文章詳情 API 查不到文章時回傳 200 + null

[api/post/detail/route.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/api/post/detail/route.ts#L18-L22):
```ts
const post = await collection.findOne({ id });
return Response.json(success(post), { status: 200 });
```

如果 `id` 對應的文章不存在，`post` 會是 `null`，但 API 仍回傳 `200 OK`。正確做法應該回傳 `404`。

### 12. `Comment` 型別缺少定義

[type.d.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/type/type.d.ts) 只定義了 `Post` interface，但 `Comment` 型別在 [comments-section.tsx](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/post/comments-section.tsx#L74) 中被直接使用：
```tsx
comments.map((comment: Comment) => ...
```
目前 `Comment` 會命中到瀏覽器內建的 DOM `Comment` 型別，不是你期望的留言型別。這在 runtime 不會報錯，但型別安全被完全破壞了。

### 13. Middleware 完全是空操作

[middleware.ts](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/middleware.ts) 所有邏輯都被註解掉了，只剩 `return NextResponse.next()`。如果不需要 middleware，建議直接刪除這個檔案，避免困惑，也減少每次請求的額外開銷。

---

## 🟢 小問題 / 程式碼品質 (Low)

### 14. `post-list.tsx` 重複的 `!isLoading` 判斷

[post-list.tsx L15](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/home/post-list.tsx#L15):
```tsx
{!isLoading && posts.length === 0 && !isLoading && <p>No posts found</p>}
```
`!isLoading` 出現了兩次，應該是複製貼上的疏忽。

### 15. CSS class 寫了不存在的 `rounded-ld`

[post-btn.tsx L27](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/home/post-btn.tsx#L27):
```tsx
className="... rounded-lg bg-white rounded-ld ..."
```
`rounded-ld` 不是有效的 TailwindCSS class，同時 `rounded-lg` 也重複了。

### 16. `@types/bcryptjs` 放在 `dependencies` 而不是 `devDependencies`

[package.json L16](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/package.json#L16):
```json
"@types/bcryptjs": "^3.0.0",
```
型別定義應該放在 `devDependencies`。同樣地，`prettier` 也應該移到 `devDependencies`。

### 17. 留存的 `test` 路由和殘留的 API Route

- `src/app/test/page.tsx` 存在於專案中，可能是開發時的測試頁面
- [api/post/add](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/app/api/post/add/route.ts) 是殘留的 API Route（前端已改用 Server Action）

建議清理掉不再使用的檔案。

### 18. PostEditor Dialog 的 `onClose` 設為空函式

[post-editor.tsx L38](file:///c:/Users/User/Desktop/Code/projects/stock%20forum/src/modules/home/post-editor.tsx#L38):
```tsx
<Dialog open={isOpen} onClose={() => {}} ...>
```
使用者按 ESC 或點擊背景時無法關閉 Modal，這是故意的設計嗎？如果是，建議加上註解說明原因。

---

## 📋 改進建議總覽

| 優先級 | 項目 | 類型 |
|--------|------|------|
| 🔴 P0 | 前端硬編碼訪客帳密 | 安全 |
| 🔴 P0 | API Route 缺少 Zod 驗證（可繞過前端） | 安全 |
| 🔴 P0 | MongoDB 缺乏索引 | 效能 |
| 🟠 P1 | `page` prop 被忽略 | Bug |
| 🟠 P1 | `QueryClient` SSR 共享風險 | 安全/正確性 |
| 🟠 P1 | Dockerfile 不適合 Production | 部署 |
| 🟡 P2 | API status code 混淆 | 正確性 |
| 🟡 P2 | 缺少 `Comment` 型別定義 | 型別安全 |
| 🟡 P2 | page/limit 無邊界驗證 | 安全 |
| 🟡 P2 | 查不到文章卻回 200 | 正確性 |
| 🟢 P3 | 重複判斷、無效 CSS class、殘留檔案 | 品質 |

