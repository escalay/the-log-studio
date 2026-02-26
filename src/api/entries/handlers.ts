import { eq, and, sql } from 'drizzle-orm'
import { entries, entryUpdates } from '../../../drizzle/schema'
import type { RouteHandler } from '@hono/zod-openapi'
import type { Env } from '../context'
import * as contracts from './contracts'

const formatUpdates = (rows: { date: string; version: string | null; type: string; content: string }[]) =>
  rows.map((u) => ({ date: u.date, version: u.version, type: u.type, content: u.content }))

// GET /entries
export const listEntries: RouteHandler<typeof contracts.listEntries, Env> = async (c) => {
  const db = c.get('db')
  const { level, tag } = c.req.valid('query')

  let query = db.select().from(entries).$dynamic()

  const conditions = []
  if (level !== undefined) {
    conditions.push(eq(entries.level, level))
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const rows = await query

  if (rows.length === 0) {
    return c.json([], 200)
  }

  const entryIds = rows.map((r) => r.id)
  const allUpdates = await db
    .select()
    .from(entryUpdates)
    .where(
      entryIds.length === 1
        ? eq(entryUpdates.entryId, entryIds[0])
        : sql`${entryUpdates.entryId} IN (${sql.join(entryIds.map((id) => sql`${id}`), sql`, `)})`
    )

  const updatesByEntry = new Map<string, typeof allUpdates>()
  for (const u of allUpdates) {
    const list = updatesByEntry.get(u.entryId) ?? []
    list.push(u)
    updatesByEntry.set(u.entryId, list)
  }

  let result = rows.map((row) => ({
    ...row,
    updates: formatUpdates(updatesByEntry.get(row.id) ?? []),
  }))

  if (tag) {
    result = result.filter((entry) => {
      const tags = Array.isArray(entry.tags) ? entry.tags : []
      return tags.includes(tag)
    })
  }

  return c.json(result as any, 200)
}

// POST /entries
export const createEntry: RouteHandler<typeof contracts.createEntry, Env> = async (c) => {
  const db = c.get('db')
  const data = c.req.valid('json')
  const now = new Date().toISOString()
  const id = data.id ?? `${data.type.slice(0, 4)}-${Date.now().toString(36)}`

  try {
    await db.insert(entries).values({
      id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      level: data.level,
      type: data.type,
      date: data.date,
      tags: data.tags,
      content: data.content,
      link: data.link ?? null,
      metrics: data.metrics ?? null,
      createdAt: now,
      updatedAt: now,
    })

    if (data.updates) {
      for (const update of data.updates) {
        await db.insert(entryUpdates).values({
          entryId: id,
          date: update.date,
          version: update.version ?? null,
          type: update.type,
          content: update.content,
        })
      }
    }

    const created = await db.select().from(entries).where(eq(entries.id, id))
    const updates = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))

    return c.json({ ...created[0], updates: formatUpdates(updates) } as any, 201)
  } catch (error) {
    console.error('[API] entries POST:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

// GET /entries/:id
export const getEntry: RouteHandler<typeof contracts.getEntry, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const rows = await db.select().from(entries).where(eq(entries.id, id))
  if (rows.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const updates = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))

  return c.json({ ...rows[0], updates: formatUpdates(updates) } as any, 200)
}

// PUT /entries/:id
export const updateEntry: RouteHandler<typeof contracts.updateEntry, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const existing = await db.select().from(entries).where(eq(entries.id, id))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const data = c.req.valid('json')
  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }

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

  await db.update(entries).set(updates).where(eq(entries.id, id))

  const updated = await db.select().from(entries).where(eq(entries.id, id))
  const entryUpdateRows = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))

  return c.json({ ...updated[0], updates: formatUpdates(entryUpdateRows) } as any, 200)
}

// DELETE /entries/:id
export const deleteEntry: RouteHandler<typeof contracts.deleteEntry, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const existing = await db.select().from(entries).where(eq(entries.id, id))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  await db.delete(entries).where(eq(entries.id, id))
  return c.json({ status: 'deleted' }, 200)
}

// GET /entries/:id/updates
export const listUpdates: RouteHandler<typeof contracts.listUpdates, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const existing = await db.select().from(entries).where(eq(entries.id, id))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const updates = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))
  return c.json(formatUpdates(updates) as any, 200)
}

// POST /entries/:id/updates
export const appendUpdate: RouteHandler<typeof contracts.appendUpdate, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const existing = await db.select().from(entries).where(eq(entries.id, id))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const data = c.req.valid('json')
  const date = data.date ?? new Date().toISOString().split('T')[0]

  await db.insert(entryUpdates).values({
    entryId: id,
    date,
    version: data.version ?? null,
    type: data.type,
    content: data.content,
  })

  await db.update(entries).set({ updatedAt: new Date().toISOString() }).where(eq(entries.id, id))

  const updates = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))
  return c.json(formatUpdates(updates) as any, 201)
}

// POST /entries/:id/promote
const LEVEL_NAMES = ['note', 'experiment', 'project', 'product'] as const
const LEVEL_LABELS = ['L0 Lab Note', 'L1 Experiment', 'L2 Project', 'L3 Product'] as const

export const promoteEntry: RouteHandler<typeof contracts.promoteEntry, Env> = async (c) => {
  const db = c.get('db')
  const { id } = c.req.valid('param')

  const existing = await db.select().from(entries).where(eq(entries.id, id))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const entry = existing[0]
  const newLevel = c.req.valid('json').level

  if (newLevel === entry.level) {
    return c.json({ error: 'Entry is already at this level' }, 400)
  }

  const now = new Date().toISOString()
  const today = now.split('T')[0]

  await db
    .update(entries)
    .set({ level: newLevel, type: LEVEL_NAMES[newLevel], updatedAt: now })
    .where(eq(entries.id, id))

  const direction = newLevel > entry.level ? 'Promoted' : 'Moved'
  await db.insert(entryUpdates).values({
    entryId: id,
    date: today,
    type: 'release',
    content: `${direction} from ${LEVEL_LABELS[entry.level]} to ${LEVEL_LABELS[newLevel]}.`,
  })

  const updated = await db.select().from(entries).where(eq(entries.id, id))
  const updates = await db.select().from(entryUpdates).where(eq(entryUpdates.entryId, id))

  return c.json({ ...updated[0], updates: formatUpdates(updates) } as any, 200)
}
