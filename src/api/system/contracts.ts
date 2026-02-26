import { createRoute } from '@hono/zod-openapi'
import { HealthResponseSchema, SeedResponseSchema, ErrorSchema } from './schemas'

const tags = ['System']

export const health = createRoute({
  method: 'get',
  path: '/health',
  tags,
  summary: 'Health check',
  description:
    'Returns the API health status and application version. Performs a `SELECT 1` query against D1 ' +
    'to verify database connectivity. Returns 200 with `"status": "ok"` if healthy, or 500 with ' +
    '`"status": "error"` and a message if the database is unreachable.',
  responses: {
    200: {
      description: 'API is healthy and database is reachable.',
      content: { 'application/json': { schema: HealthResponseSchema } },
    },
    500: {
      description: 'Database connection failed. The API is running but cannot reach D1.',
      content: { 'application/json': { schema: HealthResponseSchema } },
    },
  },
})

export const seed = createRoute({
  method: 'post',
  path: '/seed',
  tags,
  summary: 'Reset and seed the database',
  description:
    'Destructively clears all data (journal blocks, journal entries, entry updates, entries) and re-inserts ' +
    'the built-in seed dataset. This includes 9 sample entries across all 4 maturity levels and 2 journal posts ' +
    'with block content. Intended for development and demo environments only. **This action cannot be undone.**',
  security: [{ adminSecret: [] }],
  responses: {
    200: {
      description: 'Database reset and seeded successfully. Returns counts of seeded records.',
      content: { 'application/json': { schema: SeedResponseSchema } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    500: {
      description: 'Seed operation failed mid-way. Database may be in an inconsistent state.',
      content: { 'application/json': { schema: SeedResponseSchema } },
    },
  },
})
