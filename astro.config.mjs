import { readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  site: 'https://escalay.space',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api/'),
    }),
  ],
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    ssr: {
      external: ['node:async_hooks'],
    },
  },
})
