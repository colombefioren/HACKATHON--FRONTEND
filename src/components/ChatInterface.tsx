import { useEffect, useRef, useState } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { PollingLoader } from "./PollingLoader";

interface ChatInterfaceProps {
  projectId?: string;
  title?: string;
}

export function ChatInterface({ projectId, title = "Ask the AI judge" }: ChatInterfaceProps) {
  const { history, pending, error, ask } = useChat(projectId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, pending]);

  return (
    <div
      className="bg-card rounded-[4px] flex flex-col"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div
        className="px-4 py-2.5 text-sm font-medium flex items-center justify-between"
        style={{ background: "var(--brand-mustard)", borderBottom: "2.5px solid var(--brand-ink)" }}
      >
        <span>{title}</span>
        <span className="text-[10px] text-muted-foreground">
          {projectId ? "Project context" : "General"}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px] min-h-[240px]">
        {history.length === 0 && !pending && (
          <p className="text-xs text-muted-foreground italic">
            Ask anything about this project — code quality, market fit, technical risks…
          </p>
        )}
        {history.map((turn, i) => (
          <div key={i} className="space-y-2">
            <Bubble side="right" color="var(--brand-sky)">
              {turn.input}
            </Bubble>
            {turn.output ? (
              <Bubble side="left" color="var(--brand-mint)">
                {turn.output}
              </Bubble>
            ) : (
              <Bubble side="left" color="var(--brand-mint)">
                <PollingLoader label="Thinking…"/>
              </Bubble>
            )}
          </div>
        ))}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending && input.trim()) {
            ask(input);
            setInput("");
          }
        }}
        className="p-3 flex gap-2"
        style={{ borderTop: "2.5px solid var(--brand-ink)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 text-sm px-3 py-2 rounded-[3px] outline-none bg-white"
          style={{ border: "2.5px solid var(--brand-ink)" }}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="text-sm font-medium px-4 py-2 rounded-[3px] press-brutal disabled:opacity-50"
          style={{
            background: "var(--brand-coral)",
            color: "var(--brand-ink)",
            border: "2.5px solid var(--brand-ink)",
            boxShadow: "3px 3px 0 var(--brand-ink)",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

function Bubble({
  side,
  color,
  children,
}: {
  side: "left" | "right";
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[80%] text-xs leading-relaxed px-3 py-2 rounded-[3px]"
        style={{
          background: color,
          border: "2px solid var(--brand-ink)",
          boxShadow: "2px 2px 0 var(--brand-ink)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
