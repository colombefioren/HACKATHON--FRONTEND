"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  hackathonId?: number | string;
}

// Validate GitHub URL format
function isValidGithubUrl(url: string): boolean {
  if (!url.trim()) return false;
  // Accept github.com, www.github.com, and github.com with www
  // Also accepts raw GitHub enterprise URLs
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/i;
  return githubRegex.test(url.trim());
}

// Validate short description
function isValidShortDescription(desc: string): boolean {
  const trimmed = desc.trim();
  // Must be at least 5 characters and at most 100
  return trimmed.length >= 5 && trimmed.length <= 100;
}

export function AddProjectModal({ open, onClose, hackathonId }: AddProjectModalProps) {
  const qc = useQueryClient();
  const [shortDescription, setShort] = useState("");
  const [longDescription, setLong] = useState("");
  const [githubLink, setGithub] = useState("");
  const [touched, setTouched] = useState({ short: false, github: false });

  const createMut = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      toast.success("Project submitted — agents are analyzing it now");
      qc.invalidateQueries({ queryKey: ["hackathon-projects"] });
      setShort("");
      setLong("");
      setGithub("");
      setTouched({ short: false, github: false });
      onClose();
    },
    onError: (e) => toast.error(`Submission failed: ${(e as Error).message}`),
  });

  // Validation checks
  const shortError = touched.short && !isValidShortDescription(shortDescription);
  const githubError = touched.github && !isValidGithubUrl(githubLink);
  const canSubmit = isValidShortDescription(shortDescription) && isValidGithubUrl(githubLink) && !createMut.isPending;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-card border-brutal rounded-[4px] shadow-brutal-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium">Add submission</h2>
          <button
            onClick={onClose}
            className="text-xs font-medium px-2 py-1 rounded-[2px] press-brutal"
            style={{ border: "1.5px solid var(--brand-ink)" }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Mark fields as touched to show errors
            setTouched({ short: true, github: true });
            
            if (!canSubmit) {
              if (!isValidShortDescription(shortDescription)) {
                toast.error("Short description must be 5-100 characters");
              } else if (!isValidGithubUrl(githubLink)) {
                toast.error("Please enter a valid GitHub repository URL");
              }
              return;
            }
            createMut.mutate({ shortDescription, longDescription, githubLink, hackathonId });
          }}
          className="space-y-4"
        >
          <Field 
            label="Short description *" 
            error={shortError ? "Must be 5-100 characters" : undefined}
          >
            <input
              value={shortDescription}
              onChange={(e) => setShort(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, short: true }))}
              placeholder="One-liner describing your project"
              className="w-full text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
              style={{ 
                border: shortError ? "2.5px solid var(--destructive)" : "2.5px solid var(--brand-ink)", 
                boxShadow: shortError ? "3px 3px 0 var(--destructive)" : "3px 3px 0 var(--brand-ink)" 
              }}
            />
          </Field>
          
          <Field label="Long description">
            <textarea
              value={longDescription}
              onChange={(e) => setLong(e.target.value)}
              rows={3}
              placeholder="What does it do? Who is it for?"
              className="w-full text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </Field>
          
          <Field 
            label="GitHub URL *" 
            error={githubError ? "Must be a valid GitHub repo URL (e.g., github.com/user/repo)" : undefined}
          >
            <input
              value={githubLink}
              onChange={(e) => setGithub(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, github: true }))}
              placeholder="https://github.com/user/repo"
              className="w-full text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
              style={{ 
                border: githubError ? "2.5px solid var(--destructive)" : "2.5px solid var(--brand-ink)", 
                boxShadow: githubError ? "3px 3px 0 var(--destructive)" : "3px 3px 0 var(--brand-ink)" 
              }}
            />
          </Field>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full text-sm font-medium py-2.5 rounded-[3px] press-brutal disabled:opacity-60"
            style={{
              background: canSubmit ? "var(--brand-coral)" : "var(--brand-ink)",
              color: canSubmit ? "var(--brand-ink)" : "white",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            {createMut.isPending ? "Submitting…" : "+ Submit project"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-wider mb-1.5 text-muted-foreground">
        {label}
      </span>
      {children}
      {error && (
        <span className="block text-[11px] text-destructive mt-1">{error}</span>
      )}
    </label>
  );
}