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
      if (!data) return POLLING_INTERVAL_MS;
      return projectStatus(data) === "analyzed" ? false : POLLING_INTERVAL_MS;
    },
  });
}
