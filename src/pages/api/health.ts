import type { APIRoute } from 'astro'
import { createDb } from '@/db'
import { sql } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  const version = __APP_VERSION__

  try {
    const db = createDb(locals.runtime.env.DB)
    await db.run(sql`SELECT 1`)
    return Response.json({ status: 'ok', version })
  } catch {
    return Response.json({ status: 'error', version, message: 'Database connection failed' }, { status: 500 })
  }
}
