import { defineMiddleware } from 'astro:middleware'
import { parseCookie, SESSION_COOKIE, sessionTokenFor } from '@/api/auth'

/** The sign-in form shown in place of the admin panel until the session cookie is set. */
export const signInPage = (message = '') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Sign in — The Log Studio</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #111; color: #f4f1ea; font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    form { width: min(360px, calc(100vw - 48px)); border: 2px solid #f4f1ea; padding: 28px; box-shadow: 6px 6px 0 #ff4f00; }
    h1 { margin: 0 0 20px; font-size: 14px; letter-spacing: 0.2em; text-transform: uppercase; }
    label { display: block; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px; }
    input { box-sizing: border-box; width: 100%; padding: 10px; background: #111; color: inherit; border: 2px solid #f4f1ea; font: inherit; }
    input:focus { outline: 2px solid #ff4f00; outline-offset: 2px; }
    button { margin-top: 16px; width: 100%; padding: 10px; background: #ff4f00; color: #111; border: 0; font: inherit; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; }
    p { margin: 14px 0 0; font-size: 12px; color: #ff4f00; min-height: 1em; }
  </style>
</head>
<body>
  <form method="post" action="/admin/login">
    <h1>The Log Studio /// Admin</h1>
    <label for="secret">Admin secret</label>
    <input id="secret" name="secret" type="password" autocomplete="current-password" required autofocus />
    <button type="submit">Sign in</button>
    <p role="alert">${message}</p>
  </form>
</body>
</html>`

export const onRequest = defineMiddleware(async ({ request, locals, url }, next) => {
  const isAdminPage = url.pathname.startsWith('/admin') && url.pathname !== '/admin/login'
  if (!isAdminPage) return next()

  const adminSecret = locals.runtime?.env?.ADMIN_SECRET
  if (!adminSecret) {
    // Local dev without a secret stays open; a deployment without one has no admin at all
    if (import.meta.env.DEV) return next()
    return new Response('The admin panel is disabled: ADMIN_SECRET is not set on this deployment.', { status: 503 })
  }

  const session = parseCookie(request.headers.get('cookie') ?? '', SESSION_COOKIE)
  if (session !== (await sessionTokenFor(adminSecret))) {
    return new Response(signInPage(), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
  }

  return next()
})
