import { Entry, MaturityLevel, JournalEntry } from './types';
import { EntriesSchema, JournalEntriesSchema } from './schema';

const RAW_ENTRIES: Entry[] = [
  // --- LEVEL 0: LAB NOTES ---
  {
    id: 'note-01',
    slug: 'escalay-philosophy',
    title: 'The Escalay Operating Manual',
    description: 'A complete guide to building, shipping, and scaling digital experiments.',
    level: MaturityLevel.L0,
    type: 'note',
    date: '2025-01-15',
    tags: ['meta', 'system'],
    content: `
# 00:01 AM - THOUGHTS

Escalay is your personal rapid prototyping studio. It's not just a portfolio or a collection of side projects; it's a deliberate, measured pipeline.

**Principle 1: Start Small, Fail Fast**
Every idea begins as a lab note—a simple markdown file that costs nothing but thought.

**Principle 2: Public Building as Default**
Transparency is our competitive advantage. We build in public not for vanity metrics but for rapid feedback loops.

Is this too pretentious? Maybe. But I need a system.
    `,
    updates: [
        { date: '2025-01-15', type: 'init', content: 'Initial brain dump.' },
        { date: '2025-01-16', type: 'chore', content: 'Fixed typos and added "Revenue is Water" section.' }
    ]
  },
  {
    id: 'note-02',
    slug: 'react-server-components-rant',
    title: 'Why RSC confuses me (Draft)',
    description: 'Raw thoughts on the new React paradigm shifts. Is it worth the complexity?',
    level: MaturityLevel.L0,
    type: 'note',
    date: '2025-02-01',
    tags: ['react', 'rant', 'frontend'],
    content: `
# The pendulum swings back.

We moved away from PHP to do everything on the client.
Now we are moving back to the server, but keeping the client active?

*   **Pros:** Smaller bundles? (Maybe).
*   **Cons:** My mental model is broken. 

Need to investigate if \`use client\` is just a directive or a lifestyle choice.
TODO: Build a simple counter app with RSC and see where it breaks.
    `,
    updates: [
        { date: '2025-02-01', type: 'init', content: 'Draft created after reading Dan\'s blog.' }
    ]
  },
    {
    id: 'note-03',
    slug: 'design-brutalism',
    title: 'Aesthetic Inspiration: Editorial Brutalism',
    description: 'Collecting links and visual references for the new blog design.',
    level: MaturityLevel.L0,
    type: 'note',
    date: '2025-02-03',
    tags: ['design', 'ui', 'art'],
    content: `
# Visual Language

I want the new site to feel like a **machine**. 

**Keywords:**
- DIN 1451
- International Orange
- Architectural Plans
- Unfinished

**References:**
- The old Bloomberg terminal
- Braun manuals (Dietrams)
- Swiss subway maps.

Don't smooth the corners. Keep the borders hard.
    `,
    updates: [
        { date: '2025-02-03', type: 'init', content: 'Started collection.' },
        { date: '2025-02-05', type: 'feat', content: 'Added references from SiteInspire.' }
    ]
  },

  // --- LEVEL 1: EXPERIMENTS ---
  {
    id: 'exp-01',
    slug: 'css-to-tailwind',
    title: 'CSS -> Tailwind Parser',
    description: 'A regex-based parser that takes raw CSS blocks and attempts to output utility classes.',
    level: MaturityLevel.L1,
    type: 'experiment',
    date: '2025-01-20',
    tags: ['devtools', 'parser'],
    link: 'https://github.com/example/css-to-tailwind',
    content: `
## HYPOTHESIS
A simple text area paster that uses regex (initially) and then AST to map properties to standard Tailwind tokens will save me 10m/day.

## METHODOLOGY
1. Input: \`display: flex; justify-content: center;\`
2. Regex Match key/value.
3. Lookup table for TW classes.

## RESULTS
**Day 1:** Works for basics.
**Day 3:** Complex selectors (nth-child) are breaking the regex. Need a real parser like PostCSS.

**STATUS:** PAUSED. Regex is not enough.
    `,
    metrics: [
      { label: 'Accuracy', value: '60%' },
      { label: 'Complexity', value: 'High' }
    ],
    updates: [
        { date: '2025-01-20', type: 'init', content: 'Project initialized.' },
        { date: '2025-01-22', type: 'feat', content: 'Added basic flexbox mapping.' },
        { date: '2025-01-25', type: 'fix', content: 'Regex catastrophic backtracking fix.' },
        { date: '2025-01-28', type: 'chore', content: 'Marked as PAUSED. Needs AST.' }
    ]
  },
  {
    id: 'exp-02',
    slug: 'webgpu-particles',
    title: 'WebGPU Boids Sim',
    description: 'Testing the limits of the new WebGPU API in Chrome Canary with 1M particles.',
    level: MaturityLevel.L1,
    type: 'experiment',
    date: '2025-01-25',
    tags: ['graphics', 'performance'],
    content: `
## OBJECTIVE
Render 1 million particles at 60fps using compute shaders for position updates.

## OBSERVATIONS
- Setup is extremely verbose compared to WebGL.
- WGSL is weird but readable.
- **Performance:** 
    - 100k particles: 144fps
    - 500k particles: 60fps
    - 1M particles: 24fps (Bottleneck seems to be memory bandwidth, not compute).

**CONCLUSION:**
Ready for production? No. Fun? Yes.
    `,
    metrics: [
      { label: 'FPS (500k)', value: '60' },
      { label: 'Browser', value: 'Chrome' }
    ],
    updates: [
        { date: '2025-01-25', type: 'init', content: 'Cloned basic triangle example.' },
        { date: '2025-01-26', type: 'feat', content: 'Implemented compute shader for boids logic.' },
        { date: '2025-01-27', type: 'fix', content: 'Fixed buffer alignment issues on M1 Max.' }
    ]
  },

  // --- LEVEL 2: PROJECTS ---
  {
    id: 'proj-01',
    slug: 'json-formatter-pro',
    title: 'JSON Formatter Pro',
    description: 'Visualize large JSON datasets with collapsible nodes, type inference, and saving.',
    level: MaturityLevel.L2,
    type: 'project',
    date: '2024-12-10',
    tags: ['devtools', 'data', 'saas'],
    link: 'https://json-pro.example.com',
    content: `
## Overview
Graduated from L1 on Dec 10th. The core "happy path" was validated by 50+ users on Twitter.

**Features Implemented:**
1. [x] **User Accounts:** Save snippets via Supabase.
2. [x] **Shareable Links:** Generate immutable URLs for sharing debug data.
3. [ ] **Diff View:** Compare two JSON objects (Next Sprint).

## Stack
- Next.js 14
- Supabase (Auth/DB)
- Monaco Editor
- Tailwind CSS

**Current State:**
Maintenance mode. Critical bugs only.
    `,
    metrics: [
      { label: 'MRR', value: '$15' },
      { label: 'Active Users', value: '118' }
    ],
    updates: [
        { date: '2024-12-10', version: 'v1.0.0', type: 'release', content: 'Public Launch on Product Hunt.' },
        { date: '2024-12-15', version: 'v1.0.1', type: 'fix', content: 'Fixed JSON parsing for BigInt.' },
        { date: '2025-01-05', version: 'v1.1.0', type: 'feat', content: 'Added Dark Mode support.' },
        { date: '2025-01-20', type: 'chore', content: 'Upgraded Next.js to v14.1.' }
    ]
  },
  {
    id: 'proj-02',
    slug: 'dotfiles-manager',
    title: 'Dotman CLI',
    description: 'A rust-based CLI for managing symlinks across macos and linux environments.',
    level: MaturityLevel.L2,
    type: 'project',
    date: '2024-11-05',
    tags: ['rust', 'cli', 'productivity'],
    link: 'https://github.com/example/dotman',
    content: `
## README

**Dotman** is a zero-dependency binary that manages your dotfiles.

\`\`\`bash
$ dotman sync
> Syncing .zshrc... OK
> Syncing .vimrc... OK
\`\`\`

**Roadmap:**
- Add templating support (Handlebars).
- Add support for secret management via system keychain.

Currently used daily by myself and 3 colleagues.
    `,
    metrics: [
      { label: 'Stars', value: '142' },
      { label: 'Version', value: '0.4.1' }
    ],
    updates: [
        { date: '2024-11-05', version: '0.1.0', type: 'init', content: 'First working binary.' },
        { date: '2024-11-20', version: '0.2.0', type: 'feat', content: 'Added backup command.' },
        { date: '2024-12-12', version: '0.3.0', type: 'feat', content: 'Linux support added.' },
        { date: '2025-01-10', version: '0.4.0', type: 'release', content: 'Published to Crates.io.' }
    ]
  },

  // --- LEVEL 3: PRODUCTS ---
  {
    id: 'prod-01',
    slug: 'conjure-rental',
    title: 'Conjure',
    description: 'The flexible furniture ownership platform. Rent to own designer furniture.',
    level: MaturityLevel.L3,
    type: 'product',
    date: '2024-08-01',
    tags: ['marketplace', 'startup'],
    content: `
## Executive Summary

Conjure is a Series-A funded marketplace graduating from this studio. 

**Key Metrics Q4:**
- **CAC:** Reduced by 15% via SEO initiatives.
- **Retention:** 92% month-over-month.

**Infrastructure:**
- AWS ECS (Fargate)
- RDS (Postgres)
- Redis for caching

**Team:**
Currently a team of 12 engineers and 4 designers maintaining this product.
    `,
    metrics: [
      { label: 'Growth', value: '+12%' },
      { label: 'Uptime', value: '99.9%' }
    ],
    updates: [
        { date: '2024-08-01', version: 'v1.0', type: 'release', content: 'Official Launch.' },
        { date: '2024-09-15', version: 'v1.1', type: 'feat', content: 'Released iOS App.' },
        { date: '2024-11-01', version: 'v2.0', type: 'release', content: 'Rebrand and Series A Announcement.' },
        { date: '2025-01-10', type: 'feat', content: 'Integrated BNPL checkout flow.' }
    ]
  },
  {
    id: 'prod-02',
    slug: 'tapestry-analytics',
    title: 'Tapestry',
    description: 'Privacy-first analytics for storytelling websites. No cookies, just vibes.',
    level: MaturityLevel.L3,
    type: 'product',
    date: '2024-06-15',
    tags: ['analytics', 'saas', 'privacy'],
    content: `
## Product Vision

Tapestry fills the gap between Google Analytics (too heavy) and server logs (too raw). 

**Pricing Tier:**
- Free: 1k views/mo
- Pro: 100k views/mo ($9)
- Enterprise: Custom

**Recent Update:**
We just shipped "Heatmaps" for long-form articles. This feature is driving 40% of new signups.
    `,
    metrics: [
      { label: 'MRR', value: '$2.4k' },
      { label: 'Customers', value: '340' }
    ],
    updates: [
        { date: '2024-06-15', version: '1.0.0', type: 'release', content: 'MVP Launch.' },
        { date: '2024-08-20', version: '1.2.0', type: 'feat', content: 'Added Custom Events.' },
        { date: '2024-12-05', version: '1.5.0', type: 'feat', content: 'Heatmaps beta.' },
        { date: '2025-01-15', version: '1.5.2', type: 'fix', content: 'Performance patch for high-traffic sites.' }
    ]
  }
];

const RAW_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'j-01',
        slug: 'year-in-review-2024',
        title: 'The Great Reset',
        subtitle: 'Why I killed 90% of my side projects to focus on one system.',
        date: 'Jan 10, 2025',
        quarter: 'Q1 2025',
        readTime: '8 min read',
        coverImage: 'linear-gradient(135deg, #FF4F00 0%, #111 100%)',
        blocks: [
            {
                type: 'markdown',
                content: `
We are addicted to the *start*. The dopamine hit of \`create-react-app\` (or \`npm create vite\`, let's be modern) is intoxicating. It represents infinite potential. No bugs, no tech debt, just pure, unadulterated creation.

But potential is cheap. Execution is the tax you pay to make something real.

In 2024, I analyzed my GitHub repositories. The results were sobering.
`
            },
            {
                type: 'component',
                content: JSON.stringify({
                    data: [
                        { label: 'Started', value: 42, color: '#FF4F00' },
                        { label: 'Shipped', value: 4, color: '#111111' },
                        { label: 'Abandoned', value: 38, color: '#CECECE' }
                    ],
                    title: '2024 Repo Analysis'
                }),
                componentName: 'BarChart'
            },
            {
                type: 'pull-quote',
                content: "I was a serial starter and a chronic quitter. I had to change the system."
            },
            {
                type: 'markdown',
                content: `
### The Escalay Method

I needed a framework that forced ideas to "earn" their complexity. Most ideas shouldn't be apps. They should be notes. If the note is compelling, it becomes an experiment. If the experiment solves a problem, it becomes a project.

This pipeline reduces the cognitive load of "what do I build next?" to "what has survived the filter?"
`
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
            },
            {
                type: 'markdown',
                content: `
### Moving Forward

The goal for 2025 is not more code. It is more *finished* code. Less noise, more signal. This journal, "The Register", is the official record of that journey.
`
            }
        ]
    },
    {
        id: 'j-02',
        slug: 'editorial-design-web',
        title: 'Return to Print',
        subtitle: 'Why the web is boring and how editorial design can save it.',
        date: 'Oct 15, 2024',
        quarter: 'Q4 2024',
        readTime: '12 min read',
        blocks: [
            {
                type: 'markdown',
                content: `
The modern web is a sea of rounded corners and soft shadows. It is safe. It is accessible. It is incredibly boring.

We have optimized for conversion at the expense of soul. When I look at magazines from the 90s—Ray Gun, The Face, Wired—I see chaos. I see grids being broken. I see typography being used as a weapon.
`
            },
            {
                type: 'pull-quote',
                content: "The user doesn't just want to buy software. They want to feel something."
            },
            {
                type: 'markdown',
                content: `
### The Grid is a Suggestion

In building this site, I looked at "The Escalay System" not as a website, but as a printed manual. A blueprint. 
`
            },
             {
                type: 'component',
                content: JSON.stringify({
                   items: ['Massimo Vignelli', 'Dieter Rams', 'Wolfgang Weingart'],
                   title: 'Inspirations'
                }),
                componentName: 'ListHighlight'
            }
        ]
    }
];

// --- STORAGE KEYS ---
const ENTRIES_KEY = 'escalay_entries_v1';
const JOURNAL_KEY = 'escalay_journal_v1';

// --- STORAGE HELPERS ---
const loadFromStorage = <T,>(key: string, seed: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load from local storage', e);
    }
    return seed;
};

const saveToStorage = <T,>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // Dispatch custom event for cross-component reactivity if needed
        window.dispatchEvent(new Event('storage-update'));
    } catch (e) {
        console.warn('Failed to save to local storage', e);
    }
};

// --- EXPORTED DATA (LIVE) ---
// Initialize from storage or seed
export let ENTRIES: Entry[] = loadFromStorage(ENTRIES_KEY, RAW_ENTRIES);
export let JOURNAL_ENTRIES: JournalEntry[] = loadFromStorage(JOURNAL_KEY, RAW_JOURNAL_ENTRIES);

// --- MUTATIONS ---
export const DataManager = {
    getEntries: () => {
        ENTRIES = loadFromStorage(ENTRIES_KEY, RAW_ENTRIES);
        return ENTRIES;
    },
    
    saveEntry: (entry: Entry) => {
        const existingIndex = ENTRIES.findIndex(e => e.id === entry.id);
        if (existingIndex >= 0) {
            ENTRIES[existingIndex] = entry;
        } else {
            ENTRIES.unshift(entry); // Add new to top
        }
        saveToStorage(ENTRIES_KEY, ENTRIES);
        return entry;
    },

    deleteEntry: (id: string) => {
        ENTRIES = ENTRIES.filter(e => e.id !== id);
        saveToStorage(ENTRIES_KEY, ENTRIES);
    },

    resetEntries: () => {
        ENTRIES = RAW_ENTRIES;
        saveToStorage(ENTRIES_KEY, ENTRIES);
        return ENTRIES;
    }
};

// Validate data against schema at runtime initialization (Optional, can be noisy in dev with loose seeds)
try {
    EntriesSchema.parse(ENTRIES);
    JournalEntriesSchema.parse(JOURNAL_ENTRIES);
} catch (e) {
    console.warn("Schema Validation Warning:", e);
}
