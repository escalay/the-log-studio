import type { APIRoute } from 'astro'
import { z } from 'zod'
import { eq, and, sql } from 'drizzle-orm'
import { createDb } from '@/db'
import { entries, entryUpdates } from '../../../../drizzle/schema'

// GET /api/entries?level=0&tag=devtools
export const GET: APIRoute = async ({ locals, url }) => {
  const db = createDb(locals.runtime.env.DB)

  const levelParam = url.searchParams.get('level')
  const tagParam = url.searchParams.get('tag')

  let query = db.select().from(entries).$dynamic()

  const conditions = []
  if (levelParam !== null) {
    const level = parseInt(levelParam, 10)
    if (!isNaN(level)) conditions.push(eq(entries.level, level))
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const rows = await query

  if (rows.length === 0) {
    return Response.json([])
  }

  // Fetch updates only for returned entries
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
    updates: (updatesByEntry.get(row.id) ?? []).map((u) => ({
      date: u.date,
      version: u.version,
      type: u.type,
      content: u.content,
    })),
  }))

  // Filter by tag in-memory (JSON column)
  if (tagParam) {
    result = result.filter((entry) => {
      const tags = Array.isArray(entry.tags) ? entry.tags : []
      return tags.includes(tagParam)
    })
  }

  return Response.json(result)
}

const CreateEntrySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  level: z.number().int().min(0).max(3),
  type: z.enum(['note', 'experiment', 'project', 'thought', 'product']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
  content: z.string().default(''),
  link: z.string().url().optional(),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  updates: z
    .array(
      z.object({
        date: z.string(),
        version: z.string().optional(),
        type: z.enum(['init', 'chore', 'feat', 'fix', 'release']),
        content: z.string().min(1),
      }),
    )
    .optional(),
})

// POST /api/entries
export const POST: APIRoute = async ({ locals, request }) => {
  const db = createDb(locals.runtime.env.DB)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CreateEntrySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
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

    // Insert initial updates if provided
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
    const updates = await db
      .select()
      .from(entryUpdates)
      .where(eq(entryUpdates.entryId, id))

    return Response.json(
      {
        ...created[0],
        updates: updates.map((u) => ({
          date: u.date,
          version: u.version,
          type: u.type,
          content: u.content,
        })),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] entries POST:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
