import type { Entry } from '@/types'
import { Edit3, Trash2 } from 'lucide-react'

interface EntryListProps {
  entries: Entry[]
  activeLevel: number | null
  onSelectLevel: (level: number | null) => void
  onEdit: (entry: Entry) => void
  onDelete: (id: string) => void
}

const LEVEL_DOT_COLORS = ['bg-gray-400', 'bg-blue-400', 'bg-yellow-400', 'bg-accent']
const LEVEL_LABELS = ['L0', 'L1', 'L2', 'L3']

export const EntryList = ({ entries, activeLevel, onSelectLevel, onEdit, onDelete }: EntryListProps) => {
  const counts = [0, 1, 2, 3].map((level) => entries.filter((e) => e.level === level).length)

  const filtered = activeLevel !== null ? entries.filter((e) => e.level === activeLevel) : entries

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this entry? This cannot be undone.')) {
      onDelete(id)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Level Filter Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => onSelectLevel(null)}
          className={`flex-1 py-3 font-mono text-[10px] uppercase transition-colors ${activeLevel === null ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
        >
          All ({entries.length})
        </button>
        {LEVEL_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => onSelectLevel(i)}
            className={`flex-1 py-3 font-mono text-[10px] uppercase transition-colors ${activeLevel === i ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            {label} ({counts[i]})
          </button>
        ))}
      </div>

      {/* Entry Rows */}
      <div className="flex-1 overflow-y-auto technical-scrollbar divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-white/30 font-mono text-xs">No entries found</div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onEdit(entry)}
              className="group flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${LEVEL_DOT_COLORS[entry.level]}`} />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-white/40 uppercase mb-0.5 flex gap-2">
                    <span>{entry.id}</span>
                    <span>—</span>
                    <span>{entry.type}</span>
                    <span>—</span>
                    <span>{entry.date}</span>
                  </div>
                  <h3 className="font-sans font-bold text-sm leading-tight truncate group-hover:text-accent transition-colors">{entry.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="hidden md:flex gap-1.5">
                  {entry.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-[9px] font-mono text-white/40 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(entry)
                  }}
                  className="p-1.5 text-white/20 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => handleDelete(entry.id, e)} className="p-1.5 text-white/20 hover:text-red-500 hover:bg-white/10 rounded-sm transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
