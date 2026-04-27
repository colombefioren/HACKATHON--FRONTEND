import { useState, useCallback } from "react";
import { api, type SearchResult } from "@/lib/api";

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
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
  }, []);

  return { results, query, loading, error, run };
}
