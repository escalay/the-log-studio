import { z } from '@hono/zod-openapi'

// -- Params --

export const EntryIdParamSchema = z.object({
  id: z.string().openapi({
    description: 'Entry ID — format is `{type_prefix}-{base36_timestamp}`, e.g. `note-mm3abc`',
    example: 'note-01',
  }),
})

// -- Query --

export const EntryQuerySchema = z.object({
  level: z.coerce.number().int().min(0).max(3).optional().openapi({
    description: 'Filter by Escalay maturity level: 0 = Lab Note, 1 = Experiment, 2 = Project, 3 = Product',
    example: 0,
  }),
  tag: z.string().optional().openapi({
    description: 'Filter by tag (exact match, case-sensitive). Tags are stored as a JSON array on each entry.',
    example: 'devtools',
  }),
})

// -- Shared pieces --

const MetricSchema = z
  .object({
    label: z.string().openapi({ description: 'Metric display name', example: 'MRR' }),
    value: z.string().openapi({ description: 'Metric value (always a string for display flexibility)', example: '$15' }),
  })
  .openapi('Metric')

const UpdateLogSchema = z
  .object({
    date: z.string().openapi({ description: 'Date of the update (YYYY-MM-DD)', example: '2025-01-15' }),
    version: z.string().nullable().optional().openapi({ description: 'Semver version tag, if applicable', example: 'v1.0.0' }),
    type: z.enum(['init', 'chore', 'feat', 'fix', 'release']).openapi({
      description: 'Update category — init: first commit, chore: maintenance, feat: new capability, fix: bug fix, release: version milestone',
      example: 'feat',
    }),
    content: z.string().openapi({ description: 'Human-readable description of what changed', example: 'Added dark mode support.' }),
  })
  .openapi('UpdateLog')

// -- Request bodies --

export const CreateEntrySchema = z
  .object({
    id: z.string().optional().openapi({
      description: 'Custom ID. If omitted, auto-generated as `{type.slice(0,4)}-{Date.now().toString(36)}`',
      example: 'note-01',
    }),
    slug: z.string().min(1).openapi({
      description: 'URL-safe slug, must be unique across all entries',
      example: 'my-new-idea',
    }),
    title: z.string().min(1).openapi({
      description: 'Display title shown on cards and detail views',
      example: 'My New Idea',
    }),
    description: z.string().default('').openapi({
      description: 'Short summary shown below the title on cards',
      example: 'A brief description of the idea.',
    }),
    level: z.number().int().min(0).max(3).openapi({
      description: 'Escalay maturity level: 0 = Lab Note, 1 = Experiment, 2 = Project, 3 = Product',
      example: 0,
    }),
    type: z.enum(['note', 'experiment', 'project', 'thought', 'product']).openapi({
      description: 'Content type — determines the card visual treatment. Usually matches the level name.',
      example: 'note',
    }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).openapi({
      description: 'Creation date in ISO format (YYYY-MM-DD)',
      example: '2025-01-15',
    }),
    tags: z.array(z.string()).default([]).openapi({
      description: 'Freeform tags for filtering and categorization',
      example: ['meta', 'system'],
    }),
    content: z.string().default('').openapi({
      description: 'Full markdown body of the entry',
      example: '# My idea\n\nSome markdown content describing the idea.',
    }),
    link: z.string().url().optional().openapi({
      description: 'External URL (GitHub repo, live demo, etc.)',
      example: 'https://github.com/example/project',
    }),
    metrics: z.array(MetricSchema).optional().openapi({
      description: 'Key-value metrics displayed on Project and Product cards (e.g. MRR, users, stars)',
      example: [{ label: 'Active Users', value: '118' }],
    }),
    updates: z.array(z.object({
      date: z.string().openapi({ description: 'Update date (YYYY-MM-DD)', example: '2025-01-15' }),
      version: z.string().optional().openapi({ description: 'Optional version tag', example: 'v0.1.0' }),
      type: z.enum(['init', 'chore', 'feat', 'fix', 'release']).openapi({ example: 'init' }),
      content: z.string().min(1).openapi({ example: 'Initial brain dump.' }),
    })).optional().openapi({
      description: 'Initial update log entries to create alongside the entry',
    }),
  })
  .openapi('CreateEntry')

export const UpdateEntrySchema = z
  .object({
    title: z.string().min(1).optional().openapi({ description: 'New title', example: 'Updated Title' }),
    description: z.string().optional().openapi({ description: 'New description', example: 'Updated description.' }),
    level: z.number().int().min(0).max(3).optional().openapi({
      description: 'New maturity level (prefer POST /entries/{id}/promote for level changes — it auto-logs the transition)',
      example: 1,
    }),
    type: z.enum(['note', 'experiment', 'project', 'thought', 'product']).optional().openapi({
      description: 'New content type',
      example: 'experiment',
    }),
    date: z.string().optional().openapi({ description: 'New date (YYYY-MM-DD)', example: '2025-02-01' }),
    tags: z.array(z.string()).optional().openapi({ description: 'Replace all tags', example: ['react', 'frontend'] }),
    content: z.string().optional().openapi({ description: 'New markdown body', example: '# Updated content' }),
    link: z.string().url().nullable().optional().openapi({
      description: 'New external URL. Set to null to remove.',
      example: 'https://github.com/example/updated',
    }),
    metrics: z.array(MetricSchema).nullable().optional().openapi({
      description: 'Replace all metrics. Set to null to remove.',
      example: [{ label: 'MRR', value: '$50' }],
    }),
    slug: z.string().min(1).optional().openapi({ description: 'New slug (must remain unique)', example: 'updated-slug' }),
  })
  .openapi('UpdateEntry')

export const AppendUpdateSchema = z
  .object({
    type: z.enum(['init', 'chore', 'feat', 'fix', 'release']).openapi({
      description: 'Update category: init, chore, feat, fix, or release',
      example: 'feat',
    }),
    content: z.string().min(1).openapi({
      description: 'What changed — shown in the entry timeline',
      example: 'Added dark mode support.',
    }),
    version: z.string().optional().openapi({
      description: 'Semver version tag (typically used with release type)',
      example: 'v1.2.0',
    }),
    date: z.string().optional().openapi({
      description: 'Override date (YYYY-MM-DD). Defaults to today if omitted.',
      example: '2025-02-01',
    }),
  })
  .openapi('AppendUpdate')

export const PromoteSchema = z
  .object({
    level: z.number().int().min(0).max(3).openapi({
      description: 'Target maturity level. The entry type is auto-updated to match (0=note, 1=experiment, 2=project, 3=product). A release update log is auto-appended describing the transition.',
      example: 2,
    }),
  })
  .openapi('PromoteEntry')

// -- Responses --

export const EntryResponseSchema = z
  .object({
    id: z.string().openapi({ description: 'Unique entry ID', example: 'note-01' }),
    slug: z.string().openapi({ description: 'URL-safe slug', example: 'escalay-philosophy' }),
    title: z.string().openapi({ example: 'The Escalay Operating Manual' }),
    description: z.string().openapi({ example: 'A complete guide to building and shipping.' }),
    level: z.number().openapi({ description: 'Maturity level (0-3)', example: 0 }),
    type: z.string().openapi({ description: 'Content type', example: 'note' }),
    date: z.string().openapi({ description: 'Creation date', example: '2025-01-15' }),
    tags: z.array(z.string()).openapi({ example: ['meta', 'system'] }),
    content: z.string().openapi({ description: 'Markdown body', example: '# Philosophy\n...' }),
    link: z.string().nullable().openapi({ description: 'External URL or null', example: null }),
    metrics: z.array(MetricSchema).nullable().openapi({ description: 'Key-value metrics or null', example: null }),
    createdAt: z.string().openapi({ description: 'ISO 8601 creation timestamp', example: '2025-01-15T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ description: 'ISO 8601 last-modified timestamp', example: '2025-01-16T12:00:00.000Z' }),
    updates: z.array(UpdateLogSchema).openapi({ description: 'Chronological update log' }),
  })
  .openapi('Entry')

export const UpdateLogResponseSchema = z.array(UpdateLogSchema).openapi('UpdateLogList')

export const ErrorSchema = z
  .object({
    error: z.union([
      z.string().openapi({ description: 'Simple error message', example: 'Not found' }),
      z.object({
        fieldErrors: z.record(z.array(z.string())).optional().openapi({
          description: 'Per-field validation errors',
          example: { title: ['Required'], level: ['Expected number, received string'] },
        }),
        formErrors: z.array(z.string()).optional().openapi({
          description: 'Form-level validation errors',
          example: [],
        }),
      }),
    ]).openapi({ description: 'Error string or structured validation error' }),
  })
  .openapi('Error')
