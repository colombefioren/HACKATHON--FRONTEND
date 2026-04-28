import { useState, useCallback, useRef, useEffect } from "react";
import { api, type SearchResult } from "@/lib/api";

const DEBOUNCE_MS = 300;

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const run = useCallback(async (q: string) => {
    setQuery(q);
    // Clear pending debounce timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!q.trim()) {
      setResults([]);
      return;
    }
    // Debounce the actual API call
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.search(q);
        setResults(res.results ?? []);
      } catch (e) {
        setError((e as Error).message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  return { results, query, loading, error, run };
}
