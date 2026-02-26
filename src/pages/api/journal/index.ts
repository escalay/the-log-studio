import type { APIRoute } from 'astro'
import { z } from 'zod'
import { createDb } from '@/db'
import { journalEntries, journalBlocks } from '../../../../drizzle/schema'

// GET /api/journal
export const GET: APIRoute = async ({ locals }) => {
  const db = createDb(locals.runtime.env.DB)

  const rows = await db.select().from(journalEntries)

  return Response.json(
    rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      date: row.date,
      quarter: row.quarter,
      readTime: row.readTime,
      coverImage: row.coverImage,
    })),
  )
}

const CreateJournalSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  date: z.string().min(1),
  quarter: z.string().min(1),
  readTime: z.string().min(1),
  coverImage: z.string().optional(),
  blocks: z.array(
    z.object({
      type: z.enum(['markdown', 'component', 'image', 'pull-quote']),
      content: z.string(),
      componentName: z.string().optional(),
    }),
  ),
})

// POST /api/journal
export const POST: APIRoute = async ({ locals, request }) => {
  const db = createDb(locals.runtime.env.DB)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CreateJournalSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const now = new Date().toISOString()
  const id = data.id ?? `j-${Date.now().toString(36)}`

  try {
    await db.insert(journalEntries).values({
      id,
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      quarter: data.quarter,
      readTime: data.readTime,
      coverImage: data.coverImage ?? null,
      createdAt: now,
      updatedAt: now,
    })

    for (let i = 0; i < data.blocks.length; i++) {
      const block = data.blocks[i]
      await db.insert(journalBlocks).values({
        journalEntryId: id,
        sortOrder: i,
        type: block.type,
        content: block.content,
        componentName: block.componentName ?? null,
      })
    }

    return Response.json({ id, slug: data.slug }, { status: 201 })
  } catch (error) {
    console.error('[API] journal POST:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
