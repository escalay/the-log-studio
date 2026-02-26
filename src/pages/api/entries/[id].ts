import type { APIRoute } from 'astro'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { createDb } from '@/db'
import { entries, entryUpdates } from '../../../../drizzle/schema'

// GET /api/entries/:id
export const GET: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { id } = params

  const rows = await db.select().from(entries).where(eq(entries.id, id!))
  if (rows.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const updates = await db
    .select()
    .from(entryUpdates)
    .where(eq(entryUpdates.entryId, id!))

  return Response.json({
    ...rows[0],
    updates: updates.map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
  })
}

const UpdateEntrySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  level: z.number().int().min(0).max(3).optional(),
  type: z.enum(['note', 'experiment', 'project', 'thought', 'product']).optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  link: z.string().url().nullable().optional(),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .nullable()
    .optional(),
  slug: z.string().min(1).optional(),
})

// PUT /api/entries/:id
export const PUT: APIRoute = async ({ params, locals, request }) => {
  const db = createDb(locals.runtime.env.DB)
  const { id } = params

  const existing = await db.select().from(entries).where(eq(entries.id, id!))
  if (existing.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = UpdateEntrySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  const data = parsed.data

  if (data.title !== undefined) updates.title = data.title
  if (data.description !== undefined) updates.description = data.description
  if (data.level !== undefined) updates.level = data.level
  if (data.type !== undefined) updates.type = data.type
  if (data.date !== undefined) updates.date = data.date
  if (data.tags !== undefined) updates.tags = data.tags
  if (data.content !== undefined) updates.content = data.content
  if (data.link !== undefined) updates.link = data.link
  if (data.metrics !== undefined) updates.metrics = data.metrics
  if (data.slug !== undefined) updates.slug = data.slug

  await db.update(entries).set(updates).where(eq(entries.id, id!))

  const updated = await db.select().from(entries).where(eq(entries.id, id!))
  const entryUpdateRows = await db
    .select()
    .from(entryUpdates)
    .where(eq(entryUpdates.entryId, id!))

  return Response.json({
    ...updated[0],
    updates: entryUpdateRows.map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
  })
}

// DELETE /api/entries/:id
export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { id } = params

  const existing = await db.select().from(entries).where(eq(entries.id, id!))
  if (existing.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  await db.delete(entries).where(eq(entries.id, id!))
  return Response.json({ status: 'deleted' })
}
