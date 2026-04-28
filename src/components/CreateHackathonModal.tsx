"use client";

import { useState, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CreateHackathonModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateHackathonModal({ open, onClose }: CreateHackathonModalProps) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techTags, setTechTags] = useState<string[]>(["Python", "JavaScript", "React"]);
  const [themeTags, setThemeTags] = useState<string[]>(["Healthcare", "Education", "Environment"]);
  const [criteriaTags, setCriteriaTags] = useState<string[]>(["Innovation", "Code Quality", "Market Potential"]);
  const [techInput, setTechInput] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [criteriaInput, setCriteriaInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isAllowed, setIsAllowed] = useState(true);

  const mut = useMutation({
    mutationFn: api.createHackathon,
    onSuccess: () => {
      toast.success("Hackathon created!");
      qc.invalidateQueries({ queryKey: ["hackathons"] });
      resetForm();
      onClose();
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const resetForm = () => {
    setName(""); setDescription(""); setDeadline("");
    setTechTags(["Python", "JavaScript", "React"]);
    setThemeTags(["Healthcare", "Education", "Environment"]);
    setCriteriaTags(["Innovation", "Code Quality", "Market Potential"]);
    setTechInput(""); setThemeInput(""); setCriteriaInput("");
    setIsAllowed(true);
  };

  const addTag = (value: string, tags: string[], setTags: (t: string[]) => void, setInput: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string, tags: string[], setTags: (t: string[]) => void) =>
    setTags(tags.filter((t) => t !== tag));

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    tags: string[],
    setTags: (t: string[]) => void,
    setInput: (v: string) => void,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value, tags, setTags, setInput);
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  if (!open) return null;

  const canSubmit = name.trim().length >= 3 && !mut.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
        style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "6px 6px 0 var(--brand-ink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 bg-card z-10"
          style={{ borderBottom: "2.5px solid var(--brand-ink)" }}
        >
          <div>
            <h2 className="text-lg font-medium">New hackathon</h2>
            <p className="text-[11px] text-muted-foreground">Configure evaluation criteria for your event</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-medium px-2 py-1 rounded-sm press-brutal"
            style={{ border: "1.5px solid var(--brand-ink)" }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) { toast.error("Name must be at least 3 characters"); return; }
            mut.mutate({
              name,
              description,
              technologies: techTags.join(", "),
              theme: themeTags.join(", "),
              criteria: criteriaTags.join(", "),
              deadline: deadline || undefined,
              isAllowed,
            });
          }}
          className="p-6 space-y-5"
        >
          {/* Name */}
          <Field label="Hackathon name *">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Hackathon 2025"
              className="w-full text-sm px-3 py-2 rounded-md outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What is this hackathon about?"
              className="w-full text-sm px-3 py-2 rounded-md outline-none bg-white resize-none"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </Field>

          {/* Technologies */}
          <Field label="Technologies" hint="Enter to add">
            <TagInput
              id="tech-input"
              tags={techTags}
              input={techInput}
              color="var(--brand-sky)"
              onInputChange={setTechInput}
              onKeyDown={(e) => handleKeyDown(e, techInput, techTags, setTechTags, setTechInput)}
              onBlur={() => addTag(techInput, techTags, setTechTags, setTechInput)}
              onRemove={(t) => removeTag(t, techTags, setTechTags)}
            />
          </Field>

          {/* Themes */}
          <Field label="Themes" hint="Enter to add">
            <TagInput
              id="theme-input"
              tags={themeTags}
              input={themeInput}
              color="var(--brand-pink)"
              onInputChange={setThemeInput}
              onKeyDown={(e) => handleKeyDown(e, themeInput, themeTags, setThemeTags, setThemeInput)}
              onBlur={() => addTag(themeInput, themeTags, setThemeTags, setThemeInput)}
              onRemove={(t) => removeTag(t, themeTags, setThemeTags)}
            />
          </Field>

          {/* Criteria */}
          <Field label="Evaluation criteria" hint="Used by AI agents to score projects">
            <TagInput
              id="criteria-input"
              tags={criteriaTags}
              input={criteriaInput}
              color="var(--brand-mint)"
              onInputChange={setCriteriaInput}
              onKeyDown={(e) => handleKeyDown(e, criteriaInput, criteriaTags, setCriteriaTags, setCriteriaInput)}
              onBlur={() => addTag(criteriaInput, criteriaTags, setCriteriaTags, setCriteriaInput)}
              onRemove={(t) => removeTag(t, criteriaTags, setCriteriaTags)}
            />
          </Field>

          {/* Deadline */}
          <Field label="Deadline (optional)">
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-md outline-none bg-white"
              style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
            />
          </Field>

          {/* Submissions toggle */}
          <div
            className="flex items-center justify-between p-3 rounded-md"
            style={{ border: "2px solid var(--brand-ink)", background: isAllowed ? "var(--brand-mint)" : "#f5f5f5" }}
          >
            <div>
              <p className="text-sm font-medium">Accept submissions</p>
              <p className="text-[11px] text-muted-foreground">
                {isAllowed ? "Open — participants can submit" : "Closed"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAllowed((v) => !v)}
              className="relative w-12 h-6 rounded-full transition-colors shrink-0"
              style={{ background: isAllowed ? "var(--brand-mint)" : "#ddd", border: "2.5px solid var(--brand-ink)" }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                style={{ background: "var(--brand-ink)", transform: isAllowed ? "translateX(24px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full text-sm font-medium py-2.5 rounded-md press-brutal disabled:opacity-60"
            style={{
              background: "#F4D738",
              color: "#111",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            {mut.isPending ? "Creating…" : "Create hackathon"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TagInput({
  id, tags, input, color, onInputChange, onKeyDown, onBlur, onRemove,
}: {
  id: string;
  tags: string[];
  input: string;
  color: string;
  onInputChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onRemove: (t: string) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 rounded-md bg-white min-h-[44px] cursor-text"
      style={{ border: "2.5px solid var(--brand-ink)" }}
      onClick={() => document.getElementById(id)?.focus()}
    >
      {tags.map((t) => (
        <span
          key={t}
          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-sm"
          style={{ background: color, border: "1.5px solid var(--brand-ink)", color: "var(--brand-ink)" }}
        >
          {t}
          <button type="button" onClick={() => onRemove(t)} className="text-[10px] hover:opacity-60 ml-0.5">✕</button>
        </span>
      ))}
      <input
        id={id}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={tags.length === 0 ? "Type and press Enter…" : ""}
        className="flex-1 min-w-[100px] text-sm outline-none bg-transparent py-0.5"
      />
    </div>
  );
}
