[1mdiff --git a/.gitignore b/.gitignore[m
[1mindex 2f6a7d1..ae80c24 100644[m
[1m--- a/.gitignore[m
[1m+++ b/.gitignore[m
[36m@@ -32,6 +32,7 @@[m [myarn-error.log*[m
 [m
 # env files (can opt-in for committing if needed)[m
 .env*[m
[32m+[m[32m!.env.example[m
 [m
 # vercel[m
 .vercel[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 75c81f4..019a3bf 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -6,31 +6,42 @@[m
     "dev": "next dev --turbopack",[m
     "build": "next build",[m
     "start": "next start",[m
[31m-    "lint": "next lint",[m
[32m+[m[32m    "lint": "eslint .",[m
[32m+[m[32m    "typecheck": "tsc --noEmit",[m
[32m+[m[32m    "check": "npm run lint && npm run typecheck",[m
[32m+[m[32m    "setup:db": "node scripts/setup-db.mjs",[m
     "prettier": "prettier --write ./src"[m
   },[m
   "dependencies": {[m
[31m-    "@auth/mongodb-adapter": "^3.11.2",[m
[32m+[m[32m    "@auth/mongodb-adapter": "^3.11.3",[m
     "@headlessui/react": "^2.2.4",[m
     "@tanstack/react-query": "^5.95.2",[m
     "@types/bcryptjs": "^3.0.0",[m
     "bcryptjs": "^3.0.3",[m
     "mongodb": "^6.10.0",[m
[31m-    "next": "15.4.10",[m
[31m-    "next-auth": "^5.0.0-beta.31",[m
[32m+[m[32m    "next": "15.5.27",[m
[32m+[m[32m    "next-auth": "^5.0.0-beta.32",[m
     "prettier": "^3.6.2",[m
     "react": "19.1.0",[m
     "react-dom": "19.1.0",[m
     "server-only": "^0.0.1",[m
[31m-    "uuid": "^13.0.0",[m
[32m+[m[32m    "uuid": "^13.0.2",[m
     "zod": "^4.4.3"[m
   },[m
   "devDependencies": {[m
[32m+[m[32m    "@eslint/eslintrc": "^3.3.7",[m
     "@tailwindcss/postcss": "^4",[m
     "@types/node": "^20",[m
     "@types/react": "^19",[m
     "@types/react-dom": "^19",[m
[32m+[m[32m    "eslint": "^9.39.5",[m
[32m+[m[32m    "eslint-config-next": "15.5.27",[m
     "tailwindcss": "^4",[m
     "typescript": "^5"[m
[32m+[m[32m  },[m
[32m+[m[32m  "overrides": {[m
[32m+[m[32m    "next": {[m
[32m+[m[32m      "postcss": "^8.5.30"[m
[32m+[m[32m    }[m
   }[m
 }[m
