import { LEVEL_COLORS } from "@/lib/stories";

interface LevelBadgeProps {
  meta: string;
  level: string;
  className?: string;
}

export function LevelBadge({ meta, level, className = "" }: LevelBadgeProps) {
  const colorClass = LEVEL_COLORS[level] ?? "bg-slate-50 text-slate-700 border-slate-100";
  return (
    <span
      className={`text-xs font-semibold border px-2.5 py-1 rounded-full inline-block ${colorClass} ${className}`}
    >
      {meta}
    </span>
  );
}
