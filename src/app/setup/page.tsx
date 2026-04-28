"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Topbar } from "@/components/Topbar";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const STORAGE_KEY = "judgy_hackathon_config";

interface SavedConfig {
  technologies: string[];
  themes: string[];
  isAllowed: boolean;
  savedAt: string;
}

function loadConfig(): SavedConfig | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return null;
  }
}

export default function SetupPage() {

      const router = useRouter();
    
    const user = useUserStore(state=>state.user);
    
    if(!user){
      router.push("/auth");
    }
  const [techTags, setTechTags] = useState<string[]>(["Python", "JavaScript", "React", "Node.js", "AI/ML"]);
  const [themeTags, setThemeTags] = useState<string[]>(["Healthcare", "Education", "Environment", "Finance", "Social Good"]);
  const [techInput, setTechInput] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [isAllowed, setIsAllowed] = useState(true);
  const [savedConfig, setSavedConfig] = useState<SavedConfig | null>(null);

  useEffect(() => {
    const cfg = loadConfig();
    if (cfg) {
      setSavedConfig(cfg);
      setTechTags(cfg.technologies);
      setThemeTags(cfg.themes);
      setIsAllowed(cfg.isAllowed);
    }
  }, []);

  const mut = useMutation({
    mutationFn: api.createHackathon,
    onSuccess: () => {
      const cfg: SavedConfig = {
        technologies: techTags,
        themes: themeTags,
        isAllowed,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      setSavedConfig(cfg);
      toast.success("Hackathon configured");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const addTag = (
    value: string,
    tags: string[],
    setTags: (t: string[]) => void,
    setInput: (v: string) => void,
  ) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string, tags: string[], setTags: (t: string[]) => void) => {
    setTags(tags.filter((t) => t !== tag));
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Topbar submissionsOpen={isAllowed} />
      <main className="px-4 sm:px-7 py-8 max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-medium mb-1">Hackathon setup</h1>
        <p className="text-sm text-foreground mb-6">
          Define the themes and tech stack. Agents use this to evaluate submissions.
        </p>

        {/* Last saved banner */}
        {savedConfig && (
          <div
            className="mb-6 px-4 py-3 rounded-[3px] text-xs flex items-center justify-between gap-3"
            style={{ background: "var(--brand-mint)", border: "2px solid var(--brand-ink)", boxShadow: "3px 3px 0 var(--brand-ink)" }}
          >
            <span className="font-medium text-foreground">
              ✓ Config saved — {savedConfig.technologies.length} techs, {savedConfig.themes.length} themes
            </span>
            <span className="text-muted-foreground">
              {new Date(savedConfig.savedAt).toLocaleDateString()}
            </span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (techTags.length === 0) { toast.warning("Add at least one technology"); return; }
            if (themeTags.length === 0) { toast.warning("Add at least one theme"); return; }
            mut.mutate({
              technologies: techTags.join(", "),
              theme: themeTags.join(", "),
              isAllowed,
            });
          }}
          className="bg-card rounded-[4px] p-6 space-y-6"
          style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
        >
          {/* Technologies */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider mb-2 text-muted-foreground">
              Technologies
            </label>
            <div
              className="flex flex-wrap gap-1.5 p-2 rounded-[3px] bg-white min-h-[44px] cursor-text"
              style={{ border: "2.5px solid var(--brand-ink)" }}
              onClick={() => document.getElementById("tech-input")?.focus()}
            >
              {techTags.map((t) => (
                <Tag key={t} label={t} color="var(--brand-sky)" onRemove={() => removeTag(t, techTags, setTechTags)} />
              ))}
              <input
                id="tech-input"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, techInput, techTags, setTechTags, setTechInput)}
                onBlur={() => addTag(techInput, techTags, setTechTags, setTechInput)}
                placeholder={techTags.length === 0 ? "Type and press Enter…" : ""}
                className="flex-1 min-w-[120px] text-sm outline-none bg-transparent py-0.5"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Press Enter or comma to add</p>
          </div>

          {/* Themes */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider mb-2 text-muted-foreground">
              Themes
            </label>
            <div
              className="flex flex-wrap gap-1.5 p-2 rounded-[3px] bg-white min-h-[44px] cursor-text"
              style={{ border: "2.5px solid var(--brand-ink)" }}
              onClick={() => document.getElementById("theme-input")?.focus()}
            >
              {themeTags.map((t) => (
                <Tag key={t} label={t} color="var(--brand-pink)" onRemove={() => removeTag(t, themeTags, setThemeTags)} />
              ))}
              <input
                id="theme-input"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, themeInput, themeTags, setThemeTags, setThemeInput)}
                onBlur={() => addTag(themeInput, themeTags, setThemeTags, setThemeInput)}
                placeholder={themeTags.length === 0 ? "Type and press Enter…" : ""}
                className="flex-1 min-w-[120px] text-sm outline-none bg-transparent py-0.5"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Press Enter or comma to add</p>
          </div>

          {/* Submissions toggle */}
          <div
            className="flex items-center justify-between p-3 rounded-[3px]"
            style={{ border: "2px solid var(--brand-ink)", background: isAllowed ? "var(--brand-mint)" : "#f5f5f5" }}
          >
            <div>
              <p className="text-sm font-medium">Accept new submissions</p>
              <p className="text-[11px] text-muted-foreground">
                {isAllowed ? "Hackathon is open — participants can submit" : "Hackathon is closed"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAllowed((v) => !v)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{
                background: isAllowed ? "var(--brand-mint)" : "#ddd",
                border: "2.5px solid var(--brand-ink)",
                flexShrink: 0,
              }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                style={{
                  background: "var(--brand-ink)",
                  transform: isAllowed ? "translateX(2px)" : "translateX(24px)",
                }}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full text-sm font-medium py-2.5 rounded-[3px] press-brutal disabled:opacity-60"
            style={{
              background: "#F4D738",
              color: "#111",
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

function Tag({ label, color, onRemove }: { label: string; color: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-[2px]"
      style={{ background: color, border: "1.5px solid var(--brand-ink)", color: "var(--brand-ink)" }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-[10px] leading-none hover:opacity-60 ml-0.5"
        aria-label={`Remove ${label}`}
      >
        ✕
      </button>
    </span>
  );
}
