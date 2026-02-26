import { sql } from 'drizzle-orm'
import { entries, entryUpdates, journalEntries, journalBlocks } from '../../../drizzle/schema'
import { SEED_ENTRIES, SEED_JOURNAL_ENTRIES } from '../../../drizzle/seed'
import type { RouteHandler } from '@hono/zod-openapi'
import type { Env } from '../context'
import * as contracts from './contracts'

// GET /health
export const health: RouteHandler<typeof contracts.health, Env> = async (c) => {
  const version = __APP_VERSION__

  try {
    const db = c.get('db')
    await db.run(sql`SELECT 1`)
    return c.json({ status: 'ok' as const, version }, 200)
  } catch {
    return c.json({ status: 'error' as const, version, message: 'Database connection failed' }, 500)
  }
}

// POST /seed
export const seed: RouteHandler<typeof contracts.seed, Env> = async (c) => {
  const db = c.get('db')
  const now = new Date().toISOString()

  try {
    await db.delete(journalBlocks)
    await db.delete(journalEntries)
    await db.delete(entryUpdates)
    await db.delete(entries)

    for (const entry of SEED_ENTRIES) {
      await db.insert(entries).values({
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        level: entry.level,
        type: entry.type,
        date: entry.date,
        tags: entry.tags,
        content: entry.content,
        link: entry.link ?? null,
        metrics: entry.metrics ?? null,
        createdAt: now,
        updatedAt: now,
      })

      if (entry.updates) {
        for (const update of entry.updates) {
          await db.insert(entryUpdates).values({
            entryId: entry.id,
            date: update.date,
            version: update.version ?? null,
            type: update.type,
            content: update.content,
          })
        }
      }
    }

    for (const journal of SEED_JOURNAL_ENTRIES) {
      await db.insert(journalEntries).values({
        id: journal.id,
        slug: journal.slug,
        title: journal.title,
        subtitle: journal.subtitle,
        date: journal.date,
        quarter: journal.quarter,
        readTime: journal.readTime,
        coverImage: journal.coverImage ?? null,
        createdAt: now,
        updatedAt: now,
      })

      for (let i = 0; i < journal.blocks.length; i++) {
        const block = journal.blocks[i]
        await db.insert(journalBlocks).values({
          journalEntryId: journal.id,
          sortOrder: i,
          type: block.type,
          content: block.content,
          componentName: block.componentName ?? null,
        })
      }
    }

    return c.json({
      status: 'ok' as const,
      entries: SEED_ENTRIES.length,
      journal: SEED_JOURNAL_ENTRIES.length,
    }, 200)
  } catch (error) {
    console.error('[API] seed POST:', error)
    return c.json({ status: 'error' as const, message: 'Internal server error' }, 500)
  }
}
