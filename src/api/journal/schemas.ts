import { z } from '@hono/zod-openapi'

// -- Params --

export const JournalSlugParamSchema = z.object({
  slug: z.string().openapi({
    description: 'URL-safe slug identifying the journal post',
    example: 'year-in-review-2024',
  }),
})

// -- Shared pieces --

const JournalBlockSchema = z
  .object({
    type: z.enum(['markdown', 'component', 'image', 'pull-quote']).openapi({
      description: 'Block type — markdown: rendered MD, component: React island (needs componentName), image: URL string, pull-quote: styled blockquote',
      example: 'markdown',
    }),
    content: z.string().openapi({
      description: 'Block content. For markdown: raw MD string. For component: JSON-serialized props. For image: URL. For pull-quote: quote text.',
      example: '# Hello\n\nSome markdown content.',
    }),
    componentName: z.string().optional().openapi({
      description: 'React component name to render (only used when type is "component"). Must match a registered component.',
      example: 'BarChart',
    }),
  })
  .openapi('JournalBlock')

// -- Request bodies --

export const CreateJournalSchema = z
  .object({
    id: z.string().optional().openapi({
      description: 'Custom ID. If omitted, auto-generated as `j-{Date.now().toString(36)}`',
      example: 'j-01',
    }),
    slug: z.string().min(1).openapi({
      description: 'URL-safe slug, must be unique across all journal posts. Used in /journal/{slug} URLs.',
      example: 'my-first-post',
    }),
    title: z.string().min(1).openapi({
      description: 'Post title displayed as the main heading',
      example: 'The Great Reset',
    }),
    subtitle: z.string().min(1).openapi({
      description: 'Subtitle displayed below the title, acts as a teaser',
      example: 'Why I killed 90% of my side projects to focus on one system.',
    }),
    date: z.string().min(1).openapi({
      description: 'Human-readable publication date (free-form string, not ISO)',
      example: 'Jan 10, 2025',
    }),
    quarter: z.string().min(1).openapi({
      description: 'Quarter label for grouping (e.g. Q1 2025)',
      example: 'Q1 2025',
    }),
    readTime: z.string().min(1).openapi({
      description: 'Estimated read time label',
      example: '8 min read',
    }),
    coverImage: z.string().optional().openapi({
      description: 'Cover image URL or CSS gradient string. Used as the post header background.',
      example: 'linear-gradient(135deg, #FF4F00 0%, #111 100%)',
    }),
    blocks: z.array(JournalBlockSchema).openapi({
      description: 'Ordered array of content blocks. Rendered top-to-bottom in the post.',
    }),
  })
  .openapi('CreateJournal')

export const UpdateJournalSchema = z
  .object({
    title: z.string().min(1).optional().openapi({ description: 'New title', example: 'Updated Title' }),
    subtitle: z.string().optional().openapi({ description: 'New subtitle', example: 'A new subtitle.' }),
    date: z.string().optional().openapi({ description: 'New display date', example: 'Feb 26, 2026' }),
    quarter: z.string().optional().openapi({ description: 'New quarter label', example: 'Q1 2026' }),
    readTime: z.string().optional().openapi({ description: 'New read time', example: '5 min read' }),
    coverImage: z.string().nullable().optional().openapi({
      description: 'New cover image. Set to null to remove.',
      example: null,
    }),
    blocks: z.array(JournalBlockSchema).optional().openapi({
      description: 'If provided, completely replaces all existing blocks. Omit to leave blocks unchanged.',
    }),
  })
  .openapi('UpdateJournal')

// -- Responses --

export const JournalSummarySchema = z
  .object({
    id: z.string().openapi({ example: 'j-01' }),
    slug: z.string().openapi({ example: 'year-in-review-2024' }),
    title: z.string().openapi({ example: 'The Great Reset' }),
    subtitle: z.string().openapi({ example: 'Why I killed 90% of my side projects.' }),
    date: z.string().openapi({ example: 'Jan 10, 2025' }),
    quarter: z.string().openapi({ example: 'Q1 2025' }),
    readTime: z.string().openapi({ example: '8 min read' }),
    coverImage: z.string().nullable().openapi({ example: 'linear-gradient(135deg, #FF4F00 0%, #111 100%)' }),
  })
  .openapi('JournalSummary')

export const JournalDetailSchema = z
  .object({
    id: z.string().openapi({ example: 'j-01' }),
    slug: z.string().openapi({ example: 'year-in-review-2024' }),
    title: z.string().openapi({ example: 'The Great Reset' }),
    subtitle: z.string().openapi({ example: 'Why I killed 90% of my side projects.' }),
    date: z.string().openapi({ example: 'Jan 10, 2025' }),
    quarter: z.string().openapi({ example: 'Q1 2025' }),
    readTime: z.string().openapi({ example: '8 min read' }),
    coverImage: z.string().nullable().openapi({ example: 'linear-gradient(135deg, #FF4F00 0%, #111 100%)' }),
    createdAt: z.string().openapi({ description: 'ISO 8601 creation timestamp', example: '2025-01-10T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ description: 'ISO 8601 last-modified timestamp', example: '2025-01-10T12:00:00.000Z' }),
    blocks: z.array(JournalBlockSchema).openapi({ description: 'Content blocks sorted by display order' }),
  })
  .openapi('JournalDetail')

export const JournalCreatedSchema = z
  .object({
    id: z.string().openapi({ description: 'Generated or provided ID', example: 'j-mm3abc' }),
    slug: z.string().openapi({ description: 'The slug for the created post', example: 'my-first-post' }),
  })
  .openapi('JournalCreated')

export const ErrorSchema = z
  .object({
    error: z.union([
      z.string().openapi({ example: 'Not found' }),
      z.object({
        fieldErrors: z.record(z.array(z.string())).optional(),
        formErrors: z.array(z.string()).optional(),
      }),
    ]),
  })
  .openapi('JournalError')
