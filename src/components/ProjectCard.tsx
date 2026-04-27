"use client";

import Link from "next/link";
import { ACCENT_COLORS } from "@/lib/constants";
import { type Project, projectStatus } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";
import { ThemeBadge } from "./ThemeBadge";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const status = projectStatus(project);
  const num = String(index + 1).padStart(2, "0");

  const tags: string[] = [];
  if (project.theme) tags.push(...project.theme.split(",").map((t) => t.trim()).filter(Boolean));

  return (
    <Link
      href={`/project/${project.project_id}`}
      className="block bg-card border-brutal rounded-[4px] shadow-brutal-lg overflow-hidden press-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-xl transition-all"
    >
      <div className="h-1.5" style={{ background: accent }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2">
            {project.short_description}
          </h3>
          <span
            className="text-[11px] font-medium text-muted-foreground px-1.5 py-0.5 rounded-[2px] shrink-0 ml-2"
            style={{ background: "#f5f5f5", border: "1.5px solid #ddd" }}
          >
            #{num}
          </span>
        </div>

        {project.long_description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {project.long_description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((t) => (
              <ThemeBadge key={t} label={t} />
            ))}
          </div>
        )}

        <div
          className="pt-2.5 flex items-center justify-between"
          style={{ borderTop: "2px solid var(--brand-ink)" }}
        >
          <div className="flex gap-1.5">
            <StatusBadge
              label="Market"
              status={(project.market_agent_analysis?.length ?? 0) > 0 ? "done" : "missing"}
            />
            <StatusBadge
              label="Code"
              status={(project.code_agent_analysis?.length ?? 0) > 0 ? "done" : "missing"}
            />
          </div>
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-[2px]"
            style={{ border: "1.5px solid var(--brand-ink)" }}
          >
            Open ↗
          </span>
        </div>

        {status === "pending" && (
          <p className="mt-2 text-[10px] text-muted-foreground italic">
            Agents working… results in 30–60s
          </p>
        )}
      </div>
    </Link>
  );
}