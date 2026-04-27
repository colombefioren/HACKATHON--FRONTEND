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
      const optimistic: ChatTurn = { input: question, output: "" };
      setHistory((h) => [...h, optimistic]);
      try {
        const res = projectId
          ? await api.chat({ project_id: projectId, question, chathistory: history })
          : await api.simpleChat(question);
        setHistory(res.chathistory ?? [...history, { input: question, output: res.answer }]);
      } catch (e) {
        setError((e as Error).message);
        // remove optimistic
        setHistory((h) => h.slice(0, -1));
      } finally {
        setPending(false);
      }
    },
    [history, projectId],
  );

  const reset = useCallback(() => setHistory([]), []);

  return { history, pending, error, ask, reset };
}
