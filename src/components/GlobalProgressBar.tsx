"use client";

import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function GlobalProgressBar() {
  const isFetching = useIsFetching();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isFetching > 0) {
      setVisible(true);
      setWidth(15);
      // Slowly creep toward 85% while fetching
      intervalRef.current = setInterval(() => {
        setWidth((w) => {
          if (w >= 85) return w;
          return w + (85 - w) * 0.08;
        });
      }, 200);
    } else {
      // Complete the bar
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isFetching]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "var(--brand-coral)",
          transition: width === 100 ? "width 0.2s ease-out" : "width 0.2s linear",
          boxShadow: "0 0 6px var(--brand-coral)",
        }}
      />
    </div>
  );
}
