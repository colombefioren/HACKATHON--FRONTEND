"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useSearch } from "@/lib/hooks/useSearch";
import Link from "next/link";

export default function SearchPage() {
  const { results, query, loading, error, run } = useSearch();
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-8 max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-medium mb-2">Semantic search</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Find projects by concept, tech stack or theme — powered by AI embeddings.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
          className="flex flex-col sm:flex-row gap-2 mb-8"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. healthcare apps using computer vision"
            className="flex-1 text-sm px-4 py-3 rounded-md bg-white outline-none"
            style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "4px 4px 0 var(--brand-ink)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-sm font-medium px-5 py-3 rounded-md press-brutal disabled:opacity-50"
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

        {error && (
          <div
            className="p-3 rounded-lg text-sm mb-4 bg-card"
            style={{ border: "2.5px solid var(--destructive)" }}
          >
            {error}
          </div>
        )}

        {!query && (
          <div
            className="bg-card p-6 rounded-lg text-sm text-muted-foreground"
            style={{ border: "2.5px dashed var(--brand-ink)" }}
          >
            Try queries like <em>&quot;AI tools for educators&quot;</em>,{" "}
            <em>&quot;blockchain fintech for SMEs&quot;</em>, or <em>&quot;React + Supabase apps&quot;</em>.
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No matches for <strong>&quot;{query}&quot;</strong>.{" "}
            <Link href="/" className="underline">
              Browse all submissions
            </Link>
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r, i) => (
              <ProjectCard key={r.project.project_id} project={r.project} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}