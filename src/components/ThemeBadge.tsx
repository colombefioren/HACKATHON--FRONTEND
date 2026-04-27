import { TECH_TAG_COLORS } from "@/lib/constants";

interface ThemeBadgeProps {
  label: string;
  color?: string;
}

export function ThemeBadge({ label, color }: ThemeBadgeProps) {
  const bg = color ?? TECH_TAG_COLORS[label.toLowerCase()] ?? "transparent";
  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded-[2px]"
      style={{ background: bg, border: "1.5px solid var(--brand-ink)", color: "var(--brand-ink)" }}
    >
      {label}
    </span>
  );
}
