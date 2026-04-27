import { useState } from "react";
import type { QAItem } from "@/lib/api";

interface QAAccordionProps {
  items: QAItem[];
  accent?: string;
}

export function QAAccordion({ items, accent = "var(--brand-mint)" }: QAAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!items.length) {
    return (
      <p className="text-xs text-muted-foreground italic py-4">
        No analysis available yet.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className="bg-card rounded-[4px] overflow-hidden"
            style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "4px 4px 0 var(--brand-ink)" }}
          >
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium"
              style={{ background: open ? accent : "transparent" }}
            >
              <span className="flex-1">{item.question}</span>
              <span className="text-base">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div
                className="px-4 py-3 text-xs leading-relaxed text-foreground"
                style={{ borderTop: "2px solid var(--brand-ink)" }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
