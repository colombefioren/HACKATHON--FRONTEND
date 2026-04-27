interface StatusBadgeProps {
  label: string;
  status: "done" | "missing" | "pending";
}

const STYLES: Record<StatusBadgeProps["status"], React.CSSProperties> = {
  done: { background: "var(--brand-mint)", color: "var(--brand-ink)" },
  missing: { background: "#ddd", color: "#777" },
  pending: { background: "var(--brand-mustard)", color: "var(--brand-ink)" },
};

export function StatusBadge({ label, status }: StatusBadgeProps) {
  const symbol = status === "done" ? "✓" : status === "missing" ? "—" : "…";
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-[2px]"
      style={{ ...STYLES[status], border: "1.5px solid var(--brand-ink)" }}
    >
      {label} {symbol}
    </span>
  );
}
