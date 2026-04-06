# QuizVerse Connector

Frontend for the QuizVerse quiz platform. This app talks to a Spring Boot backend over REST and provides quiz browsing, group management, quiz taking, and admin views.

You can visit Backend by <https://github.com/tomzxy03/webquiz.git>

## Highlights

- Vite + React + TypeScript
- Tailwind CSS with shadcn/ui and Radix UI primitives
- React Router + React Query for routing and data fetching
- Auth with access + refresh tokens, plus a guest token for anonymous flows
- Quiz-taking flow with timer, autosave, and offline retry queue
- Built-in Swagger UI viewer at `/api-docs`

## Project structure

- `src/core/` – API client, endpoints, shared constants and base types
- `src/domains/` – Domain models, DTOs, and mappers
- `src/repositories/` – Data access layer (API calls + mapping)
- `src/services/` – Application logic on top of repositories
- `src/contexts/` – Auth and quiz attempt state
- `src/hooks/` – Reusable hooks (quiz timer, autosave, group tab prefetch, etc.)
- `src/pages/` – Route-level pages
- `src/components/` – Reusable UI and feature components

## Setup

1. Copy `.env.example` to `.env.local` and update values as needed.
2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Environment variables

- `VITE_API_BASE_URL` – Backend base URL used by the API client. Defaults to `http://localhost:8080/api`.
- `VITE_ENV` – Environment label (used for client-side checks only).
- `VITE_DEBUG` – Optional debug flag (string `true`/`false`).

## Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run build:dev` – Development-mode build
- `npm run preview` – Preview production build
- `npm run lint` – Lint the codebase

## API docs

- Route: `/api-docs`
- Primary source: `http://localhost:8080/v3/api-docs` (backend must be running)
- Fallback: `public/api1.json`

There is also an OpenAPI snapshot at `api.json` in the repo root.
