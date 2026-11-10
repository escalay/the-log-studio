import type { APIRoute } from 'astro'
import { createDb } from '@/db'
import { entries, journalEntries } from '../../drizzle/schema'

const LEVEL_NAMES = ['Lab Note', 'Experiment', 'Project', 'Product']

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const rfc822 = (date: string) => new Date(`${date.slice(0, 10)}T12:00:00Z`).toUTCString()

/** One feed for the whole studio: every entry and every journal post, newest first. */
export const GET: APIRoute = async ({ locals, site, url }) => {
  const origin = (site ?? url).origin
  const db = createDb(locals.runtime.env.DB)
  const [entryRows, journalRows] = await Promise.all([db.select().from(entries), db.select().from(journalEntries)])

  const items = [
    ...entryRows.map((entry) => ({
      title: entry.title,
      link: `${origin}/entries/${entry.slug}`,
      description: entry.description,
      date: entry.date,
      category: `L${entry.level} ${LEVEL_NAMES[entry.level]}`,
    })),
    ...journalRows.map((post) => ({
      title: post.title,
      link: `${origin}/journal/${post.slug}`,
      description: post.subtitle,
      date: post.date,
      category: 'Journal',
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Log Studio — Escalay</title>
    <link>${origin}</link>
    <description>Ideas on their way from raw notes to shipped products.</description>
    <language>en</language>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } })
}
