import { API_BASE_URL } from "./constants";

// ============= Types =============

export interface QAItem {
  name: ReactNode;
  question: string;
  answer: string;
}

export interface ChatTurn {
  input: string;
  output: string;
}

export interface Project {
  _id?: string;
  project_id: string;
  short_description: string;
  long_description?: string;
  github_link: string;
  theme?: string;
  is_reviewed?: boolean;
  code_agent_analysis?: QAItem[];
  market_agent_analysis?: QAItem[];
  files_analyzed?: number;
  created_at?: string;
}

export interface CreateProjectInput {
  shortDescription: string;
  longDescription?: string;
  githubLink: string;
}

export interface CreateHackathonInput {
  name: string;
  description?: string;
  technologies?: string;
  theme?: string;
  criteria?: string;
  deadline?: string;
  isAllowed: boolean;
}

export interface Hackathon {
  id?: number;
  hackathon_id?: number;
  _id?: string | number;
  name?: string;
  description?: string;
  theme?: string;
  technologies?: string;
  criteria?: string;
  isAllowed?: boolean;
  is_allowed?: boolean;
  deadline?: string;
  created_at?: string;
}

export interface ChatInput {
  project_id?: string;
  question: string;
  chathistory?: ChatTurn[];
}

export interface ChatResponse {
  answer: string;
  chathistory: ChatTurn[];
}

export interface SearchResult {
  project: Project;
  score?: number;
}

// ============= HTTP helper =============

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

// ============= API surface =============

export const api = {
  // Projects
  getAllProjects: () =>
    http<{ message: string; projects: Project[] }>("/get-all"),

  getProject: (id: string) =>
    http<{ message: string; project: Project }>(`/get-project/${id}`),

  createProject: (input: CreateProjectInput) =>
    http<{ message: string; project_id: string }>("/create-project", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  reviewProject: (project_id: string, isReviewed: boolean) =>
    http<{ message: string; project_id: string }>("/review", {
      method: "POST",
      body: JSON.stringify({ project_id, isReviewed }),
    }),

  // Hackathon setup
  createHackathon: (input: CreateHackathonInput) =>
    http<{ message: string; hackathon_id: number }>("/create-hackathon", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  getAllHackathons: () =>
    http<{ hackathons: Hackathon[] }>("/get-all-hackathons"),

  getHackathon: (id: number | string) =>
    http<{ hackathon: Hackathon }>(`/get-hackathon/${id}`),

  getHackathonProjects: (id: number | string) =>
    http<{ projects: Project[] }>(`/get-hackathon-projects/${id}`),

  getProjectScore: (project_id: string) =>
    http<{ total_score: number; scores: Record<string, number> }>(`/get-project-score/${project_id}`),

  getHackathonLeaderboard: (id: number | string) =>
    http<{ leaderboard: Array<{ project: Project; total_score: number }> }>(`/get-hackathon-leaderboard/${id}`),

  // Chat
  chat: (input: ChatInput) =>
    http<ChatResponse>("/chat-agent", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  simpleChat: (question: string) =>
    http<ChatResponse>("/chat-agent/simple", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  // Search
  search: (query: string) =>
    http<{ message: string; results: SearchResult[] }>("/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  // Direct agent calls
  analyzeMarket: (idea: string, theme?: string) =>
    http<{ message: string; idea: string; matched_theme: string; analysis: QAItem[] }>(
      "/market-agent/analyze",
      { method: "POST", body: JSON.stringify({ idea, theme }) },
    ),

  analyzeCode: (repo_url: string) =>
    http<{ message: string; repo_url: string; files_analyzed: number; analysis: QAItem[] }>(
      "/code-agent/analyze",
      { method: "POST", body: JSON.stringify({ repo_url }) },
    ),
};

// Helpers
export function projectStatus(p: Project): "analyzed" | "pending" | "flagged" {
  const hasMarket = (p.market_agent_analysis?.length ?? 0) > 0;
  const hasCode = (p.code_agent_analysis?.length ?? 0) > 0;
  if (hasMarket && hasCode) return "analyzed";
  if (p.is_reviewed === false && (hasMarket || hasCode)) return "flagged";
  return "pending";
}

/** Extract a reliable numeric/string ID from a Hackathon object regardless of field name */
export function hackathonId(h: Hackathon): string | number | undefined {
  return h.id ?? h.hackathon_id ?? (h._id as number | string | undefined);
}
