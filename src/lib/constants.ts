// API base URL — points to the Judgy backend
export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_JUDGY_API_URL) ||
  "http://localhost:8000/api";

// Accent colors (CSS var names) cycled per project card
export const ACCENT_COLORS = [
  "var(--brand-mint)",
  "var(--brand-sky)",
  "var(--brand-mustard)",
  "var(--brand-coral)",
  "var(--brand-purple)",
  "var(--brand-pink)",
] as const;

export const TECH_TAG_COLORS: Record<string, string> = {
  react: "var(--brand-mint)",
  vue: "var(--brand-sky)",
  "vue.js": "var(--brand-sky)",
  next: "var(--brand-yellow)",
  "next.js": "var(--brand-yellow)",
  svelte: "var(--brand-coral)",
  angular: "var(--brand-purple)",
  python: "var(--brand-mustard)",
  fastapi: "var(--brand-sky)",
  flask: "var(--brand-mint)",
  openai: "var(--brand-pink)",
  langchain: "var(--brand-sky)",
  node: "var(--brand-mint)",
  "node.js": "var(--brand-mint)",
  typescript: "var(--brand-sky)",
  javascript: "var(--brand-mustard)",
};

export const POLLING_INTERVAL_MS = 5000;

export type ProjectStatus = "analyzed" | "pending" | "flagged" | "all";
