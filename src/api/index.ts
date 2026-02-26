import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from './context'
import { createDb } from '@/db'
import { entriesRouter } from './entries/router'
import { journalRouter } from './journal/router'
import { systemRouter } from './system/router'

export const createApiApp = (d1: D1Database, adminSecret: string | undefined) => {
  const app = new OpenAPIHono<Env>({ defaultHook: validationHook }).basePath('/api')

  app.onError((err, c) => {
    console.error('[API] Unexpected error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  })

  // Inject db + adminSecret into every request
  app.use('*', async (c, next) => {
    c.set('db', createDb(d1))
    c.set('adminSecret', adminSecret)
    return await next()
  })

  // Mount domain routers
  app.route('/', entriesRouter)
  app.route('/', journalRouter)
  app.route('/', systemRouter)

  // OpenAPI spec endpoint
  app.doc('/openapi.json', {
    openapi: '3.1.0',
    info: {
      title: 'The Log Studio API',
      version: __APP_VERSION__,
      description:
        'REST API for The Log Studio — a brutalist digital garden built on the Escalay method.\n\n' +
        '## Escalay Pipeline\n\n' +
        'Entries flow through a 4-stage maturity pipeline:\n\n' +
        '- **L0 Lab Notes** — Raw ideas, brain dumps, sticky notes\n' +
        '- **L1 Experiments** — Active exploration with hypothesis and results\n' +
        '- **L2 Projects** — Validated concepts with real users\n' +
        '- **L3 Products** — Shipped and revenue-generating\n\n' +
        '## Authentication\n\n' +
        'Read endpoints (GET) are public. Write endpoints (POST, PUT, DELETE) require authentication ' +
        'via the `x-admin-secret` header or an `admin_token` cookie. If no `ADMIN_SECRET` environment ' +
        'variable is configured, write endpoints are open (development mode).\n\n' +
        '## Data Model\n\n' +
        '- **Entries** have update logs (changelog timeline) and optional metrics\n' +
        '- **Journal posts** have ordered content blocks (markdown, components, images, pull-quotes)\n' +
        '- All data is stored in Cloudflare D1 (SQLite) via Drizzle ORM',
    },
    tags: [
      {
        name: 'Entries',
        description: 'CRUD for collection entries across all 4 Escalay maturity levels. Entries are the core data model — each represents an idea, experiment, project, or product with markdown content, tags, metrics, and a chronological update log.',
      },
      {
        name: 'Journal',
        description: 'CRUD for journal/blog posts. Posts use a block-based content model — each post is an ordered array of typed blocks (markdown, React components, images, pull-quotes).',
      },
      {
        name: 'System',
        description: 'Health checks and database management. The seed endpoint destructively resets and re-populates the database with sample data.',
      },
    ],
    security: [],
    servers: [
      { url: '/', description: 'Current environment' },
    ],
  })

  // Scalar docs UI (CDN, no npm package)
  app.get('/docs', (c) => {
    return c.html(`<!doctype html>
<html>
<head>
  <title>The Log Studio — API Docs</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>body { margin: 0; }</style>
</head>
<body>
  <script id="api-reference" data-url="/api/openapi.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`)
  })

  return app
}
