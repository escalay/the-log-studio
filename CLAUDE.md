# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Astro dev server with local D1
npm run build            # Production build
npm run preview          # Preview production build
npm run db:generate      # Generate Drizzle migrations from schema changes
npm run db:migrate:local # Apply migrations to local D1
npm run db:seed:local    # Seed local D1 with initial data via API
```

No test framework, linter, or formatter is configured.

## What This Is

The Log Studio — an API-first brutalist digital garden built on the Escalay method: a 4-stage maturity pipeline for turning ideas into products. Full methodology documented in `docs/operating-manual.md`.

- **L0 (Lab Notes)** — Raw ideas, yellow sticky note aesthetic
- **L1 (Experiments)** — Active exploration with results
- **L2 (Projects)** — Validated concepts with users
- **L3 (Products)** — Shipped, revenue-generating work

Also includes a journal/blog system and a dark-mode admin panel with markdown editor.

## Tech Stack

- Astro 5 (SSR, `output: 'server'`) + React 19 islands + TypeScript
- Cloudflare Pages + D1 (SQLite) via `@astrojs/cloudflare`
- Drizzle ORM for schema, migrations, queries
- Tailwind CSS via `tailwind.config.ts`
- Zod for API request validation
- Lucide React for icons
- Path alias: `@/*` maps to `./src/*`

## Architecture

### Data Flow

All data lives in Cloudflare D1. Components fetch from REST API endpoints (`/api/entries`, `/api/journal`). No localStorage, no client-side data management.

- `drizzle/schema.ts` — Table definitions (entries, entry_updates, journal_entries, journal_blocks)
- `src/db.ts` — `createDb(d1)` returns a Drizzle instance
- `src/types.ts` — TypeScript interfaces (Entry, JournalEntry, etc.)

### API Endpoints (`src/pages/api/`)

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/entries` | GET, POST | List entries (`level`, `tag`, `q`, `sort`, `limit`, `fields=summary`), create entry |
| `/api/entries/[id]` | GET, PUT, DELETE | Single entry CRUD; `[id]` is the id or the slug everywhere |
| `/api/entries/[id]/updates` | GET, POST | List/append update logs |
| `/api/entries/[id]/promote` | POST | Change maturity level |
| `/api/journal` | GET, POST | List/create journal posts |
| `/api/journal/[slug]` | GET, PUT, DELETE | Single journal post CRUD |
| `/api/health` | GET | DB connectivity check |
| `/api/seed` | POST | Reset + seed database (refused outside local dev unless the database is empty) |

API rules (`src/api/`):

- Every error goes through `fail()` in `errors.ts`: `{ error, code, message }`. `error` stays for older clients; branch on `code`.
- Writes need the `x-admin-secret` header or the admin session cookie (`auth.ts`). With no `ADMIN_SECRET`, writes are refused (503) everywhere except `astro dev`.
- GETs of entries and journal carry a weak `ETag` and `Cache-Control: max-age=0, must-revalidate` (`index.ts`): a write is visible on the next read, an unchanged read is a 304. Do not add `max-age`.
- The API client used for content (`escalay-log` skill) reads `error`, `fieldErrors` and status codes: keep them.

### Page Routing

- `/` — Collection grid (React island: `CollectionApp`); an old `/?entry=<id>` link redirects to the entry's page
- `/entries/[slug]` — The same grid with that entry open, server-rendered with its own title, description and share image. Opening and closing a card moves between `/` and `/entries/<slug>` with `pushState`
- `/rss.xml`, `/sitemap-entries.xml`, `/llms.txt` — Feed, the sitemap of database-backed pages, and the plain-text API guide
- `/system` — System diagram (static Astro)
- `/journal` — Journal index (SSR from D1)
- `/journal/[slug]` — Journal post (SSR from D1)
- `/admin` — Admin panel (React island: `AdminApp`, client:only). `src/middleware.ts` shows a sign-in form until `POST /admin/login` sets the session cookie (a digest of the secret, `Path=/` so the panel's API calls carry it)

### Component Switcher Pattern

Cards and modals dispatch to maturity-level-specific components:

- `EntryCardSwitcher` → `LabNoteCard`, `ExperimentCard`, `ProjectCard`, `ProductCard`
- `DetailModalSwitcher` → `LabNoteDetail`, `ExperimentDetail`, `ProjectDetail`, `ProductDetail`

Each variant has its own visual treatment (handwritten notes, graph paper, etc.).

### Key Directories

- `src/layout/` — Navbar.astro, Hero.astro, SystemDiagram.astro, Footer.tsx
- `src/collection/` — Collection grid with cards/, modals/, filter toolbar
- `src/journal/` — Journal page components + custom block renderers
- `src/admin/` — Dark-themed admin with MarkdownEditor, EntryEditor, EntryList
- `src/ui/` — Shared: MarkdownContent, HandwrittenEffects, Icons, VisualAssets

## Design System

Tailwind configured in `tailwind.config.ts`. Key tokens:

- **Colors**: `paper` (cream), `ink` (#111), `accent` (International Orange #FF4F00), `level-0` through `level-3`
- **Fonts**: `font-sans` (Space Grotesk), `font-serif` (ZT Bros Oskon 90s, self-hosted), `font-mono` (IBM Plex Mono), `font-hand` (Caveat), `font-marker` (Gochi Hand), `font-pen` (Nanum Pen Script)
- **Shadows**: `shadow-hard` (4px 4px 0px), `shadow-hard-sm`, `shadow-hard-xl`
- **Backgrounds**: `bg-dot-grid`, `bg-lined-paper`, `bg-graph-paper`, `bg-hazard-stripes`

All styling is Tailwind-first in className attributes. Brutalist aesthetic: hard shadows, square corners, industrial orange, hard black borders.

## Share images

`src/og/generate.ts` renders them with satori, which reads TTF, OTF and WOFF but **not WOFF2**: the serif is loaded from `public/fonts/ZTBrosOskon90s-Bold.woff`. `astro dev` cannot run the WASM renderer (500 locally is expected); the deploy smoke test checks `/og/default.png`.

## Database

D1 via Drizzle ORM. Schema in `drizzle/schema.ts`, migrations in `drizzle/migrations/`. Seed data in `drizzle/seed.ts`.

The `wrangler.jsonc` has the D1 binding named `DB`. Access via `Astro.locals.runtime.env.DB` in Astro pages, or `locals.runtime.env.DB` in API routes.
