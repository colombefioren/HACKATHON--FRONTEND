"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ── BlurFade ── */
export function BlurFade({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("transition-all", className)}
      style={{
        transitionDuration: "0.6s",
        transitionDelay: `${delay}s`,
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(8px)",
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {children}
    </div>
  );
}

/* ── AnimatedGradientText ── */
export function AnimatedGradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-sm font-bold px-4 py-1.5 rounded-full"
      style={{
        background: "linear-gradient(90deg,#FF7A5C,#FFDB58,#90EE90,#A388EE,#FF7A5C)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradientMove 3s linear infinite",
        border: "1.5px solid #111",
      }}
    >
      {children}
      <style>{`@keyframes gradientMove { to { background-position: 200% center; } }`}</style>
    </span>
  );
}

/* ── WordRotate ── */
export function WordRotate({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setI((x) => (x + 1) % words.length); setVisible(true); }, 300);
    }, 2500);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <span
      style={{
        display: "inline-block",
        transition: "opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      {words[i]}
    </span>
  );
}

/* ── NumberTicker ── */
export function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(value / 40);
      const t = setInterval(() => {
        start = Math.min(start + step, value);
        setCount(start);
        if (start >= value) clearInterval(t);
      }, 30);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Marquee ── */
export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-4 w-max"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        {children}{children}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ── ShimmerButton ── */
export function ShimmerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="relative overflow-hidden px-7 py-3 text-sm font-bold rounded-[4px] press-brutal"
      style={{
        background: "#FFDB58",
        border: "2.5px solid #111",
        boxShadow: "4px 4px 0 #111",
        color: "#111",
      }}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.6) 50%,transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite",
        }}
      />
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
      <span className="relative">{children}</span>
    </button>
  );
}

/* ── BorderBeam ── */
export function BorderBeam({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[4px] p-[3px]" style={{ background: "linear-gradient(90deg,#FF7A5C,#FFDB58,#90EE90,#A388EE,#FF7A5C)", backgroundSize: "300% 100%", animation: "borderBeam 3s linear infinite" }}>
      <style>{`@keyframes borderBeam { to { background-position: 300% 0; } }`}</style>
      <div className="rounded-[3px] overflow-hidden">{children}</div>
    </div>
  );
}
