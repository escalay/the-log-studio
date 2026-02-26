import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ request, locals, url }, next) => {
  // Protect admin page with token query param or cookie
  if (url.pathname.startsWith('/admin')) {
    const env = locals.runtime?.env
    const adminSecret = env?.ADMIN_SECRET

    if (adminSecret) {
      const cookieToken = parseCookie(request.headers.get('cookie') ?? '', 'admin_token')
      const queryToken = url.searchParams.get('token')

      // If token provided in query, set cookie and redirect to clean URL
      if (queryToken === adminSecret) {
        const cleanUrl = new URL(url)
        cleanUrl.searchParams.delete('token')
        return new Response(null, {
          status: 302,
          headers: {
            Location: cleanUrl.pathname,
            'Set-Cookie': `admin_token=${adminSecret}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=86400`,
          },
        })
      }

      if (cookieToken !== adminSecret) {
        return new Response('Unauthorized. Append ?token=YOUR_SECRET to access.', {
          status: 401,
          headers: { 'Content-Type': 'text/plain' },
        })
      }
    }
  }

  return next()
})

const parseCookie = (header: string, name: string): string | null => {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
