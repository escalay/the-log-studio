import type { APIRoute } from 'astro'
import { createDb } from '@/db'
import { entries, journalEntries } from '../../drizzle/schema'

/** Entry and journal pages come from the database, so the build-time sitemap cannot list them: this one does. */
export const GET: APIRoute = async ({ locals, site, url }) => {
  const origin = (site ?? url).origin
  const db = createDb(locals.runtime.env.DB)
  const [entryRows, journalRows] = await Promise.all([db.select().from(entries), db.select().from(journalEntries)])

  const pages = [
    ...entryRows.map((entry) => ({ loc: `${origin}/entries/${entry.slug}`, lastmod: entry.updatedAt })),
    ...journalRows.map((post) => ({ loc: `${origin}/journal/${post.slug}`, lastmod: post.updatedAt })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${page.loc}</loc><lastmod>${page.lastmod.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } })
}
