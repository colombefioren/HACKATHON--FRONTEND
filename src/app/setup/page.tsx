"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Topbar } from "@/components/Topbar";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SetupPage() {
  const [technologies, setTech] = useState("Python, JavaScript, React, Node.js, AI/ML");
  const [theme, setTheme] = useState("Healthcare, Education, Environment, Finance, Social Good");
  const [isAllowed, setIsAllowed] = useState(true);

  const mut = useMutation({
    mutationFn: api.createHackathon,
    onSuccess: () => toast.success("Hackathon configured"),
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-8 max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-medium mb-2">Hackathon setup</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Define the themes participants can pick from and the tech stack you expect.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate({ technologies, theme, isAllowed });
          }}
          className="bg-card rounded-lg p-6 space-y-5"
          style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
        >
          <Field label="Technologies (comma-separated)">
            <textarea
              value={technologies}
              onChange={(e) => setTech(e.target.value)}
              rows={2}
              className="w-full text-sm px-3 py-2 rounded-md outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)" }}
            />
          </Field>

          <Field label="Themes (comma-separated)">
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              rows={2}
              className="w-full text-sm px-3 py-2 rounded-md outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)" }}
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllowed}
              onChange={(e) => setIsAllowed(e.target.checked)}
              className="w-5 h-5"
              style={{ accentColor: "var(--brand-ink)" }}
            />
            <span className="text-sm font-medium">Accept new submissions</span>
          </label>

          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full text-sm font-medium py-2.5 rounded-md press-brutal disabled:opacity-60"
            style={{
              background: "var(--brand-mustard)",
              color: "var(--brand-ink)",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            {mut.isPending ? "Saving…" : "Save hackathon"}
          </button>
        </form>
      </main>
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