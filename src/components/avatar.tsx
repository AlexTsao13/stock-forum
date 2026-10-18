// 共用頭像：依名字算出固定顏色，同一個人在任何地方都是同一個顏色
// 顏色必須寫成完整 class 字串，Tailwind 才掃描得到
const COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-fuchsia-600",
  "bg-indigo-600",
];

const SIZES = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
};

function getColor(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  // 沒有名字時（例如未登入）顯示灰色問號
  name?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function Avatar({
  name,
  size = "sm",
  className = "",
}: AvatarProps) {
  const color = name
    ? `${getColor(name)} text-white`
    : "bg-white/10 text-white/40";
  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size]} ${color} inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold ${className}`}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </span>
  );
}
