# The Log Studio

The operating system for ideas. A brutalist digital garden that tracks the evolution of experiments from raw notes to shipped products.

**[escalay.space](https://escalay.space)**

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

## Stack

- Astro 5 (SSR) + React 19 islands + TypeScript
- Cloudflare Pages + D1 (SQLite) via `@astrojs/cloudflare`
- Drizzle ORM for schema, migrations, queries
- Tailwind CSS with brutalist design tokens
- Zod for API request validation

## Development

```bash
npm install
npm run dev                # Astro dev server with local D1
npm run build              # Production build
npm run db:generate        # Generate Drizzle migrations from schema changes
npm run db:migrate:local   # Apply migrations to local D1
npm run db:seed:local      # Seed local D1 with sample data
```

## License

MIT
