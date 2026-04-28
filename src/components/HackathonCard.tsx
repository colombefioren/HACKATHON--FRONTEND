"use client";

import Link from "next/link";
import type { Hackathon } from "@/lib/api";
import { hackathonId } from "@/lib/api";
import { ACCENT_COLORS } from "@/lib/constants";

interface HackathonCardProps {
  hackathon: Hackathon;
  index: number;
}

export function HackathonCard({ hackathon, index }: HackathonCardProps) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const id = hackathonId(hackathon);
  const isOpen = hackathon.isAllowed ?? hackathon.is_allowed ?? false;

  // Dev warning — helps catch API shape mismatches
  if (process.env.NODE_ENV === "development" && id === undefined) {
    console.warn("[HackathonCard] Could not resolve ID from hackathon object:", hackathon);
  }

  const themes = hackathon.theme?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const criteria = hackathon.criteria?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  const deadline = hackathon.deadline ? new Date(hackathon.deadline) : null;
  const isExpired = deadline ? deadline < new Date() : false;

  if (id === undefined) {
    return (
      <div
        className="block bg-card rounded-lg overflow-hidden opacity-50 cursor-not-allowed"
        style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
        title="Hackathon ID missing — check API response"
      >
        <div className="h-1.5" style={{ background: accent }} />
        <div className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Hackathon (ID unavailable)</p>
          <p className="text-[11px] text-muted-foreground mt-1">Check browser console for details.</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/hackathon/${id}`}
      className="block bg-card rounded-lg overflow-hidden press-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div className="h-1.5" style={{ background: accent }} />
      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-medium leading-snug flex-1">
            {hackathon.name ?? `Hackathon #${id}`}
          </h3>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-sm shrink-0"
            style={{
              background: isOpen && !isExpired ? "var(--brand-mint)" : "var(--brand-coral)",
              border: "1.5px solid var(--brand-ink)",
              color: "var(--brand-ink)",
            }}
          >
            {isExpired ? "Expired" : isOpen ? "● Open" : "● Closed"}
          </span>
        </div>

        {hackathon.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {hackathon.description}
          </p>
        )}

        {/* Themes */}
        {themes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {themes.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm"
                style={{ background: "var(--brand-pink)", border: "1.5px solid var(--brand-ink)", color: "var(--brand-ink)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="pt-3 flex items-center justify-between"
          style={{ borderTop: "2px solid var(--brand-ink)" }}
        >
          <div className="text-[11px] text-muted-foreground">
            {criteria.length > 0 ? `${criteria.length} criteria` : "No criteria set"}
          </div>
          {deadline && (
            <div className="text-[11px] text-muted-foreground">
              {isExpired ? "Ended" : "Ends"} {deadline.toLocaleDateString()}
            </div>
          )}
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-sm"
            style={{ border: "1.5px solid var(--brand-ink)" }}
          >
            View ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
