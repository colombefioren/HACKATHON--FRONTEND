# Evalio

A modern hackathon project evaluation platform built with Next.js, featuring AI-powered project analysis and semantic search capabilities.

## Tech Stack

### Core Framework
- **Next.js** `16.2.4` - React framework with App Router
- **React** `19.2.4` - UI library
- **React DOM** `19.2.4` - DOM rendering

### Styling & UI
- **Tailwind CSS** `^4` - Utility-first CSS framework
- **@tailwindcss/postcss** `^4` - PostCSS plugin for Tailwind v4
- **tw-animate-css** `^1.3.4` - Tailwind animation utilities
- **class-variance-authority** `^0.7.1` - Component variant management
- **clsx** `^2.1.1` - Conditional className utility
- **tailwind-merge** `^3.5.0` - Merge Tailwind classes

### Radix UI Components
- **@radix-ui/react-dialog** `^1.1.15` - Modal dialogs
- **@radix-ui/react-dropdown-menu** `^2.1.16` - Dropdown menus
- **@radix-ui/react-select** `^2.2.6` - Select components
- **@radix-ui/react-tabs** `^1.1.13` - Tab navigation
- **@radix-ui/react-popover** `^1.1.15` - Popover components
- **@radix-ui/react-tooltip** `^1.2.8` - Tooltips
- **@radix-ui/react-accordion** `^1.2.12` - Accordion sections
- **@radix-ui/react-alert-dialog** `^1.1.15` - Alert modals
- **@radix-ui/react-avatar** `^1.1.11` - Avatar components
- **@radix-ui/react-checkbox** `^1.3.3` - Checkbox inputs
- **@radix-ui/react-collapsible** `^1.1.12` - Collapsible sections
- **@radix-ui/react-context-menu** `^2.2.16` - Context menus
- **@radix-ui/react-hover-card** `^1.1.15` - Hover cards
- **@radix-ui/react-label** `^2.1.8` - Form labels
- **@radix-ui/react-menubar** `^1.1.16` - Menu bars
- **@radix-ui/react-navigation-menu** `^1.2.14` - Navigation menus
- **@radix-ui/react-progress** `^1.1.8` - Progress bars
- **@radix-ui/react-radio-group** `^1.3.8` - Radio groups
- **@radix-ui/react-scroll-area** `^1.2.10` - Custom scrollbars
- **@radix-ui/react-separator** `^1.1.8` - Visual separators
- **@radix-ui/react-slider** `^1.3.6` - Slider inputs
- **@radix-ui/react-slot** `^1.2.4` - Slot components
- **@radix-ui/react-switch** `^1.2.6` - Toggle switches
- **@radix-ui/react-toggle** `^1.1.10` - Toggle buttons
- **@radix-ui/react-toggle-group** `^1.1.11` - Toggle groups
- **@radix-ui/react-aspect-ratio** `^1.1.8` - Aspect ratio boxes

### State Management & Data Fetching
- **@tanstack/react-query** `^5.83.0` - Data fetching and caching

### Form Handling & Validation
- **react-hook-form** `^7.71.2` - Form state management
- **zod** `^3.24.2` - Schema validation
- **@radix-ui/react-form** (via other components) - Form primitives

### Additional UI Components
- **lucide-react** `^0.575.0` - Icon library
- **sonner** `^2.0.7` - Toast notifications
- **cmdk** `^1.1.1` - Command palette
- **date-fns** `^4.1.0` - Date utility library
- **react-day-picker** `^9.14.0` - Date picker component
- **embla-carousel-react** `^8.6.0` - Carousel component
- **input-otp** `^1.4.2` - OTP input component
- **react-resizable-panels** `^4.6.5` - Resizable panels
- **recharts** `^2.15.4` - Charting library
- **vaul** `^1.1.2` - Drawer component

### Development Tools
- **TypeScript** `^5` - Type-safe JavaScript
- **ESLint** `^9` - Code linting
- **eslint-config-next** `16.2.4` - Next.js ESLint config
- **@types/node** `^20` - Node.js type definitions
- **@types/react** `^19` - React type definitions
- **@types/react-dom** `^19` - React DOM type definitions

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HACKATHON--FRONTEND

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://192.168.2.167:8000/api
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Production Start

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

### Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard (list hackathons)
│   ├── hackathon/[id]/    # Hackathon detail (list projects)
│   ├── project/[id]/      # Project detail
│   ├── search/page.tsx    # Semantic search
│   └── setup/page.tsx     # Create hackathon
├── lib/                   # Utilities and API client
│   ├── api.ts            # API client + types
│   ├── constants.ts       # Config (API base URL, colors)
│   ├── utils.ts          # Utilities (extractScore, cn)
│   └── hooks/            # TanStack Query hooks
└── components/            # Reusable components
    ├── ui/               # Radix UI primitives
    ├── ProjectCard.tsx    # Project display
    ├── HackathonCard.tsx  # Hackathon display
    ├── Topbar.tsx         # Navigation
    └── PageTransition.tsx # Route animations
```

## Design System (Neo-brutalism)

- **Colors**: `--brand-ink` (#111), `--brand-mustard` (#E3A018), `--brand-coral` (#FF6B6B), `--brand-mint` (#7FBC8C), `--brand-sky` (#69D2E7)
- **Borders**: 2.5px solid black
- **Shadows**: Offset hard shadows (e.g., `4px 4px 0 var(--brand-ink)`)
- **Radius**: `--radius-md: 3px`

## API Endpoints

The application connects to a backend API with the following endpoints:

- `GET /get-all-hackathons` - List all hackathons
- `GET /get-hackathon/{id}` - Get hackathon details
- `GET /get-hackathon-projects/{id}` - Get projects for a hackathon
- `POST /create-hackathon` - Create a new hackathon
- `POST /create-project` - Submit a project
- `POST /review` - Approve/reject a project

API Base URL: `http://192.168.2.167:8000/api` (configurable via `NEXT_PUBLIC_API_URL`)

## Features

- 📊 **Hackathon Management** - Create and manage hackathon events
- 🎯 **Project Evaluation** - AI-powered project analysis and scoring
- 🔍 **Semantic Search** - Search across all projects and hackathons
- 📈 **Real-time Updates** - Polling-based status updates (5000ms interval)
- 🎨 **Neo-brutalism Design** - Bold, distinctive visual style
- 📱 **Responsive** - Works on desktop and mobile devices

## License

MIT
