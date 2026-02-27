import { useState, useEffect, useCallback } from 'react'
import type { Entry, MaturityLevel } from '@/types'
import { track } from '@/lib/analytics'
import { EntryList } from './EntryList'
import { EntryEditor } from './EntryEditor'
import { Plus, RefreshCw, ArrowLeft } from 'lucide-react'

export const AdminApp = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState<Entry | 'new' | null>(null)
  const [activeLevel, setActiveLevel] = useState<number | null>(null)

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/entries')
      if (res.ok) {
        const data = await res.json()
        setEntries(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        track('admin_entry_deleted', { entry_id: id })
        setEntries((prev) => prev.filter((e) => e.id !== id))
      }
    } catch {
      // silently fail
    }
  }

  const handleReset = async () => {
    if (!confirm('Factory Reset: This will wipe all data and restore seed entries. Continue?')) return

    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      if (res.ok) {
        track('admin_factory_reset')
        await fetchEntries()
      }
    } catch {
      // silently fail
    }
  }

  const handleEditorSaved = () => {
    setEditingEntry(null)
    fetchEntries()
  }

  // Editor view
  if (editingEntry) {
    return <EntryEditor entry={editingEntry === 'new' ? undefined : editingEntry} onClose={() => setEditingEntry(null)} onSaved={handleEditorSaved} />
  }

  // Stats
  const levelCounts = [0, 1, 2, 3].map((level) => entries.filter((e) => e.level === level).length)
  const latestDate = entries.length > 0 ? entries.reduce((latest, e) => (e.date > latest ? e.date : latest), entries[0].date) : 'N/A'

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </a>
          <div className="flex flex-col">
            <h1 className="font-mono font-bold uppercase tracking-widest text-sm">Studio Control</h1>
            <span className="text-[10px] text-white/40 font-mono">API_MODE: D1_CONNECTED</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors font-mono text-xs uppercase"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={() => setEditingEntry('new')}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-white hover:text-accent transition-colors font-mono text-xs font-bold uppercase"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Total Signals</div>
              <div className="text-3xl font-serif">{loading ? '—' : entries.length}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Projects (L2)</div>
              <div className="text-3xl font-serif">{loading ? '—' : levelCounts[2]}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Products (L3)</div>
              <div className="text-3xl font-serif text-accent">{loading ? '—' : levelCounts[3]}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Latest Update</div>
              <div className="text-xl font-serif text-white/60 truncate">{loading ? '—' : latestDate}</div>
            </div>
          </div>

          {/* Registry */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl">Registry</h2>
          </div>

          <div className="border border-white/10 bg-[#0a0a0a]">
            {loading ? (
              <div className="p-12 text-center text-white/30 font-mono">Loading...</div>
            ) : (
              <EntryList entries={entries} activeLevel={activeLevel} onSelectLevel={setActiveLevel} onEdit={setEditingEntry} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
