# The Log Studio

The operating system for ideas. A brutalist digital garden that tracks the evolution of experiments from raw notes to shipped products.

## The Escalay Method

Every idea enters a 4-stage maturity pipeline. Nothing skips levels — each stage earns the next through measurable validation.

| Level | Stage | Investment | What It Proves |
|-------|-------|-----------|----------------|
| **L0** | Lab Note | 2–4 hours | The problem is real and worth solving |
| **L1** | Experiment | 10–20 hours | The solution works and people want it |
| **L2** | Project | 40–60 hours | Users rely on it and will pay for it |
| **L3** | Product | 100+ hours | It's a sustainable business |

The expected funnel: **100 notes → 30 experiments → 10 projects → 3 products → 1 significant success**. The system makes those 99 "failures" as cheap and educational as possible.

> *"Revenue is water. Code is overhead. Ship or die."*

Read the full methodology: [`docs/operating-manual.md`](docs/operating-manual.md)

## The Studio

The Log Studio is the visual interface for this pipeline — an editorial, brutalist web app where each maturity level gets its own visual treatment:

- **Lab Notes** — yellow sticky notes, handwritten fonts, coffee-stained paper
- **Experiments** — graph paper, status indicators, hypothesis/results format
- **Projects** — clean cards with git-style headers and changelog timelines
- **Products** — dark industrial cards with KPI dashboards

Also includes a block-based journal system ("The Register") and a dark-mode admin panel for managing entries.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS (CDN, inline config in `index.html`)
- Zod for runtime schema validation
- localStorage for persistence (no backend)

## Development

```bash
npm install
npm run dev       # localhost:3000
npm run build     # production build
npm run preview   # preview built output
```

Requires `GEMINI_API_KEY` in `.env.local`.

## Design Tokens

All defined inline in `index.html`:

- **Colors**: `paper` (cream), `ink` (#111), `accent` (International Orange #FF4F00), `level-0` through `level-3`
- **Fonts**: Inter, Instrument Serif, JetBrains Mono, Caveat, Gochi Hand, Nanum Pen Script
- **Shadows**: `hard` (4px 4px), `hard-sm`, `hard-xl` — no rounded corners, no soft shadows
- **Patterns**: dot-grid, lined-paper, graph-paper, hazard-stripes

## License

MIT
