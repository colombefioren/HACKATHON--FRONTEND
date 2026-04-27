interface PollingLoaderProps {
  label?: string;
}

export function PollingLoader({ label = "Agents are analyzing…" }: PollingLoaderProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-[4px] bg-card"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "4px 4px 0 var(--brand-mustard)" }}
    >
      <div className="flex gap-1">
        <Dot delay="0s" />
        <Dot delay="0.15s" />
        <Dot delay="0.3s" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        background: "var(--brand-ink)",
        animation: "judgyBounce 1s infinite ease-in-out",
        animationDelay: delay,
      }}
    />
  );
}

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("judgy-bounce-kf")) {
  const style = document.createElement("style");
  style.id = "judgy-bounce-kf";
  style.textContent = `@keyframes judgyBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40% { transform: translateY(-4px); opacity: 1; }
  }`;
  document.head.appendChild(style);
}
