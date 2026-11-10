import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_FILTER, type Entry, type FilterState } from '@/types'
import { track } from '@/lib/analytics'
import { FilterToolbar } from './FilterToolbar'
import { EntryCardSwitcher } from './EntryCardSwitcher'
import { DetailModalSwitcher } from './DetailModalSwitcher'

const SITE_TITLE = 'The Log Studio — Escalay'
const ENTRY_PATH = /^\/entries\/([^/]+)\/?$/

/** The entry the address names: `/entries/<slug>`, or the older `/?entry=<id>`. */
const entryKeyFromLocation = () =>
  window.location.pathname.match(ENTRY_PATH)?.[1] ?? new URLSearchParams(window.location.search).get('entry')

const findByKey = (entries: Entry[], key: string) => entries.find((e) => e.slug === key || e.id === key)

/** Each entry has its own address and title, so it can be shared and the back button closes it. */
const showInAddressBar = (entry: Entry | null, replace = false) => {
  const path = entry ? `/entries/${entry.slug}` : '/'
  if (window.location.pathname + window.location.search !== path) {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  }
  document.title = entry ? `${entry.title} — The Log Studio` : SITE_TITLE
}

const SORTERS: Record<FilterState['sort'], (a: Entry, b: Entry) => number> = {
  newest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  updated: (a, b) => (b.updatedAt ?? b.date).localeCompare(a.updatedAt ?? a.date),
  level: (a, b) => b.level - a.level || b.date.localeCompare(a.date),
}

const visibleEntries = (entries: Entry[], filter: FilterState) => {
  const needle = filter.query.trim().toLowerCase()
  return entries
    .filter((entry) => {
      if (filter.level !== 'all' && entry.level !== filter.level) return false
      if (filter.tag && !entry.tags.includes(filter.tag)) return false
      if (needle && ![entry.title, entry.description, entry.content, ...entry.tags].some((text) => text.toLowerCase().includes(needle))) return false
      return true
    })
    .sort(SORTERS[filter.sort])
}

interface CollectionAppProps {
  /** The entry this page was served for (`/entries/<slug>`): shown open from the first paint. */
  initialEntry?: Entry
}

export const CollectionApp = ({ initialEntry }: CollectionAppProps = {}) => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(initialEntry ?? null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const openEntry = useCallback((entry: Entry) => {
    track('entry_card_clicked', {
      entry_id: entry.id,
      entry_title: entry.title,
      entry_level: entry.level,
      entry_slug: entry.slug,
    })
    setSelectedEntry(entry)
    showInAddressBar(entry)
  }, [])

  const closeEntry = useCallback(() => {
    setSelectedEntry(null)
    showInAddressBar(null)
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const key = entryKeyFromLocation()
      const entry = key ? findByKey(entries, key) ?? null : null
      setSelectedEntry(entry)
      document.title = entry ? `${entry.title} — The Log Studio` : SITE_TITLE
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [entries])

  // Fetch entries and deep-link to ?entry= if present
  useEffect(() => {
    fetch('/api/entries')
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`)
        return r.json()
      })
      .then((data: Entry[]) => {
        setEntries(data)
        setLoading(false)

        const counts = { l0: 0, l1: 0, l2: 0, l3: 0 }
        for (const e of data) {
          if (e.level === 0) counts.l0++
          else if (e.level === 1) counts.l1++
          else if (e.level === 2) counts.l2++
          else if (e.level === 3) counts.l3++
        }
        track('collection_loaded', {
          entry_count: data.length,
          l0_count: counts.l0,
          l1_count: counts.l1,
          l2_count: counts.l2,
          l3_count: counts.l3,
          has_deep_link: !!entryKeyFromLocation(),
        })

        const key = entryKeyFromLocation()
        const entry = key ? findByKey(data, key) : undefined
        if (entry) {
          setSelectedEntry(entry)
          showInAddressBar(entry, true)
        }
      })
      .catch(() => {
        track('collection_load_error')
        setError(true)
        setLoading(false)
      })
  }, [])

  const filteredEntries = useMemo(() => visibleEntries(entries, filter), [filter, entries])

  return (
    <>
      <FilterToolbar filter={filter} setFilter={(next) => {
        const nextFilter = typeof next === 'function' ? next(filter) : next
        // Typing in the search box is not a filter change worth an event per keystroke
        if (nextFilter.level !== filter.level || nextFilter.sort !== filter.sort) {
          track('filter_changed', {
            level: String(nextFilter.level),
            previous_level: String(filter.level),
            sort: nextFilter.sort,
            visible_count: visibleEntries(entries, nextFilter).length,
          })
        }
        setFilter(nextFilter)
      }} entries={entries} />

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center border-b border-ink">
          <div className="w-6 h-6 border-2 border-ink border-t-accent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">Loading entries...</p>
        </div>
      ) : error ? (
        <div className="py-32 flex flex-col items-center justify-center border-b border-ink">
          <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold text-2xl">!</div>
          <p className="font-serif text-2xl italic mb-2">Failed to load entries</p>
          <button onClick={() => window.location.reload()} className="font-mono text-xs underline hover:text-accent">RETRY</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b border-ink">
          {filteredEntries.map((entry, idx) => (
            <div
              key={entry.id}
              className={`${idx % 3 !== 2 ? 'lg:border-r' : ''} ${idx % 2 !== 1 ? 'md:border-r lg:border-r-0' : ''} border-b border-ink p-0`}
            >
              <EntryCardSwitcher entry={entry} onClick={() => openEntry(entry)} />
            </div>
          ))}

          {filteredEntries.length === 0 && entries.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center">
              <div className="w-20 h-20 border-2 border-dashed border-ink/15 rounded-full flex items-center justify-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/20">
                  <path d="M12 3v3m6.36-.64-2.12 2.12M21 12h-3M18.36 18.36l-2.12-2.12M12 21v-3M5.64 18.36l2.12-2.12M3 12h3M5.64 5.64l2.12 2.12" />
                </svg>
              </div>
              <p className="font-serif text-3xl italic text-ink/40 mb-3">The studio awaits its first signal</p>
              <p className="font-mono text-xs text-ink/25 uppercase tracking-widest text-center max-w-md leading-relaxed">
                Ideas, experiments, projects, and products will appear here as the pipeline grows.
              </p>
            </div>
          )}

          {filteredEntries.length === 0 && entries.length > 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-2 border-dashed border-subtle rounded-full flex items-center justify-center mb-4">?</div>
              <p className="font-serif text-2xl italic">No signals match this filter.</p>
              <button onClick={() => setFilter(DEFAULT_FILTER)} className="mt-4 font-mono text-xs underline hover:text-accent">
                RESET FILTER
              </button>
            </div>
          )}
        </div>
      )}

      {selectedEntry && <DetailModalSwitcher entry={selectedEntry} onClose={closeEntry} />}
    </>
  )
}
