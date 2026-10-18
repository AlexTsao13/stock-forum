import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// 各元素的樣式（沒有安裝 typography 外掛，直接對應 Tailwind class）
const components: Components = {
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-white mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-white mt-6 mb-2">{children}</h3>
  ),
  // 待辦清單（- [ ] / - [x]）已經有核取方塊，不再顯示項目符號
  ul: ({ className, children }) => (
    <ul
      className={`mb-4 space-y-1.5 ${
        className?.includes("contains-task-list")
          ? "list-none pl-1 [&_input]:mr-2 [&_input]:accent-blue-500"
          : "list-disc pl-6"
      }`}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/20 pl-4 my-4 text-white/60">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 mb-4 text-sm [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-white/10 px-3 py-2">{children}</td>
  ),
};

// 文章內文的 Markdown 渲染
// react-markdown 預設不渲染原始 HTML，使用者輸入的 <script> 等標籤只會被當成文字，避免 XSS
// remark-breaks：單一換行也保留成換行，符合一般人在輸入框打字的習慣
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
