import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHackathons() {
  return useQuery({
    queryKey: ["hackathons"],
    queryFn: () => api.getAllHackathons().then((r) => r.hackathons ?? []),
  });
}

export function useHackathon(id: number | string | undefined) {
  return useQuery({
    queryKey: ["hackathon", id],
    queryFn: () => api.getHackathon(id!).then((r) => r.hackathon),
    enabled: !!id,
  });
}

export function useHackathonProjects(id: number | string | undefined) {
  return useQuery({
    queryKey: ["hackathon-projects", id],
    queryFn: () => api.getHackathonProjects(id!).then((r) => r.projects ?? []),
    enabled: !!id,
  });
}

export function useHackathonLeaderboard(id: number | string | undefined) {
  return useQuery({
    queryKey: ["hackathon-leaderboard", id],
    queryFn: () => api.getHackathonLeaderboard(id!).then((r) => r.leaderboard ?? []),
    enabled: !!id,
  });
}
