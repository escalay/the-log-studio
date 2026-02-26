import type { APIRoute } from 'astro'
import { createDb } from '@/db'
import { sql } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = createDb(locals.runtime.env.DB)
    await db.run(sql`SELECT 1`)
    return Response.json({ status: 'ok' })
  } catch {
    return Response.json({ status: 'error', message: 'Database connection failed' }, { status: 500 })
  }
}
