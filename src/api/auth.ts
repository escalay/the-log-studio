import { createMiddleware } from 'hono/factory'
import type { Env } from './context'
import { fail } from './errors'

export const SESSION_COOKIE = 'admin_session'

export const parseCookie = (header: string, name: string): string | null => {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/** The value the admin cookie carries: a digest of the secret, so the secret itself never sits in a cookie. */
export const sessionTokenFor = async (adminSecret: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${adminSecret}:admin-session`))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** Writes need the `x-admin-secret` header or the admin session cookie. Without a configured secret only local dev may write. */
export const adminAuth = createMiddleware<Env>(async (c, next) => {
  const adminSecret = c.get('adminSecret')

  if (!adminSecret) {
    if (import.meta.env.DEV) return await next()
    return fail(c, 503, 'not_configured', 'Writes are disabled: ADMIN_SECRET is not set on this deployment.')
  }

  const headerToken = c.req.header('x-admin-secret')
  const cookieToken = parseCookie(c.req.header('cookie') ?? '', SESSION_COOKIE)

  if (headerToken !== adminSecret && cookieToken !== (await sessionTokenFor(adminSecret))) {
    return fail(c, 401, 'unauthorized', 'Unauthorized: send the x-admin-secret header.')
  }

  return await next()
})
