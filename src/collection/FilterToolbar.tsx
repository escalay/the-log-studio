import { MaturityLevel, type FilterState } from '@/types'

export const FilterToolbar = ({ filter, setFilter }: { filter: FilterState; setFilter: (f: FilterState) => void }) => {
  const levels: { id: MaturityLevel | 'all'; label: string }[] = [
    { id: 'all', label: 'ALL FILES' },
    { id: MaturityLevel.L0, label: 'L0: NOTES' },
    { id: MaturityLevel.L1, label: 'L1: PROTOS' },
    { id: MaturityLevel.L2, label: 'L2: PROJECTS' },
    { id: MaturityLevel.L3, label: 'L3: PRODUCTS' },
  ]

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
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        System Online
      </div>
    </div>
  )
}
