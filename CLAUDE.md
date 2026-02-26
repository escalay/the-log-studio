# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server on port 3000
npm run build    # Production build
npm run preview  # Preview production build
```

No test framework, linter, or formatter is configured.

## What This Is

The Log Studio — a brutalist digital garden that visualizes the Escalay method: a 4-stage maturity pipeline for turning ideas into products. Full methodology documented in `docs/operating-manual.md`.

- **L0 (Lab Notes)** — Raw ideas, yellow sticky note aesthetic
- **L1 (Experiments)** — Active exploration with results
- **L2 (Projects)** — Validated concepts with users
- **L3 (Products)** — Shipped, revenue-generating work

Also includes a journal/blog system and a dark-mode admin panel for CRUD operations.

## Tech Stack

- Vite 6 + React 19 + TypeScript 5.8
- Tailwind CSS via CDN (config is inline in `index.html`, not a tailwind.config file)
- Zod for runtime schema validation
- localStorage for data persistence (no backend)
- Path alias: `@/*` maps to project root

## Architecture

### Data Flow

`data.ts` contains both seed data (`RAW_ENTRIES`) and a `DataManager` class that handles localStorage persistence. Components listen for cross-tab sync via a custom `storage-update` event on `window`.

`schema.ts` has Zod schemas that validate entries on load. `types.ts` has the TypeScript interfaces/enums.

### Component Switcher Pattern

Cards and modals dispatch to maturity-level-specific components:

- `EntryCardSwitcher` → `LabNoteCard`, `ExperimentCard`, `ProjectCard`, `ProductCard`
- `DetailModalSwitcher` → `LabNoteDetail`, `ExperimentDetail`, `ProjectDetail`, `ProductDetail`

Each variant has its own visual treatment (handwritten notes, graph paper, etc.).

### Views

`App.tsx` manages a `view` state with 4 values: `collection` (default grid), `system` (diagram), `journal` (blog), `admin` (hidden dark overlay).

### Key Directories

- `components/layout/` — Page shell: Navbar, Hero, Footer, FilterToolbar, SystemDiagram
- `components/cards/` — Grid card variants by maturity level
- `components/modals/` — Detail modal variants by maturity level
- `components/journal/` — Journal view with block-based content (markdown, component, image, pull-quote)
- `components/admin/` — Dark-themed admin panel with EntryEditor
- `components/ui/` — Shared pieces: MarkdownContent (simple line-based parser), HandwrittenEffects (coffee stains, tape, doodles)

## Design System

Tailwind is configured entirely in `index.html` via inline `tailwind.config`. Key tokens:

- **Colors**: `paper` (cream), `ink` (#111), `accent` (International Orange #FF4F00), `level-0` through `level-3`
- **Fonts**: `font-sans` (Inter), `font-serif` (Instrument Serif), `font-mono` (JetBrains Mono), `font-hand` (Caveat), `font-marker` (Gochi Hand), `font-pen` (Nanum Pen Script)
- **Shadows**: `shadow-hard` (4px 4px 0px), `shadow-hard-sm`, `shadow-hard-xl`
- **Backgrounds**: `bg-dot-grid`, `bg-lined-paper`, `bg-graph-paper`, `bg-hazard-stripes`

All styling is Tailwind-first in className attributes. Brutalist aesthetic: hard shadows, square corners, industrial orange, hard black borders.

## Environment

Requires `GEMINI_API_KEY` in `.env.local` — exposed to client via Vite's `define` as `process.env.GEMINI_API_KEY`.
