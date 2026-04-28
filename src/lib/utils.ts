import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Extract a numeric score from QA analysis if available */
export function extractScore(project: Project): number | null {
  const items = project.market_agent_analysis ?? [];
  for (const item of items) {
    const match = item.answer?.match(/\b([0-9](?:\.[0-9])?|10)\s*\/\s*10\b/);
    if (match) return parseFloat(match[1]);
  }
  return null;
}
