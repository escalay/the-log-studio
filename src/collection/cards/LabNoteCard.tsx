import type { Entry } from '@/types'

export const LabNoteCard = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group relative h-full bg-[#fefce8] border-r border-b border-ink/80 p-6 cursor-pointer hover:shadow-hard hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
  >
    <div className="absolute inset-0 bg-lined-paper opacity-50 pointer-events-none" />
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/80 rotate-2 shadow-sm border border-yellow-300 z-10" />

    <div className="relative z-10 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className="font-serif italic text-2xl text-ink/80 opacity-60">#{entry.id.split('-')[1]}</span>
        <div className="font-mono text-[10px] text-ink border border-ink px-1 rounded-full">L0</div>
      </div>

      <h3 className="font-handwriting font-serif font-medium text-3xl leading-none text-ink mb-4 group-hover:text-accent transition-colors">
        {entry.title}
      </h3>

      <p className="font-serif italic text-lg text-ink/70 leading-relaxed line-clamp-4">
        "{entry.description}"
      </p>

      <div className="mt-auto pt-6 flex justify-between items-end">
        <span className="font-mono text-[9px] uppercase tracking-widest text-subtle">{entry.date}</span>
        <span className="font-mono text-[9px] uppercase text-ink underline">{'Read Note ->'}</span>
      </div>
    </div>
  </div>
)
