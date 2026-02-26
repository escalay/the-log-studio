import type { APIRoute } from 'astro'
import { eq } from 'drizzle-orm'
import { createDb } from '@/db'
import { entries } from '../../../../drizzle/schema'
import { generateOGImage } from '@/og/generate'

const LEVEL_NAMES = ['Lab Note', 'Experiment', 'Project', 'Product']

export const GET: APIRoute = async ({ params, locals }) => {
  const db = createDb(locals.runtime.env.DB)
  const { id } = params

  const rows = await db.select().from(entries).where(eq(entries.id, id!))
  if (rows.length === 0) {
    return new Response('Not found', { status: 404 })
  }

  const entry = rows[0]
  const png = await generateOGImage({
    title: entry.title,
    subtitle: entry.description || undefined,
    level: entry.level,
    date: entry.date,
    type: 'entry',
  })

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
