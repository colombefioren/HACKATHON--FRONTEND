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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, projectStatus } from "@/lib/api";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: project, isLoading, error } = useProject(id);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
          <PollingLoader label="Loading project…" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Topbar />
        <div className="p-4 sm:p-8">
          <p className="text-sm text-destructive">{(error as Error)?.message ?? "Not found"}</p>
        </div>
      </div>
    );
  }

  const status = projectStatus(project);
  const themes = project.theme?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xs text-muted-foreground mb-3 inline-block hover:underline">
          ← Back to dashboard
        </Link>

        {/* Header card */}
        <div
          className="bg-card rounded-lg p-5 mb-6"
          style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
        >
          <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-medium mb-1">{project.short_description}</h1>
              {project.long_description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
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
                className="text-xs font-medium px-3 py-1.5 rounded-md press-brutal disabled:opacity-50"
                style={{
                  background: project.is_reviewed ? "var(--brand-mint)" : "var(--brand-mustard)",
                  border: "2.5px solid var(--brand-ink)",
                  boxShadow: "3px 3px 0 var(--brand-ink)",
                }}
              >
                {project.is_reviewed ? "✓ Reviewed" : "Mark reviewed"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {themes.map((t) => (
              <ThemeBadge key={t} label={t} />
            ))}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium px-2 py-0.5 rounded-sm underline"
                style={{ border: "1.5px solid var(--brand-ink)" }}
              >
                GitHub ↗
              </a>
            )}
          </div>

          {status === "pending" && (
            <div className="mt-4">
              <PollingLoader label="Agents working… auto-refreshing every 5s" />
            </div>
          )}
        </div>

        {/* Two-column analysis + chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Section title="Market analysis" accent="var(--brand-mint)">
              <QAAccordion items={project.market_agent_analysis ?? []} accent="var(--brand-mint)" />
            </Section>
            <Section title="Code analysis" accent="var(--brand-pink)">
              <QAAccordion items={project.code_agent_analysis ?? []} accent="var(--brand-pink)" />
            </Section>
          </div>
          <div>
            <ChatInterface projectId={project.project_id} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  accent,
  children,
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