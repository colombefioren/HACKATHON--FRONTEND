"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Topbar } from "@/components/Topbar";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectModal } from "@/components/AddProjectModal";
import { useProjects } from "@/lib/hooks/useProjects";
import { projectStatus } from "@/lib/api";
import type { ProjectStatus } from "@/lib/constants";
import Link from "next/link";

type SortKey = "latest" | "score" | "status";

export default function DashboardPage() {
  const { data: projects = [], isLoading, error } = useProjects();
  const [filter, setFilter] = useState<ProjectStatus>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
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
    if (sort === "score") {
      out = [...out].sort((a, b) => {
        const scoreA = (a.market_agent_analysis?.length ?? 0) + (a.code_agent_analysis?.length ?? 0);
        const scoreB = (b.market_agent_analysis?.length ?? 0) + (b.code_agent_analysis?.length ?? 0);
        return scoreB - scoreA;
      });
    } else if (sort === "status") {
      const order = { analyzed: 0, flagged: 1, pending: 2 };
      out = [...out].sort((a, b) => order[projectStatus(a)] - order[projectStatus(b)]);
    }
    return out;
  }, [projects, filter, search, sort]);

  const stats = useMemo(() => {
    const total = projects.length;
    const analyzed = projects.filter((p) => projectStatus(p) === "analyzed").length;
    const pending = projects.filter((p) => projectStatus(p) === "pending").length;
    const reviewed = projects.filter((p) => p.is_reviewed).length;
    return { total, analyzed, pending, reviewed };
  }, [projects]);

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main className="px-4 sm:px-7 py-6 max-w-7xl mx-auto">
        <h1 className="sr-only">Evalio hackathon dashboard</h1>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-0 sm:max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
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

          <div className="flex gap-2 flex-wrap">
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
            className="text-sm font-medium px-4 py-2 rounded-[3px] press-brutal sm:ml-auto"
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

        {/* Stats — clickable to filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total submissions"
            value={stats.total}
            sub="This hackathon"
            onClick={() => setFilter("all")}
            active={filter === "all"}
          />
          <StatCard
            label="Analyzed"
            value={stats.analyzed}
            sub={stats.total ? `${Math.round((stats.analyzed / stats.total) * 100)}% complete` : "—"}
            color="var(--brand-mint)"
            onClick={() => setFilter("analyzed")}
            active={filter === "analyzed"}
          />
          <StatCard
            label="Pending review"
            value={stats.pending}
            sub="Awaiting agents"
            color="var(--brand-coral)"
            onClick={() => setFilter("pending")}
            active={filter === "pending"}
          />
          <StatCard
            label="Reviewed"
            value={stats.reviewed}
            sub={stats.total ? `${Math.round((stats.reviewed / stats.total) * 100)}% done` : "—"}
            color="var(--brand-purple)"
          />
        </div>

        {/* Section header + sort dropdown */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-sm font-medium pb-1 inline-block"
            style={{ borderBottom: "3px solid var(--brand-ink)" }}
          >
            All submissions
          </span>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {error && (
          <div
            className="p-4 rounded-[4px] text-sm mb-4 bg-card"
            style={{ border: "2.5px solid var(--destructive)", boxShadow: "4px 4px 0 var(--destructive)" }}
          >
            Couldn&apos;t reach the Evalio API: {(error as Error).message}
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
            style={{ border: "2.5px dashed #999", background: "transparent", cursor: "pointer" }}
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

const SORTS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "Latest" },
  { key: "score", label: "Score" },
  { key: "status", label: "Status" },
];

function StatCard({
  label, value, sub, color, onClick, active,
}: {
  label: string;
  value: number | string;
  sub: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-card p-4 rounded-[4px] text-left w-full press-brutal transition-transform"
      style={{
        border: `2.5px solid ${color ?? "var(--brand-ink)"}`,
        boxShadow: active
          ? `6px 6px 0 ${color ?? "var(--brand-ink)"}`
          : `4px 4px 0 ${color ?? "var(--brand-ink)"}`,
        outline: active ? `2px solid ${color ?? "var(--brand-ink)"}` : "none",
        outlineOffset: "2px",
      }}
    >
      <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-medium" style={{ color: color ?? "var(--brand-ink)" }}>
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </button>
  );
}

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORTS.find((s) => s.key === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-[3px] press-brutal"
        style={{
          background: "white",
          border: "2px solid var(--brand-ink)",
          boxShadow: "3px 3px 0 var(--brand-ink)",
          color: "var(--brand-ink)",
          minWidth: "120px",
        }}
      >
        <span className="flex-1 text-left">↕ {current.label}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-20 bg-white rounded-[3px] overflow-hidden"
          style={{
            border: "2.5px solid var(--brand-ink)",
            boxShadow: "4px 4px 0 var(--brand-ink)",
            minWidth: "140px",
          }}
        >
          {SORTS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { onChange(s.key); setOpen(false); }}
              className="w-full text-left text-xs font-medium px-4 py-2.5 flex items-center justify-between gap-3 transition-colors hover:bg-[#F4D738]"
              style={{
                borderTop: i > 0 ? "1.5px solid var(--brand-ink)" : "none",
                background: value === s.key ? "#F4D738" : "white",
                color: "var(--brand-ink)",
              }}
            >
              {s.label}
              {value === s.key && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="bg-card rounded-[4px] overflow-hidden"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div className="h-1.5 bg-neutral-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-neutral-200 rounded animate-pulse flex-1" />
          <div className="h-4 w-8 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-5/6" />
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
