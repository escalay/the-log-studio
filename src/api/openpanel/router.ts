import { Hono } from 'hono'
import type { Env } from '../context'

const SCRIPT_URL = 'https://openpanel.dev/op1.js'
const API_BASE = 'https://opapi.aaho.cc'

export const openpanelRouter = new Hono<Env>().basePath('/op')

// Proxy the tracking script from our domain
openpanelRouter.get('/op1.js', async (c) => {
  const res = await fetch(SCRIPT_URL)
  return new Response(res.body, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400',
    },
  })
})

// Proxy all tracking API calls to OpenPanel backend
openpanelRouter.all('/*', async (c) => {
  const url = new URL(c.req.url)
  const path = url.pathname.replace(/^\/api\/op/, '')
  const target = `${API_BASE}${path}${url.search}`

  const headers = new Headers()
  const contentType = c.req.header('content-type')
  if (contentType) headers.set('content-type', contentType)

  const clientId = c.req.header('openpanel-client-id')
  if (clientId) headers.set('openpanel-client-id', clientId)

  const secret = c.get('openpanelClientSecret')
  if (secret) headers.set('openpanel-client-secret', secret)

  const body = c.req.method !== 'GET' ? await c.req.arrayBuffer() : undefined

  const res = await fetch(target, {
    method: c.req.method,
    headers,
    body,
  })

  return new Response(res.body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/json',
    },
  })
})
