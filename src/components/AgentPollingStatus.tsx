"use client";

import { useEffect, useState } from "react";

interface AgentPollingStatusProps {
  startedAt?: number; // timestamp ms, defaults to mount time
}

const SLOW_THRESHOLD = 30_000; // 30s

export function AgentPollingStatus({ startedAt }: AgentPollingStatusProps) {
  const [elapsed, setElapsed] = useState(0);
  const [mountTime] = useState(() => startedAt ?? Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - mountTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [mountTime]);

  const isSlow = elapsed >= SLOW_THRESHOLD;
  const seconds = Math.floor(elapsed / 1000);
  const estimatedTotal = 60; // rough estimate in seconds
  const remaining = Math.max(0, estimatedTotal - seconds);

  return (
    <div
      className="rounded-lg p-4 mt-4"
      style={{
        border: `2.5px solid ${isSlow ? "var(--brand-coral)" : "var(--brand-ink)"}`,
        boxShadow: `4px 4px 0 ${isSlow ? "var(--brand-coral)" : "var(--brand-mustard)"}`,
        background: isSlow ? "#fff5f5" : "var(--card)",
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Dots slow={isSlow} />
        <span className="text-xs font-medium">
          {isSlow
            ? "Les agents prennent plus de temps que prévu…"
            : "Agents en cours d'analyse…"}
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">{seconds}s</span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "#eee", border: "1.5px solid var(--brand-ink)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min((seconds / estimatedTotal) * 100, 95)}%`,
            background: isSlow ? "var(--brand-coral)" : "var(--brand-mint)",
            transition: "width 1s linear",
          }}
        />
      </div>

      {isSlow && (
        <p className="text-[11px] text-muted-foreground mt-2">
          Estimation : encore ~{remaining > 0 ? `${remaining}s` : "quelques secondes"}.
          L&apos;analyse reprend automatiquement.
        </p>
      )}

      {!isSlow && (
        <p className="text-[11px] text-muted-foreground mt-2">
          Rafraîchissement automatique toutes les 5s — résultats dans ~{remaining}s
        </p>
      )}
    </div>
  );
}

function Dots({ slow }: { slow: boolean }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-2 h-2 rounded-full"
          style={{
            background: slow ? "var(--brand-coral)" : "var(--brand-ink)",
            animation: "agentBounce 1s infinite ease-in-out",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes agentBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
