import type { Context } from 'hono'

export type ErrorCode =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'not_configured'
  | 'internal'

/** Every API error: `error` (the message, kept for older clients), plus a stable `code` to branch on. */
export const fail = <S extends number>(c: Context, status: S, code: ErrorCode, message: string) =>
  c.json({ error: message, code, message }, status as any)
