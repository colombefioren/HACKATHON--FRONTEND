import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, iconColor, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 rounded-lg bg-card text-center"
      style={{ border: "2.5px dashed var(--brand-ink)" }}
    >
      <div
        className="w-16 h-16 flex items-center justify-center mb-4 rounded-lg"
        style={{
          background: "#F4D738",
          border: "2.5px solid var(--brand-ink)",
          boxShadow: "4px 4px 0 var(--brand-ink)",
        }}
      >
        <Icon size={28} color={iconColor ?? "var(--brand-ink)"} strokeWidth={2} />
      </div>

      <p className="text-base font-medium mb-1">{title}</p>

      {description && (
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium px-5 py-2 rounded-md press-brutal"
          style={{
            background: "var(--brand-coral)",
            color: "var(--brand-ink)",
            border: "2.5px solid var(--brand-ink)",
            boxShadow: "4px 4px 0 var(--brand-ink)",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
