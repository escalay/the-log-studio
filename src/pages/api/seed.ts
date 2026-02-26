import type { APIRoute } from 'astro'
import { createDb } from '@/db'
import { entries, entryUpdates, journalEntries, journalBlocks } from '../../../drizzle/schema'
import { SEED_ENTRIES, SEED_JOURNAL_ENTRIES } from '../../../drizzle/seed'

export const POST: APIRoute = async ({ locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const now = new Date().toISOString()

  try {
    // Clear existing data
    await db.delete(journalBlocks)
    await db.delete(journalEntries)
    await db.delete(entryUpdates)
    await db.delete(entries)

    // Seed entries
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

      // Seed updates
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

    // Seed journal entries
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

      // Seed blocks
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

    return Response.json({
      status: 'ok',
      entries: SEED_ENTRIES.length,
      journal: SEED_JOURNAL_ENTRIES.length,
    })
  } catch (error) {
    console.error('[API] seed POST:', error)
    return Response.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}
