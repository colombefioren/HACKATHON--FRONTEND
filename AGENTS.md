# AGENTS.md — Evalio Frontend

## Stack

- **Framework**: Next.js 16.2.4 (App Router), React 19 — NOTE: This is the installed version
- **Styling**: Tailwind CSS 4.x (uses `@theme inline` syntax, NOT v3 config)
- **State**: TanStack Query v5 + React Query
- **UI**: Radix UI primitives (shadcn-style components in `src/components/ui/`)
- **Fonts**: Rubik (loaded in `layout.tsx`)

## Running

```bash
npm run dev    # Start dev server on localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## API

- Base URL: `http://192.168.2.167:8000/api` (override via `NEXT_PUBLIC_API_URL`)
- Polling interval: 5000ms (`POLLING_INTERVAL_MS` in `constants.ts`)
- Error handling: HTTP errors throw with `detail` message (API returns `{ detail: string }` on error)

## Architecture

```
src/app/           # Next.js App Router pages
  ├── page.tsx              # Dashboard (project list)
  ├── project/[id]/page.tsx # Project detail
  ├── search/page.tsx       # Semantic search
  ├── setup/page.tsx        # Create hackathon
src/lib/
  ├── api.ts               # API client + types
  ├── constants.ts         # Config (API base URL, colors)
  └── hooks/              # TanStack Query hooks (useProjects, useProject, etc.)
src/components/
  ├── ui/                  # Radix UI primitives
  ├── ProjectCard.tsx      # Project display
  ├── Topbar.tsx           # Navigation
  └── PageTransition.tsx   # Route animations
```

## Design System (Neo-brutalism)

- **Colors**: `--brand-ink` (#111), `--brand-mustard` (#E3A018), `--brand-coral` (#FF6B6B), `--brand-mint` (#7FBC8C), `--brand-sky` (#69D2E7)
- **Borders**: 2.5px solid black
- **Shadows**: Offset hard shadows (e.g., `4px 4px 0 var(--brand-ink)`)
- **Radius**: `--radius-md: 3px`

## Key Conventions

- CSS custom properties in `globals.css` (Tailwind v4 `@theme` syntax)
- `press-brutal` class for button press effect
- API returns `{ message, projects[] }` shape — destructure appropriately
- Project status: `projectStatus(p)` returns `"analyzed" | "pending" | "flagged"`
- Score extraction: looks for `/10` pattern in AI Q&A responses

## Brand

- **Name**: Evalio (NOT Judgy — that's the backend)
- **Logo**: "J" in mustard square

## Gotchas

- Tailwind v4 uses `@import "tailwindcss"` and `@theme inline { ... }` — not `tailwind.config.js`
- Radix dialogs need `use client` directive
- TanStack Query requires `QueryProvider` wrapper (in `components/providers.tsx`)

## Hackathon → Projects Architecture (NEW)

The API has hackathon and project entities. Current frontend shows only projects. Migration in progress:

```
/                     → Liste des hackathons (à implémenter)
/hackathon/[id]       → Projets d'un hackathon (à créer)
/project/[id]         → Détail projet (existant)
/search              → Recherche globale (existant)
/setup               → Créer hackathon (existant)
```

### API Endpoints (from spec.yaml)

| Endpoint | Description |
|----------|-------------|
| `GET /get-all-hackathons` | Liste tous les hackathons |
| `GET /get-hackathon/{id}` | Détails d'un hackathon |
| `GET /get-hackathon-projects/{id}` | Projets d'un hackathon |
| `POST /create-hackathon` | Créer un hackathon |
| `POST /create-project` | Soumettre un projet |
| `POST /review` | Approuver/rejeter un projet |

### Types à ajouter (src/lib/api.ts)

```typescript
interface Hackathon {
  id: number;
  name: string;
  description?: string;
  theme?: string;
  isAllowed: boolean;
  criteria?: string;
  deadline?: string;
  created_at?: string;
}
```

### Score extraction

Currently extracts `/10` from AI Q&A responses. Example:
```typescript
function extractScore(project: Project): number | null {
  const items = project.market_agent_analysis ?? [];
  for (const item of items) {
    const match = item.answer?.match(/\b([0-9](?:\.[0-9])?|10)\s*\/\s*10\b/);
    if (match) return parseFloat(match[1]);
  }
  return null;
}
```