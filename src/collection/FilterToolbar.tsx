import { useState, useEffect } from 'react'
import { MaturityLevel, type FilterState, type Entry } from '@/types'

interface FilterToolbarProps {
  filter: FilterState
  setFilter: (f: FilterState) => void
  entries: Entry[]
}

export const FilterToolbar = ({ filter, setFilter, entries }: FilterToolbarProps) => {
  const [health, setHealth] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setHealth('error'))
  }, [])

  const countFor = (level: MaturityLevel) => entries.filter((e) => e.level === level).length
  const hasEntries = entries.length > 0

  const levels: { id: MaturityLevel | 'all'; label: string }[] = [
    { id: 'all', label: hasEntries ? `ALL FILES (${entries.length})` : 'ALL FILES' },
    { id: MaturityLevel.L0, label: hasEntries ? `L0: NOTES (${countFor(MaturityLevel.L0)})` : 'L0: NOTES' },
    { id: MaturityLevel.L1, label: hasEntries ? `L1: PROTOS (${countFor(MaturityLevel.L1)})` : 'L1: PROTOS' },
    { id: MaturityLevel.L2, label: hasEntries ? `L2: PROJECTS (${countFor(MaturityLevel.L2)})` : 'L2: PROJECTS' },
    { id: MaturityLevel.L3, label: hasEntries ? `L3: PRODUCTS (${countFor(MaturityLevel.L3)})` : 'L3: PRODUCTS' },
  ]

  const healthColor = health === 'ok' ? 'bg-green-500' : health === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  const healthLabel = health === 'ok' ? 'System Online' : health === 'error' ? 'System Error' : 'Checking...'

  return (
    <div className="border-b border-ink bg-paper p-4 md:px-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-14 z-40">
      <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
        {levels.map((l) => (
          <button
            key={String(l.id)}
            onClick={() => setFilter({ ...filter, level: l.id })}
            className={`whitespace-nowrap px-4 py-2 font-mono text-xs font-bold uppercase border transition-all duration-200 ${
              filter.level === l.id
                ? 'bg-ink text-white border-ink shadow-hard-sm'
                : 'bg-white text-ink border-ink hover:bg-level-0'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 font-mono text-[10px] text-subtle uppercase border border-line px-3 py-1 rounded-full bg-white">
        <span className={`w-2 h-2 rounded-full ${healthColor} ${health === 'ok' ? 'animate-pulse' : ''}`} />
        {healthLabel}
      </div>
    </div>
  )
}
