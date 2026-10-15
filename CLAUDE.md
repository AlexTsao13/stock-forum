@AGENTS.md

# Claude Code 專屬補充

上方匯入的 `AGENTS.md` 是所有 AI 工具共用的規範，以它為準；本檔只放 Claude Code 專屬的事項。
共用規範有需要調整時，請改 `AGENTS.md`，不要寫在這裡。

- 開始任務前讀 `docs/decisions.md` 與 `docs/known-issues.md`。
- 回報完成之前執行 `npm run check`，並在回覆中附上結果。
- 需要平行處理多個任務時，每個任務使用獨立的 git worktree（subagent 也一樣），規則同 `AGENTS.md`「多 AI 協作規則」。
- `.agents/skills/` 裡的 Vercel skills 是給支援該目錄的工具用的，Claude Code 不會自動載入；需要時直接讀對應的 `SKILL.md`。
- 刪除檔案、改寫 git 歷史、推送到遠端之前，先取得人類同意。
