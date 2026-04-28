"use client";

import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function StaleIndicator() {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isFetching > 0) {
      timeout = setTimeout(() => setShow(true), 600);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timeout);
  }, [isFetching]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 text-[11px] font-medium rounded-md"
      style={{
        background: "var(--brand-ink)",
        color: "var(--brand-yellow)",
        border: "2px solid var(--brand-yellow)",
        boxShadow: "3px 3px 0 var(--brand-yellow)",
        animation: "fadeInUp 0.2s ease",
      }}
    >
      <RefreshCw
        size={12}
        color="var(--brand-coral)"
        style={{ animation: "spin 1s linear infinite" }}
      />
      Mise à jour…
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
