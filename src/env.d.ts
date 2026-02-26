/// <reference path="../.astro/types.d.ts" />

declare const __APP_VERSION__: string

type D1Database = import('@cloudflare/workers-types').D1Database

type Runtime = import('@astrojs/cloudflare').Runtime<{
  DB: D1Database
  ADMIN_SECRET?: string
  POSTHOG_API_KEY?: string
}>

declare namespace App {
  interface Locals extends Runtime {}
}
