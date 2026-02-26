import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Entry, FilterState } from '@/types'
import { FilterToolbar } from './FilterToolbar'
import { EntryCardSwitcher } from './EntryCardSwitcher'
import { DetailModalSwitcher } from './DetailModalSwitcher'

const getEntryParam = () => new URLSearchParams(window.location.search).get('entry')

const setEntryParam = (entryId: string | null) => {
  const url = new URL(window.location.href)
  if (entryId) {
    url.searchParams.set('entry', entryId)
  } else {
    url.searchParams.delete('entry')
  }
  window.history.pushState({}, '', url.pathname + url.search)
}

export const CollectionApp = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [filter, setFilter] = useState<FilterState>({ level: 'all', tag: null })
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const openEntry = useCallback((entry: Entry) => {
    setSelectedEntry(entry)
    setEntryParam(entry.id)
  }, [])

  const closeEntry = useCallback(() => {
    setSelectedEntry(null)
    setEntryParam(null)
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const id = getEntryParam()
      if (id) {
        const entry = entries.find((e) => e.id === id)
        if (entry) setSelectedEntry(entry)
        else setSelectedEntry(null)
      } else {
        setSelectedEntry(null)
      }
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

        const id = getEntryParam()
        if (id) {
          const entry = data.find((e) => e.id === id)
          if (entry) setSelectedEntry(entry)
        }
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filter.level !== 'all' && entry.level !== filter.level) return false
      if (filter.tag && !entry.tags.includes(filter.tag)) return false
      return true
    })
  }, [filter, entries])

  return (
    <>
      <FilterToolbar filter={filter} setFilter={setFilter} entries={entries} />

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

          {filteredEntries.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center border-b border-ink">
              <div className="w-16 h-16 border-2 border-dashed border-subtle rounded-full flex items-center justify-center mb-4">?</div>
              <p className="font-serif text-2xl italic">No signals found.</p>
              <button onClick={() => setFilter({ level: 'all', tag: null })} className="mt-4 font-mono text-xs underline hover:text-accent">
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
