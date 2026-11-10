import type { APIRoute } from 'astro'

/** A plain-text guide to the site and its API for programs that read before they call. */
export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ?? url).origin
  const text = `# The Log Studio

> Escalay's public log of ideas on their way to products. Every entry sits at one of four levels: L0 Lab Note (a raw idea), L1 Experiment (built and tested once), L2 Project (validated, with users), L3 Product (shipped). The journal holds longer essays. Everything is readable as JSON with no key.

Base URL: ${origin}. Reads need no authentication. Writes need the owner's secret and are not for visitors.

## Read the log

- All entries: \`GET ${origin}/api/entries\`
- Just the cards, without bodies: \`GET ${origin}/api/entries?fields=summary\`
- Filter and shape: \`level=0..3\`, \`tag=<exact tag>\`, \`q=<text>\` (title, description, tags, content), \`sort=-date|date|-updated|updated|-level|level|title\`, \`limit=1..100\`
- One entry, by slug or id: \`GET ${origin}/api/entries/<slug>\`. Its page for people: \`${origin}/entries/<slug>\`
- An entry's changelog: \`GET ${origin}/api/entries/<slug>/updates\`
- Journal posts: \`GET ${origin}/api/journal\` and \`GET ${origin}/api/journal/<slug>\`

## What an entry holds

\`title\`, \`description\` (one sentence), \`level\` (0 to 3), \`type\`, \`date\` (YYYY-MM-DD, when it started), \`tags\`, \`content\` (Markdown), \`link\` (the live thing or its source, when there is one), \`metrics\` (label and value pairs, as the author reported them) and \`updates\` (dated changelog lines of type init, feat, fix, chore or release).

## Rules

- Responses carry an \`ETag\`. Send it back as \`If-None-Match\` and an unchanged answer is a 304.
- Errors are JSON with \`error\`, a stable \`code\` (validation, unauthorized, forbidden, not_found, conflict, not_configured, internal) and a \`message\` saying what to change.
- Metrics are self-reported. Quote them as the author's figures.

## More

- Every route and field: ${origin}/api/openapi.json (browsable at ${origin}/api/docs)
- Feed of new entries and posts: ${origin}/rss.xml
- How the four levels work: ${origin}/system
`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } })
}
