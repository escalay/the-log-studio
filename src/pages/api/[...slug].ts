import type { APIRoute } from 'astro'
import { createApiApp } from '@/api'

export const ALL: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env
  const app = createApiApp(env.DB, env.ADMIN_SECRET)
  return app.fetch(request)
}
