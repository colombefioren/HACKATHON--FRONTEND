"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  const qc = useQueryClient();
  const [shortDescription, setShort] = useState("");
  const [longDescription, setLong] = useState("");
  const [githubLink, setGithub] = useState("");

  const createMut = useMutation({
    mutationFn: api.createProject,
    onSuccess: (data) => {
      toast.success("Project submitted — agents are analyzing it now");
      qc.invalidateQueries({ queryKey: ["projects"] });
      setShort("");
      setLong("");
      setGithub("");
      onClose();
      // optionally navigate; left to caller
      void data;
    },
    onError: (e) => toast.error(`Submission failed: ${(e as Error).message}`),
  });

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
            if (!shortDescription.trim() || !githubLink.trim()) {
              toast.error("Short description and GitHub URL are required");
              return;
            }
            createMut.mutate({ shortDescription, longDescription, githubLink });
          }}
          className="space-y-4"
        >
          <Field label="Short description *">
            <input
              value={shortDescription}
              onChange={(e) => setShort(e.target.value)}
              placeholder="One-liner describing your project"
              className="w-full text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
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
          <Field label="GitHub URL *">
            <input
              value={githubLink}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </Field>

          <button
            type="submit"
            disabled={createMut.isPending}
            className="w-full text-sm font-medium py-2.5 rounded-[3px] press-brutal disabled:opacity-60"
            style={{
              background: "var(--brand-coral)",
              color: "var(--brand-ink)",
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-wider mb-1.5 text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
