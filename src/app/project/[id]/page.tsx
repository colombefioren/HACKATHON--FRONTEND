"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { QAAccordion } from "@/components/QAAccordion";
import { ChatInterface } from "@/components/ChatInterface";
import { PollingLoader } from "@/components/PollingLoader";
import { ThemeBadge } from "@/components/ThemeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useProject } from "@/lib/hooks/useProject";
import { useProjects } from "@/lib/hooks/useProjects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, projectStatus } from "@/lib/api";
import { toast } from "sonner";
import { AgentPollingStatus } from "@/components/AgentPollingStatus";
import { extractScore } from "@/lib/utils";

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 7.5 ? "var(--brand-mint)" : score >= 5 ? "var(--brand-mustard)" : "var(--brand-coral)";
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-3 rounded-[2px] overflow-hidden"
        style={{ border: "2px solid var(--brand-ink)", background: "#f0f0f0" }}
      >
        <div
          className="h-full transition-all"
          style={{ width: `${(score / 10) * 100}%`, background: color }}
        />
      </div>
      <span
        className="text-sm font-medium px-2 py-0.5 rounded-[2px] shrink-0"
        style={{ background: color, border: "1.5px solid var(--brand-ink)", color: "var(--brand-ink)" }}
      >
        {score.toFixed(1)}/10
      </span>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: project, isLoading, error } = useProject(id);
  const { data: allProjects = [] } = useProjects();
  const qc = useQueryClient();

  const reviewMut = useMutation({
    mutationFn: ({ isReviewed }: { isReviewed: boolean }) => api.reviewProject(id, isReviewed),
    onSuccess: (_, vars) => {
      toast.success(vars.isReviewed ? "Marked as reviewed" : "Marked as unreviewed");
      qc.invalidateQueries({ queryKey: ["project", id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  // Prev / next navigation
  const currentIdx = allProjects.findIndex((p) => p.project_id === id);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
          <PollingLoader label="Loading project…" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Topbar />
        <div className="p-4 sm:p-8">
          <p className="text-sm text-destructive">{(error as Error)?.message ?? "Not found"}</p>
        </div>
      </div>
    );
  }

  const status = projectStatus(project);
  const themes = project.theme?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const score = extractScore(project);

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="px-4 sm:px-7 py-6 max-w-6xl mx-auto">

        {/* Breadcrumb + prev/next */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <Link href="/" className="text-xs text-muted-foreground hover:underline">
            ← Back to dashboard
          </Link>
          <div className="flex gap-2">
            {prevProject && (
              <Link
                href={`/project/${prevProject.project_id}`}
                className="text-xs font-medium px-3 py-1 rounded-[3px] press-brutal"
                style={{ border: "1.5px solid var(--brand-ink)", background: "white", color: "var(--brand-ink)" }}
              >
                ← Prev
              </Link>
            )}
            {currentIdx >= 0 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                {currentIdx + 1} / {allProjects.length}
              </span>
            )}
            {nextProject && (
              <Link
                href={`/project/${nextProject.project_id}`}
                className="text-xs font-medium px-3 py-1 rounded-[3px] press-brutal"
                style={{ border: "1.5px solid var(--brand-ink)", background: "white", color: "var(--brand-ink)" }}
              >
                Next →
              </Link>
            )}
          </div>
        </div>

        {/* Header card */}
        <div
          className="bg-card rounded-[4px] p-5 mb-6"
          style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
        >
          <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-medium mb-1">{project.short_description}</h1>
              {project.long_description && (
                <p className="text-sm text-foreground leading-relaxed">
                  {project.long_description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              <div className="flex gap-1.5">
                <StatusBadge
                  label="Market"
                  status={(project.market_agent_analysis?.length ?? 0) > 0 ? "done" : "pending"}
                />
                <StatusBadge
                  label="Code"
                  status={(project.code_agent_analysis?.length ?? 0) > 0 ? "done" : "pending"}
                />
              </div>
              <button
                onClick={() => reviewMut.mutate({ isReviewed: !project.is_reviewed })}
                disabled={reviewMut.isPending}
                className="text-xs font-medium px-3 py-1.5 rounded-[3px] press-brutal disabled:opacity-50"
                style={{
                  background: project.is_reviewed ? "var(--brand-mint)" : "#F4D738",
                  border: "2.5px solid var(--brand-ink)",
                  boxShadow: "3px 3px 0 var(--brand-ink)",
                }}
              >
                {project.is_reviewed ? "✓ Reviewed" : "Mark reviewed"}
              </button>
            </div>
          </div>

          {/* Score bar */}
          {score !== null && (
            <div className="mb-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Market score
              </p>
              <ScoreBar score={score} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            {themes.map((t) => (
              <ThemeBadge key={t} label={t} />
            ))}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium px-2 py-0.5 rounded-[2px] underline"
                style={{ border: "1.5px solid var(--brand-ink)" }}
              >
                GitHub ↗
              </a>
            )}
          </div>

          {status === "pending" && (
            <AgentPollingStatus />
          )}
        </div>

        {/* Two-column: analysis + sticky chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <Section title="Market analysis" accent="var(--brand-mint)">
              <QAAccordion items={project.market_agent_analysis ?? []} accent="var(--brand-mint)" />
            </Section>
            <Section title="Code analysis" accent="var(--brand-pink)">
              <QAAccordion items={project.code_agent_analysis ?? []} accent="var(--brand-pink)" />
            </Section>
          </div>
          {/* Sticky chat */}
          <div className="lg:sticky lg:top-6">
            <ChatInterface projectId={project.project_id} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title, accent, children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-sm font-medium pb-1 mb-3 inline-block"
        style={{ borderBottom: `3px solid ${accent}` }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
