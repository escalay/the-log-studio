export enum MaturityLevel {
  L0 = 0,
  L1 = 1,
  L2 = 2,
  L3 = 3,
}

export type ContentType = 'note' | 'experiment' | 'project' | 'thought' | 'product'

export interface UpdateLog {
  date: string
  version?: string
  type: 'init' | 'chore' | 'feat' | 'fix' | 'release'
  content: string
}

export interface Entry {
  id: string
  slug: string
  title: string
  description: string
  level: MaturityLevel
  type: ContentType
  date: string
  tags: string[]
  content: string
  link?: string
  metrics?: { label: string; value: string }[]
  updates?: UpdateLog[]
}

export interface FilterState {
  level: MaturityLevel | 'all'
  tag: string | null
}

export type JournalBlockType = 'markdown' | 'component' | 'image' | 'pull-quote'

export interface JournalBlock {
  type: JournalBlockType
  content: string
  componentName?: string
}

export interface JournalEntry {
  id: string
  slug: string
  title: string
  subtitle: string
  date: string
  quarter: string
  readTime: string
  coverImage?: string
  blocks: JournalBlock[]
}
