import type { APIRoute } from 'astro'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { createDb } from '@/db'
import { entries, entryUpdates } from '../../../../../drizzle/schema'

const LEVEL_NAMES = ['note', 'experiment', 'project', 'product'] as const
const LEVEL_LABELS = ['L0 Lab Note', 'L1 Experiment', 'L2 Project', 'L3 Product'] as const

const PromoteSchema = z.object({
  level: z.number().int().min(0).max(3),
})

// POST /api/entries/:id/promote
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

  const parsed = PromoteSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const entry = existing[0]
  const newLevel = parsed.data.level

  if (newLevel === entry.level) {
    return Response.json({ error: 'Entry is already at this level' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const today = now.split('T')[0]

  // Update the entry level and type
  await db
    .update(entries)
    .set({
      level: newLevel,
      type: LEVEL_NAMES[newLevel],
      updatedAt: now,
    })
    .where(eq(entries.id, id!))

  // Append a promotion update log
  const direction = newLevel > entry.level ? 'Promoted' : 'Moved'
  await db.insert(entryUpdates).values({
    entryId: id!,
    date: today,
    type: 'release',
    content: `${direction} from ${LEVEL_LABELS[entry.level]} to ${LEVEL_LABELS[newLevel]}.`,
  })

  const updated = await db.select().from(entries).where(eq(entries.id, id!))
  const updates = await db
    .select()
    .from(entryUpdates)
    .where(eq(entryUpdates.entryId, id!))

  return Response.json({
    ...updated[0],
    updates: updates.map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
  })
}
