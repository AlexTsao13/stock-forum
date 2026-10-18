// 網站 Logo 圖示：與 src/app/icon.svg（瀏覽器分頁圖示）相同的圖形
// 用 SVG 而不是 📈 emoji：emoji 在各作業系統長得不一樣，也無法控制顏色
export default function LogoMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#2563eb" />
      <polyline
        points="6,22 12,15 17,19 26,9"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="20,9 26,9 26,15"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
