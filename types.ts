
export enum MaturityLevel {
  L0 = 0, // Lab Note
  L1 = 1, // Experiment
  L2 = 2, // Project
  L3 = 3, // Product
}

export type ContentType = 'note' | 'experiment' | 'project' | 'thought' | 'product';

export interface UpdateLog {
  date: string;
  version?: string;
  type: 'init' | 'chore' | 'feat' | 'fix' | 'release';
  content: string;
}

export interface Entry {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: MaturityLevel;
  type: ContentType;
  date: string;
  tags: string[];
  content: string; // Markdown-like string
  link?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
  updates?: UpdateLog[];
}

export interface FilterState {
  level: MaturityLevel | 'all';
  tag: string | null;
}

// --- JOURNAL TYPES ---

export type JournalBlockType = 'markdown' | 'component' | 'image' | 'pull-quote';

export interface JournalBlock {
  type: JournalBlockType;
  content: string; // Markdown text, or JSON string for component props, or Image URL
  componentName?: string; // For 'component' type
}

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  quarter: string; // e.g. "Q1 2025"
  readTime: string;
  coverImage?: string; // CSS gradient or URL
  blocks: JournalBlock[];
}
