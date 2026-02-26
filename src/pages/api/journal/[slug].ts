import type { APIRoute } from 'astro'
import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
import { createDb } from '@/db'
import { journalEntries, journalBlocks } from '../../../../drizzle/schema'

// GET /api/journal/:slug
export const GET: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { slug } = params

  const rows = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.slug, slug!))

  if (rows.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const blocks = await db
    .select()
    .from(journalBlocks)
    .where(eq(journalBlocks.journalEntryId, rows[0].id))
    .orderBy(asc(journalBlocks.sortOrder))

  return Response.json({
    ...rows[0],
    blocks: blocks.map((b) => ({
      type: b.type,
      content: b.content,
      componentName: b.componentName,
    })),
  })
}

const UpdateJournalSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  quarter: z.string().optional(),
  readTime: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  blocks: z
    .array(
      z.object({
        type: z.enum(['markdown', 'component', 'image', 'pull-quote']),
        content: z.string(),
        componentName: z.string().optional(),
      }),
    )
    .optional(),
})

// PUT /api/journal/:slug
export const PUT: APIRoute = async ({ params, locals, request }) => {
  const db = createDb(locals.runtime.env.DB)
  const { slug } = params

  const existing = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.slug, slug!))

  if (existing.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = UpdateJournalSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const now = new Date().toISOString()
  const entry = existing[0]

  const updates: Record<string, unknown> = { updatedAt: now }
  if (data.title !== undefined) updates.title = data.title
  if (data.subtitle !== undefined) updates.subtitle = data.subtitle
  if (data.date !== undefined) updates.date = data.date
  if (data.quarter !== undefined) updates.quarter = data.quarter
  if (data.readTime !== undefined) updates.readTime = data.readTime
  if (data.coverImage !== undefined) updates.coverImage = data.coverImage

  await db
    .update(journalEntries)
    .set(updates)
    .where(eq(journalEntries.slug, slug!))

  // Replace blocks if provided
  if (data.blocks) {
    await db
      .delete(journalBlocks)
      .where(eq(journalBlocks.journalEntryId, entry.id))

    for (let i = 0; i < data.blocks.length; i++) {
      const block = data.blocks[i]
      await db.insert(journalBlocks).values({
        journalEntryId: entry.id,
        sortOrder: i,
        type: block.type,
        content: block.content,
        componentName: block.componentName ?? null,
      })
    }
  }

  return Response.json({ status: 'updated' })
}

// DELETE /api/journal/:slug
export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { slug } = params

  const existing = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.slug, slug!))

  if (existing.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  await db.delete(journalEntries).where(eq(journalEntries.slug, slug!))
  return Response.json({ status: 'deleted' })
}
