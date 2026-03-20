# QuizVerse Connector

Frontend for the QuizVerse quiz platform. Connects to a Spring Boot backend via REST API.

## What’s inside

- Vite + React + TypeScript app
- Tailwind + shadcn/ui + Radix UI components
- React Query for group tabs (prefetch + cache)
- Quiz taking flow with autosave, offline retry, and countdown sync

## Project structure

The project uses a layered structure:

- `src/core/` – API client, endpoints, shared types (enums, pagination, API DTOs)
- `src/domains/` – Domain types and DTOs (quiz, group, user, exam, subject)
- `src/repositories/` – Data access (calls `core/api`, maps to domain)
- `src/services/` – Application logic (uses repositories, consumed by UI)
- `src/pages/` – Route-level pages
- `src/components/` – `layout/`, `ui/`, `quiz/`, `group/`, `shared/`
- `src/hooks/`, `src/lib/` – Shared hooks and utilities

## Setup

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL`.
2. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run build:dev` – Development-mode build
- `npm run preview` – Preview production build
- `npm run lint` – Lint

## Documentation

- `docs/README.md` – Documentation index (React Query migration)
- `docs/REACT_QUERY_QUICK_REFERENCE.md` – Quick usage guide for hooks
- `docs/REACT_QUERY_ARCHITECTURE.md` – React Query architecture and data flow
- `docs/QUICK_START.md` – Quiz taking page quick start
- `docs/QUIZ_TAKING_DESIGN.md` – Quiz taking architecture & UX behavior
