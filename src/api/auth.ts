import { createMiddleware } from 'hono/factory'
import type { Env } from './context'

const parseCookie = (header: string, name: string): string | null => {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export const adminAuth = createMiddleware<Env>(async (c, next) => {
  const adminSecret = c.get('adminSecret')

  if (!adminSecret) {
    return await next()
  }

  const headerToken = c.req.header('x-admin-secret')
  const cookieToken = parseCookie(c.req.header('cookie') ?? '', 'admin_token')

  if (headerToken !== adminSecret && cookieToken !== adminSecret) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return await next()
})
