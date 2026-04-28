# Add projectType Select to AddProjectModal

## Context

The backend accepts a `projectType` field when creating a project, with 26 possible values (NEXT_JS, VUE, NUXT, ANGULAR, SVELTE, SVELTEKIT, ASTRO, REMIX, TAILWIND, NODE_EXPRESS, FASTAPI, DJANGO, SPRING_BOOT, GIN, RAILS, LARAVEL, ACTIX, SWIFT_UI, KOTLIN_JETPACK, REACT_NATIVE, EXPO, FLUTTER, DOTNET_MAUI, IONIC, NATIVESCRIPT, OTHER).

The current `AddProjectModal` form has no project type field. We need to add a human-readable select dropdown that sends the correct backend enum value.

## Changes

### 1. `src/lib/api.ts` — Update `CreateProjectInput`

Add `projectType?: string` to the interface:

```typescript
export interface CreateProjectInput {
  shortDescription: string;
  longDescription?: string;
  githubLink: string;
  hackathonId?: number | string;
  projectType?: string; // NEW
}
```

### 2. `src/components/AddProjectModal.tsx` — Add Select Field

- Import `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `@/components/ui/select`
- Add `projectType` state, defaulting to `"OTHER"`
- Add a `Field` with a `Select` component in the form, placed between "Short description" and "Long description"
- Map backend enum values to human-readable labels (e.g., `NEXT_JS` → `Next.js`, `REACT_NATIVE` → `React Native`)
- Pass `projectType` in the `createMut.mutate()` call

### 3. Human-Readable Labels Mapping

| Backend Value | Display Label |
|---|---|
| NEXT_JS | Next.js |
| VUE | Vue |
| NUXT | Nuxt |
| ANGULAR | Angular |
| SVELTE | Svelte |
| SVELTEKIT | SvelteKit |
| ASTRO | Astro |
| REMIX | Remix |
| TAILWIND | Tailwind |
| NODE_EXPRESS | Node Express |
| FASTAPI | FastAPI |
| DJANGO | Django |
| SPRING_BOOT | Spring Boot |
| GIN | Gin |
| RAILS | Rails |
| LARAVEL | Laravel |
| ACTIX | Actix |
| SWIFT_UI | SwiftUI |
| KOTLIN_JETPACK | Kotlin Jetpack |
| REACT_NATIVE | React Native |
| EXPO | Expo |
| FLUTTER | Flutter |
| DOTNET_MAUI | .NET MAUI |
| IONIC | Ionic |
| NATIVESCRIPT | NativeScript |
| OTHER | Other |

## Design Decisions

- **Required with "OTHER" default**: Field is always valid since it defaults to `"OTHER"`
- **Select pattern**: Same Radix Select pattern used in `CreateHackathonModal` for deadline hour/minute
- **Human-readable labels**: Display labels are user-friendly; backend receives the raw enum value
