import type { Database } from '@/db'
import type { OpenAPIHono } from '@hono/zod-openapi'

export type HonoVariables = {
  db: Database
  adminSecret: string | undefined
  openpanelClientSecret: string | undefined
}

export type Env = { Variables: HonoVariables }

export type Hook = ConstructorParameters<typeof OpenAPIHono>[0] extends infer T
  ? T extends { defaultHook?: infer H } ? H : never
  : never

export const validationHook: Hook = (result, c) => {
  if (!result.success) {
    return c.json({ error: (result.error as any).flatten() }, 400)
  }
}
