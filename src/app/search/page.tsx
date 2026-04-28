"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/Topbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useSearch } from "@/lib/hooks/useSearch";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SearchX } from "lucide-react";

const HISTORY_KEY = "evalio_search_history";
const MAX_HISTORY = 6;

const SUGGESTIONS = [
  "AI tools for educators",
  "blockchain fintech for SMEs",
  "React + Supabase apps",
  "healthcare computer vision",
  "climate change solutions",
  "developer productivity tools",
];

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(q: string) {
  const prev = loadHistory().filter((h) => h !== q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, MAX_HISTORY)));
}

export default function SearchPage() {
  const { results, query, loading, error, run } = useSearch();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const submit = (q: string) => {
    if (!q.trim()) return;
    saveHistory(q.trim());
    setHistory(loadHistory());
    run(q.trim());
    setInput(q.trim());
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-8 max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-medium mb-1">Semantic search</h1>
        <p className="text-sm text-foreground mb-6">
          Find projects by concept, tech stack or theme — powered by AI embeddings.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          className="flex flex-col sm:flex-row gap-2 mb-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. healthcare apps using computer vision"
            className="flex-1 text-sm px-4 py-3 rounded-[3px] bg-white outline-none"
            style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "4px 4px 0 var(--brand-ink)" }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="text-sm font-medium px-5 py-3 rounded-[3px] press-brutal disabled:opacity-50"
            style={{
              background: "var(--brand-coral)",
              color: "var(--brand-ink)",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* History */}
        {history.length > 0 && !query && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Recent searches
              </span>
              <button onClick={clearHistory} className="text-[11px] text-muted-foreground underline">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => submit(h)}
                  className="text-xs font-medium px-3 py-1.5 rounded-[3px] press-brutal"
                  style={{
                    background: "white",
                    border: "2px solid var(--brand-ink)",
                    boxShadow: "2px 2px 0 var(--brand-ink)",
                    color: "var(--brand-ink)",
                  }}
                >
                  ↺ {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            className="p-3 rounded-[4px] text-sm mb-4 bg-card"
            style={{ border: "2.5px solid var(--destructive)" }}
          >
            {error}
          </div>
        )}

        {/* Empty state with suggestions */}
        {!query && (
          <div
            className="bg-card p-6 rounded-[4px]"
            style={{ border: "2.5px dashed var(--brand-ink)" }}
          >
            <p className="text-sm text-muted-foreground mb-4">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-xs font-medium px-3 py-1.5 rounded-[3px] press-brutal"
                  style={{
                    background: "#F4D738",
                    border: "2px solid var(--brand-ink)",
                    boxShadow: "2px 2px 0 var(--brand-ink)",
                    color: "#111",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <EmptyState
            icon={SearchX}
            title={`No results for "${query}"`}
            description="Try different keywords, a broader concept, or browse all submissions from the dashboard."
            action={{ label: "← Back to dashboard", onClick: () => window.location.href = "/" }}
          />
        )}

        {/* Search skeletons while loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SearchCardSkeleton key={i} />
            ))}
          </div>
        )}

        {results.length > 0 && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-medium pb-1 inline-block"
                style={{ borderBottom: "3px solid var(--brand-ink)" }}
              >
                {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r, i) => (
                <ProjectCard
                  key={r.project.project_id}
                  project={r.project}
                  index={i}
                  score={r.score}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SearchCardSkeleton() {
  return (
    <div
      className="bg-card rounded-lg overflow-hidden"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div className="h-1.5 bg-neutral-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-neutral-200 rounded animate-pulse flex-1" />
          <div className="h-4 w-12 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-4/6" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 w-14 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-14 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="h-px bg-neutral-200 animate-pulse" />
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
            <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-14 bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
