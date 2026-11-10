import type { APIRoute } from 'astro'
import { SESSION_COOKIE, sessionTokenFor } from '@/api/auth'
import { signInPage } from '@/middleware'

const html = (body: string, status: number) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })

/** Signing in: the secret arrives in a form body, never in a URL, and the cookie holds only a digest of it. */
export const POST: APIRoute = async ({ request, locals, url }) => {
  const adminSecret = locals.runtime?.env?.ADMIN_SECRET
  if (!adminSecret) return html(signInPage('No admin secret is configured on this deployment.'), 503)

  const form = await request.formData().catch(() => null)
  if (form?.get('secret') !== adminSecret) return html(signInPage('That is not the admin secret.'), 401)

  const secure = url.protocol === 'https:' ? '; Secure' : ''
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin',
      'Set-Cookie': `${SESSION_COOKIE}=${await sessionTokenFor(adminSecret)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${secure}`,
    },
  })
}

/** Signing out, and the place a stray visit to this address lands. */
export const GET: APIRoute = ({ url }) => {
  const secure = url.protocol === 'https:' ? '; Secure' : ''
  return new Response(null, {
    status: 303,
    headers: { Location: '/admin', 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}` },
  })
}
