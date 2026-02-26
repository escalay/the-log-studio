import { z } from '@hono/zod-openapi'

export const HealthResponseSchema = z
  .object({
    status: z.enum(['ok', 'error']).openapi({
      description: '"ok" if the database is reachable, "error" otherwise',
      example: 'ok',
    }),
    version: z.string().openapi({
      description: 'Application version from package.json, injected at build time',
      example: '1.2.1',
    }),
    message: z.string().optional().openapi({
      description: 'Error details when status is "error"',
      example: 'Database connection failed',
    }),
  })
  .openapi('HealthResponse')

export const SeedResponseSchema = z
  .object({
    status: z.enum(['ok', 'error']).openapi({
      description: '"ok" if seeding completed, "error" if it failed',
      example: 'ok',
    }),
    entries: z.number().optional().openapi({
      description: 'Number of entries seeded (only present on success)',
      example: 9,
    }),
    journal: z.number().optional().openapi({
      description: 'Number of journal posts seeded (only present on success)',
      example: 2,
    }),
    message: z.string().optional().openapi({
      description: 'Error message (only present on failure)',
      example: 'Internal server error',
    }),
  })
  .openapi('SeedResponse')

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: 'Unauthorized' }),
  })
  .openapi('SystemError')
