import { useState, useCallback } from "react";
import { api, type ChatTurn } from "@/lib/api";

export function useChat(projectId?: string) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(
    async (question: string) => {
      if (!question.trim()) return;
      setPending(true);
      setError(null);
      // Optimistic placeholder
      setHistory((h) => [...h, { input: question, output: "" }]);
      try {
        const res = projectId
          ? await api.chat({ project_id: projectId, question, chathistory: [] })
          : await api.simpleChat(question);
        // Use functional update to avoid stale closure + use server history
        setHistory(res.chathistory ?? [{ input: question, output: res.answer }]);
      } catch (e) {
        setError((e as Error).message);
        // remove optimistic entry
        setHistory((h) => h.slice(0, -1));
      } finally {
        setPending(false);
      }
    },
    [projectId],
  );

  const reset = useCallback(() => setHistory([]), []);

  return { history, pending, error, ask, reset };
}
