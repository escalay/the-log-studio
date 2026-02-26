import { z } from 'zod';
import { MaturityLevel } from './types';

// Enums
export const MaturityLevelSchema = z.nativeEnum(MaturityLevel);
export const ContentTypeSchema = z.enum(['note', 'experiment', 'project', 'thought', 'product']);
export const JournalBlockTypeSchema = z.enum(['markdown', 'component', 'image', 'pull-quote']);

// Shared
export const UpdateLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  version: z.string().optional(),
  type: z.enum(['init', 'chore', 'feat', 'fix', 'release']),
  content: z.string().min(1)
});

export const MetricSchema = z.object({
  label: z.string(),
  value: z.string()
});

// Entry
export const EntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().min(1),
  description: z.string(),
  level: MaturityLevelSchema,
  type: ContentTypeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  tags: z.array(z.string()),
  content: z.string(),
  link: z.string().url().optional(),
  metrics: z.array(MetricSchema).optional(),
  updates: z.array(UpdateLogSchema).optional()
});

// Journal
export const JournalBlockSchema = z.object({
  type: JournalBlockTypeSchema,
  content: z.string(),
  componentName: z.string().optional()
});

export const JournalEntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  date: z.string(), // Allowing freeform date for journal like "Jan 10, 2025"
  quarter: z.string(),
  readTime: z.string(),
  coverImage: z.string().optional(),
  blocks: z.array(JournalBlockSchema)
});

// Collections
export const EntriesSchema = z.array(EntrySchema);
export const JournalEntriesSchema = z.array(JournalEntrySchema);
