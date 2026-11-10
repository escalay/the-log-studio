import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from './context'
import { createDb } from '@/db'
import { entriesRouter } from './entries/router'
import { journalRouter } from './journal/router'
import { systemRouter } from './system/router'
import { fail } from './errors'

/** Weak ETag of a response body, so unchanged reads cost a 304 and writes are visible at once. */
const etagOf = async (body: string) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(body))
  return `W/"${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}"`
}

export const createApiApp = (d1: D1Database, adminSecret: string | undefined) => {
  const app = new OpenAPIHono<Env>({ defaultHook: validationHook }).basePath('/api')

  app.onError((err, c) => {
    console.error('[API] Unexpected error:', err)
    return fail(c, 500, 'internal', 'Internal server error')
  })

  app.notFound((c) => fail(c, 404, 'not_found', `No route ${c.req.method} ${c.req.path}. The routes are listed in /api/openapi.json.`))

  // Inject db + adminSecret into every request
  app.use('*', async (c, next) => {
    c.set('db', createDb(d1))
    c.set('adminSecret', adminSecret)
    return await next()
  })

  // Reads of entries and journal posts revalidate by ETag: never stale, cheap when unchanged
  app.use('*', async (c, next) => {
    await next()
    const cacheable = c.req.method === 'GET' && c.res.status === 200 && /\/api\/(entries|journal)(\/|$)/.test(c.req.path)
    if (!cacheable) return
    const etag = await etagOf(await c.res.clone().text())
    const headers = { ETag: etag, 'Cache-Control': 'public, max-age=0, must-revalidate' }
    if (c.req.header('if-none-match') === etag) {
      c.res = new Response(null, { status: 304, headers })
      return
    }
    for (const [name, value] of Object.entries(headers)) c.res.headers.set(name, value)
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
        'via the `x-admin-secret` header (the admin panel uses a session cookie). If no `ADMIN_SECRET` ' +
        'is configured, writes are refused with 503 everywhere except local development.\n\n' +
        '## Errors\n\n' +
        'Every error body has `error`, a stable `code` (`validation`, `unauthorized`, `forbidden`, `not_found`, ' +
        '`conflict`, `not_configured`, `internal`) and a `message`. Validation errors keep per-field detail in `error.fieldErrors`.\n\n' +
        '## Reading\n\n' +
        'An entry is addressed by its id or its slug. Lists take `q`, `sort`, `limit` and `fields=summary`. ' +
        'Reads carry an `ETag`: send `If-None-Match` to get a 304 when nothing changed. A plain-text guide is at `/llms.txt`.\n\n' +
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
