import { eq, asc } from 'drizzle-orm'
import { journalEntries, journalBlocks } from '../../../drizzle/schema'
import type { RouteHandler } from '@hono/zod-openapi'
import type { Env } from '../context'
import * as contracts from './contracts'

// GET /journal
export const listJournal: RouteHandler<typeof contracts.listJournal, Env> = async (c) => {
  const db = c.get('db')
  const rows = await db.select().from(journalEntries)

  return c.json(
    rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      date: row.date,
      quarter: row.quarter,
      readTime: row.readTime,
      coverImage: row.coverImage,
    })) as any,
    200,
  )
}

// POST /journal
export const createJournal: RouteHandler<typeof contracts.createJournal, Env> = async (c) => {
  const db = c.get('db')
  const data = c.req.valid('json')
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

    return c.json({ id, slug: data.slug }, 201)
  } catch (error) {
    console.error('[API] journal POST:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

// GET /journal/:slug
export const getJournal: RouteHandler<typeof contracts.getJournal, Env> = async (c) => {
  const db = c.get('db')
  const { slug } = c.req.valid('param')

  const rows = await db.select().from(journalEntries).where(eq(journalEntries.slug, slug))
  if (rows.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const blocks = await db
    .select()
    .from(journalBlocks)
    .where(eq(journalBlocks.journalEntryId, rows[0].id))
    .orderBy(asc(journalBlocks.sortOrder))

  return c.json(
    {
      ...rows[0],
      blocks: blocks.map((b) => ({
        type: b.type,
        content: b.content,
        componentName: b.componentName,
      })),
    } as any,
    200,
  )
}

// PUT /journal/:slug
export const updateJournal: RouteHandler<typeof contracts.updateJournal, Env> = async (c) => {
  const db = c.get('db')
  const { slug } = c.req.valid('param')

  const existing = await db.select().from(journalEntries).where(eq(journalEntries.slug, slug))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  const data = c.req.valid('json')
  const now = new Date().toISOString()
  const entry = existing[0]

  const updates: Record<string, unknown> = { updatedAt: now }
  if (data.title !== undefined) updates.title = data.title
  if (data.subtitle !== undefined) updates.subtitle = data.subtitle
  if (data.date !== undefined) updates.date = data.date
  if (data.quarter !== undefined) updates.quarter = data.quarter
  if (data.readTime !== undefined) updates.readTime = data.readTime
  if (data.coverImage !== undefined) updates.coverImage = data.coverImage

  await db.update(journalEntries).set(updates).where(eq(journalEntries.slug, slug))

  if (data.blocks) {
    await db.delete(journalBlocks).where(eq(journalBlocks.journalEntryId, entry.id))

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

  return c.json({ status: 'updated' }, 200)
}

// DELETE /journal/:slug
export const deleteJournal: RouteHandler<typeof contracts.deleteJournal, Env> = async (c) => {
  const db = c.get('db')
  const { slug } = c.req.valid('param')

  const existing = await db.select().from(journalEntries).where(eq(journalEntries.slug, slug))
  if (existing.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }

  await db.delete(journalEntries).where(eq(journalEntries.slug, slug))
  return c.json({ status: 'deleted' }, 200)
}
