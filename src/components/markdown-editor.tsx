"use client";

import dynamic from "next/dynamic";
import * as commands from "@uiw/react-md-editor/commands";
import type { ICommand } from "@uiw/react-md-editor/commands";
import MarkdownContent from "@/components/markdown-content";

// @uiw/react-md-editor：現成的 Markdown 編輯器（工具列、快捷鍵、編輯／預覽切換都內建）
// 只能在瀏覽器執行，所以用 dynamic + ssr: false 載入；
// nohighlight 版本不含程式碼高亮套件，bundle 比較小
const MDEditor = dynamic(() => import("@uiw/react-md-editor/nohighlight"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-lg border border-white/10 bg-white/5 animate-pulse" />
  ),
});

// 把按鈕提示改成繁體中文（套件內建的 commands-cn 是簡體）
const zh = (command: ICommand, title: string): ICommand => ({
  ...command,
  buttonProps: { ...command.buttonProps, title, "aria-label": title },
});

// 工具列：只留論壇發文常用的功能
const TOOLBAR: ICommand[] = [
  zh(commands.bold, "粗體 (Ctrl+B)"),
  zh(commands.italic, "斜體 (Ctrl+I)"),
  zh(commands.strikethrough, "刪除線 (Ctrl+Shift+X)"),
  commands.divider,
  // 套件預設的標題按鈕顯示英文「Heading 2」，換成 H 圖示
  {
    ...zh(commands.heading2, "標題 (Ctrl+2)"),
    icon: <span className="text-[13px] font-bold">H</span>,
  },
  zh(commands.quote, "引用 (Ctrl+Q)"),
  zh(commands.link, "連結 (Ctrl+L)"),
  zh(commands.code, "行內程式碼 (Ctrl+J)"),
  commands.divider,
  zh(commands.unorderedListCommand, "項目清單 (Ctrl+Shift+U)"),
  zh(commands.orderedListCommand, "編號清單 (Ctrl+Shift+O)"),
];

// 右側：編輯／左右分割／預覽 切換（不放全螢幕，在彈出視窗中會很怪）
const EXTRA_TOOLBAR: ICommand[] = [
  zh(commands.codeEdit, "編輯"),
  zh(commands.codeLive, "編輯＋預覽"),
  zh(commands.codePreview, "預覽"),
];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  hasError = false,
}: MarkdownEditorProps) {
  return (
    // data-color-mode="dark"：使用套件內建的深色主題；外觀微調寫在 globals.css 的 .forum-md-editor
    <div
      data-color-mode="dark"
      className={`forum-md-editor ${hasError ? "has-error" : ""}`}
    >
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? "")}
        preview="edit"
        height={300}
        minHeight={200}
        commands={TOOLBAR}
        extraCommands={EXTRA_TOOLBAR}
        textareaProps={{ placeholder, name: "content" }}
        // 預覽改用文章頁同一個元件，預覽看到的就是發布後的樣子
        components={{
          preview: (source) => (
            <div className="p-3 text-sm leading-relaxed text-white/80 break-words">
              {source.trim() ? (
                <MarkdownContent content={source} />
              ) : (
                <p className="text-white/30">沒有可預覽的內容</p>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
}
