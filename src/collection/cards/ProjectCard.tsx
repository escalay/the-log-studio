import type { Entry } from '@/types'
import { CheckCircleIcon } from '@/ui/Icons'

export const ProjectCard = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group relative h-full bg-white border-r border-b border-ink cursor-pointer hover:shadow-hard transition-all duration-200 flex flex-col"
  >
    <div className="flex items-end px-4 pt-4 border-b border-ink bg-level-0">
      <div className="px-4 py-1 border-t border-l border-r border-ink bg-white rounded-t-sm -mb-[1px] font-mono text-xs font-bold">
        {entry.slug}.git
      </div>
    </div>

    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-sans font-bold text-2xl group-hover:text-accent transition-colors">
          {entry.title}
        </h3>
        <CheckCircleIcon className="w-5 h-5 text-ink opacity-20 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="font-sans text-sm text-subtle leading-relaxed mb-6 line-clamp-3">
        {entry.description}
      </p>

      <div className="mt-auto">
        <div className="font-mono text-[10px] text-subtle uppercase mb-2">Stack</div>
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 3).map((t) => (
            <span key={t} className="border border-ink px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-level-0">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
)
