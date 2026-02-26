import type { APIRoute } from 'astro'
import { eq } from 'drizzle-orm'
import { createDb } from '@/db'
import { journalEntries } from '../../../../drizzle/schema'
import { generateOGImage } from '@/og/generate'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { slug } = params

  const rows = await db.select().from(journalEntries).where(eq(journalEntries.slug, slug!))
  if (rows.length === 0) {
    return new Response('Not found', { status: 404 })
  }

  const post = rows[0]
  const png = await generateOGImage({
    title: post.title,
    subtitle: post.subtitle,
    date: `${post.quarter} — ${post.date}`,
    type: 'journal',
  })

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
