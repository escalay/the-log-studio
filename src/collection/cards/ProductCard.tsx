import type { Entry } from '@/types'
import { RocketIcon } from '@/ui/Icons'

export const ProductCard = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group relative h-full bg-[#080808] border border-ink overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:shadow-hard"
  >
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10 p-5 flex justify-between items-start border-b border-white/5 group-hover:border-white/20 transition-colors">
      <div className="flex flex-col">
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 group-hover:text-accent transition-colors">Product ID</span>
        <span className="font-mono text-xs text-white font-bold tracking-wider">{entry.slug.toUpperCase()}</span>
      </div>
      <div className="bg-white/10 text-white/60 px-2 py-1 rounded-[1px] font-mono text-[9px] uppercase tracking-wider group-hover:bg-accent group-hover:text-white transition-colors">
        L3.Stable
      </div>
    </div>

    <div className="relative z-10 p-8 flex-1 flex flex-col justify-center">
      <div className="mb-6 w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20 group-hover:text-white group-hover:border-white/40 transition-all duration-300">
        <RocketIcon className="w-5 h-5" />
      </div>
      <h3 className="font-serif font-medium text-4xl text-white leading-[0.9] mb-4 group-hover:translate-x-1 transition-transform duration-300">
        {entry.title}
      </h3>
      <p className="font-sans text-sm text-white/50 leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors">
        {entry.description}
      </p>
    </div>

    <div className="relative z-10 mt-auto">
      <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10 bg-white/[0.02]">
        {entry.metrics?.slice(0, 2).map((m, i) => (
          <div key={i} className="p-3 text-center">
            <div className="font-mono text-[8px] text-white/30 uppercase mb-1">{m.label}</div>
            <div className="font-mono text-xs font-bold text-white group-hover:text-accent transition-colors">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="h-4 bg-white flex items-center justify-between px-1 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="flex h-full w-full gap-[2px] items-end pb-[2px]">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="bg-black" style={{ width: i % 3 === 0 ? '2px' : '1px', height: `${40 + (i * 7) % 60}%` }} />
          ))}
        </div>
        <div className="font-mono text-[8px] font-bold text-black ml-2 whitespace-nowrap">SCAN TO LAUNCH</div>
      </div>
    </div>

    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
  </div>
)
