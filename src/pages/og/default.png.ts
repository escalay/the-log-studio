import type { APIRoute } from 'astro'
import { generateOGImage } from '@/og/generate'

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: 'The Log Studio',
    subtitle: 'The operating system for ideas. A brutalist digital garden tracking the evolution of experiments from raw notes to shipped products.',
    type: 'default',
  })

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
