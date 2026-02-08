# QuizVerse Connector

Frontend for the QuizVerse quiz platform. Connects to a Spring Boot backend via REST API.

## Code structure

The project uses a **layered structure**:

- **`src/core/`** – API client, endpoints, shared types (enums, pagination, API DTOs).
- **`src/domains/`** – Domain types and DTOs (quiz, group, user, exam, subject).
- **`src/repositories/`** – Data access (calls `core/api`, maps to domain).
- **`src/services/`** – Application logic (uses repositories, consumed by UI).
- **`src/pages/`** – Route-level pages.
- **`src/components/`** – `layout/`, `ui/`, `quiz/`, `group/`, `shared/`.
- **`src/hooks/`**, **`src/lib/`** – Shared hooks and utilities.

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for layer rules and import conventions.

## Setup

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to your backend (default `http://localhost:8080/api`).
2. `npm install` then `npm run dev`.

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – Lint
