"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectModal } from "@/components/AddProjectModal";
import { useProjects } from "@/lib/hooks/useProjects";
import { projectStatus } from "@/lib/api";
import type { ProjectStatus } from "@/lib/constants";
import Link from "next/link";

export default function DashboardPage() {
  const { data: projects = [], isLoading, error } = useProjects();
  const [filter, setFilter] = useState<ProjectStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let out = projects;
    if (filter !== "all") out = out.filter((p) => projectStatus(p) === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (p) =>
          p.short_description?.toLowerCase().includes(q) ||
          p.long_description?.toLowerCase().includes(q) ||
          p.theme?.toLowerCase().includes(q),
      );
    }
    return out;
  }, [projects, filter, search]);

  const stats = useMemo(() => {
    const total = projects.length;
    const analyzed = projects.filter((p) => projectStatus(p) === "analyzed").length;
    const pending = projects.filter((p) => projectStatus(p) === "pending").length;
    return { total, analyzed, pending };
  }, [projects]);

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main className="px-7 py-6 max-w-7xl mx-auto">
        <h1 className="sr-only">Judgy hackathon dashboard</h1>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions..."
              className="w-full text-sm pl-9 pr-3 py-2 rounded-[3px] bg-white outline-none"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </div>

          <div className="flex gap-2">
            {FILTERS.map((f) => {
              const sel = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="text-xs font-medium px-3.5 py-1.5 rounded-[3px] press-brutal"
                  style={{
                    background: sel ? "var(--brand-ink)" : "white",
                    color: sel ? "var(--brand-yellow)" : "var(--brand-ink)",
                    border: "2.5px solid var(--brand-ink)",
                    boxShadow: "3px 3px 0 var(--brand-ink)",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-medium px-4 py-1.5 rounded-[3px] press-brutal"
            style={{
              background: "var(--brand-coral)",
              color: "var(--brand-ink)",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            + Add project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total submissions" value={stats.total} sub="This hackathon" />
          <StatCard
            label="Analyzed"
            value={stats.analyzed}
            sub={stats.total ? `${Math.round((stats.analyzed / stats.total) * 100)}% complete` : "—"}
            color="var(--brand-mint)"
          />
          <StatCard
            label="Pending review"
            value={stats.pending}
            sub="Awaiting agents"
            color="var(--brand-coral)"
          />
          <StatCard
            label="Avg market score"
            value={projects.length ? "7.4" : "—"}
            sub="Out of 10"
            color="var(--brand-purple)"
          />
        </div>

        {/* Section */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-sm font-medium pb-1 inline-block"
            style={{ borderBottom: "3px solid var(--brand-ink)" }}
          >
            All submissions
          </span>
          <span className="text-xs text-muted-foreground">Sort by: latest</span>
        </div>

        {error && (
          <div
            className="p-4 rounded-[4px] text-sm mb-4 bg-card"
            style={{ border: "2.5px solid var(--destructive)", boxShadow: "4px 4px 0 var(--destructive)" }}
          >
            Couldn&apos;t reach the Judgy API: {(error as Error).message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((p, i) => (
                <ProjectCard key={p.project_id} project={p} index={i} />
              ))}

          <button
            onClick={() => setModalOpen(true)}
            className="rounded-[4px] flex flex-col items-center justify-center gap-2.5 min-h-[170px] px-4 py-6"
            style={{
              border: "2.5px dashed #999",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <div
              className="w-9 h-9 rounded-[3px] flex items-center justify-center text-2xl text-neutral-500"
              style={{ border: "2.5px dashed #999" }}
            >
              +
            </div>
            <div className="text-sm font-medium text-neutral-500">Add new submission</div>
            <div className="text-[11px] text-neutral-400 text-center">
              Paste a GitHub URL or upload a zip
            </div>
          </button>
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground text-center">
            No submissions match your filters yet.{" "}
            <Link href="/setup" className="underline">
              Set up a hackathon first?
            </Link>
          </p>
        )}
      </main>

      <AddProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

const FILTERS: { key: ProjectStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "analyzed", label: "Analyzed" },
  { key: "pending", label: "Pending" },
  { key: "flagged", label: "Flagged" },
];

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number | string;
  sub: string;
  color?: string;
}) {
  return (
    <div
      className="bg-card p-4 rounded-[4px]"
      style={{
        border: `2.5px solid ${color ?? "var(--brand-ink)"}`,
        boxShadow: `4px 4px 0 ${color ?? "var(--brand-ink)"}`,
      }}
    >
      <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-medium" style={{ color: color ?? "var(--brand-ink)" }}>
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="bg-card rounded-[4px] p-4 h-[170px] animate-pulse"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3" />
      <div className="h-3 bg-neutral-100 rounded w-full mb-2" />
      <div className="h-3 bg-neutral-100 rounded w-5/6" />
    </div>
  );
}