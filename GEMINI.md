# Stock Forum Project Overview & Instructions

This file provides guidance to Gemini when working with code in this repository.

## Project overview

This project is a forum application.

Users can:

- Register and log in
- Create posts
- Edit and delete their own posts
- Comment on posts

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Query
- Zustand

## Coding Style

- Prefer TypeScript strict typing.
- Avoid using `any`.
- Reuse existing components whenever possible.
- Keep code simple and readable.
- Follow the existing project structure.

## AI Collaboration

- Analyze the task before writing code.
- Explain the implementation approach first.
- Avoid large refactors unless requested.
- Modify as few files as possible.
- Keep the existing project architecture.
- Explain the reason for major changes.

## 資料夾結構參考

forum-app/
├── src/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx # 首頁(貼文列表 + 新增貼文入口)
│ │ ├── globals.css
│ │ ├── favicon.ico
│ │ │
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ └── register/
│ │ │ ├── action.ts # 註冊邏輯(不是登入,可保留 Server Action 或改 API Route,待確認)
│ │ │ └── page.tsx
│ │ │
│ │ ├── post/
│ │ │ └── [id]/
│ │ │ └── page.tsx # 貼文詳情頁(對應你的 modules/post/content)
│ │ │
│ │ └── api/
│ │ ├── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts # Auth.js,不能刪
│ │ │
│ │ ├── post/
│ │ │ ├── add/
│ │ │ │ └── route.ts # ✅ 保留,新增貼文
│ │ │ ├── list/
│ │ │ │ └── route.ts # ✅ 保留,貼文列表
│ │ │ └── detail/
│ │ │ └── route.ts # ✅ 保留,單篇貼文
│ │ │
│ │ └── comment/
│ │ ├── add/
│ │ │ └── route.ts # ✅ 保留,新增留言
│ │ └── list/
│ │ └── route.ts # ✅ 保留,留言列表
│ │
│ ├── modules/ # 你目前拆分業務邏輯用的資料夾
│ │ └── post/
│ │ └── content.tsx # 貼文詳情頁的 client component
│ │
│ ├── components/ # UI 元件
│ │ ├── layout.tsx
│ │ ├── post-detail.tsx
│ │ ├── comments-section.tsx
│ │ └── post-editor.tsx # 新增貼文的 Modal(已改用 useMutationAddPost)
│ │
│ ├── services/
│ │ ├── api/ # ✅ fetch 包裝,前端呼叫 API Route 用
│ │ │ ├── post.ts # getPostList, getPost, addPost
│ │ │ └── comment.ts # getCommentList, addComment
│ │ │
│ │ └── db/ # 真正碰資料庫(Mongoose/MongoDB)的邏輯
│ │ ├── post.ts # createPost
│ │ └── user.ts
│ │
│ ├── hooks/
│ │ ├── use-query-post-list.ts # useQuery,讀取貼文列表
│ │ ├── use-query-post.ts # useQuery,讀取單篇貼文
│ │ ├── use-query-comments.ts # useQuery,讀取留言列表
│ │ ├── use-mutation-add-post.ts # ✅ 新增,寫入貼文
│ │ └── use-mutation-add-comment.ts # ✅ 新增,寫入留言
│ │
│ ├── schemas/
│ │ ├── auth.ts
│ │ ├── post.ts # postSchema
│ │ └── comment.ts # ⏳ 待補:commentSchema(目前散落在已刪除的 action 裡)
│ │
│ ├── config/
│ │ └── constants.ts # BUSINESS_STATUS_CODE, DB_NAME
│ │
│ ├── lib/
│ │ └── mongodb.ts # MongoDB client
│ │
│ ├── utils/
│ │ ├── apiResponse.ts # success(), error()
│ │ └── withApiHandler.ts # API Route 共用包裝
│ │
│ ├── providers/
│ │ └── my-query-client.tsx # QueryClientProvider
│ │
│ ├── type/
│ │ └── index.ts # 共用型別(Post, Comment 等)
│ │
│ ├── auth.ts # Auth.js 設定
│ └── middleware.ts
│
├── public/
├── .env
├── next.config.js
└── package.json
