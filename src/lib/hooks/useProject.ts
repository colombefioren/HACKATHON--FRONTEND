import { useQuery } from "@tanstack/react-query";
import { api, projectStatus } from "@/lib/api";
import { POLLING_INTERVAL_MS } from "@/lib/constants";

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.getProject(projectId!).then((r) => r.project),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Only poll while agents are still working
      if (!data || projectStatus(data) === "pending") return POLLING_INTERVAL_MS;
      return false;
    },
  });
}
