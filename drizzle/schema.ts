import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  level: integer('level').notNull(),
  type: text('type').notNull(),
  date: text('date').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  content: text('content').notNull(),
  link: text('link'),
  metrics: text('metrics', { mode: 'json' }).$type<{ label: string; value: string }[]>(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  index('entries_level_idx').on(t.level),
])

export const entryUpdates = sqliteTable('entry_updates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entryId: text('entry_id').notNull().references(() => entries.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  version: text('version'),
  type: text('type').notNull(),
  content: text('content').notNull(),
}, (t) => [
  index('entry_updates_entry_id_idx').on(t.entryId),
])

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  date: text('date').notNull(),
  quarter: text('quarter').notNull(),
  readTime: text('read_time').notNull(),
  coverImage: text('cover_image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const journalBlocks = sqliteTable('journal_blocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  journalEntryId: text('journal_entry_id').notNull().references(() => journalEntries.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  componentName: text('component_name'),
}, (t) => [
  index('journal_blocks_entry_id_idx').on(t.journalEntryId),
])
