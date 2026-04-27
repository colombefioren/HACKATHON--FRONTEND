import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { POLLING_INTERVAL_MS } from "@/lib/constants";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getAllProjects().then((r) => r.projects),
    refetchInterval: POLLING_INTERVAL_MS,
  });
}
