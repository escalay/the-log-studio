import type { APIRoute } from 'astro'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { createDb } from '@/db'
import { entries, entryUpdates } from '../../../../../drizzle/schema'

const AppendUpdateSchema = z.object({
  type: z.enum(['init', 'chore', 'feat', 'fix', 'release']),
  content: z.string().min(1),
  version: z.string().optional(),
  date: z.string().optional(),
})

// POST /api/entries/:id/updates
export const POST: APIRoute = async ({ params, locals, request }) => {
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

  const parsed = AppendUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const date = data.date ?? new Date().toISOString().split('T')[0]

  await db.insert(entryUpdates).values({
    entryId: id!,
    date,
    version: data.version ?? null,
    type: data.type,
    content: data.content,
  })

  // Update the entry's updatedAt timestamp
  await db
    .update(entries)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(entries.id, id!))

  const updates = await db
    .select()
    .from(entryUpdates)
    .where(eq(entryUpdates.entryId, id!))

  return Response.json(
    updates.map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
    { status: 201 },
  )
}

// GET /api/entries/:id/updates
export const GET: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { id } = params

  const existing = await db.select().from(entries).where(eq(entries.id, id!))
  if (existing.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const updates = await db
    .select()
    .from(entryUpdates)
    .where(eq(entryUpdates.entryId, id!))

  return Response.json(
    updates.map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
  )
}
