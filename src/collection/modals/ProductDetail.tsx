import { useState } from 'react'
import type { Entry } from '@/types'
import { track } from '@/lib/analytics'
import { MarkdownContent } from '@/ui/MarkdownContent'
import { ExternalLink, GlobeIcon, UsersIcon, TrendingUpIcon, ActivityIcon, CheckCircleIcon } from '@/ui/Icons'

export const ProductDetail = ({ entry, onClose }: { entry: Entry; onClose: () => void }) => {
  const [isMobileMetaExpanded, setIsMobileMetaExpanded] = useState(false)

  const getMetricIcon = (label: string) => {
    const l = label.toLowerCase()
    if (l.includes('user') || l.includes('customers')) return <UsersIcon className="w-4 h-4" />
    if (l.includes('mrr') || l.includes('revenue') || l.includes('growth')) return <TrendingUpIcon className="w-4 h-4" />
    if (l.includes('uptime') || l.includes('latency')) return <ActivityIcon className="w-4 h-4" />
    return <GlobeIcon className="w-4 h-4" />
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative w-full h-full lg:max-w-[1400px] lg:h-[90vh] bg-[#0a0a0a] text-white shadow-2xl flex flex-col overflow-hidden animate-slide-up lg:rounded-[4px] border border-white/10">
        <div className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 relative z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-serif font-bold text-lg rounded-[2px]">{entry.title.charAt(0)}</div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg leading-none">{entry.title}</span>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{entry.slug}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono uppercase rounded-[2px]">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />Live Production
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {entry.link && (
              <a href={entry.link} target="_blank" rel="noreferrer" onClick={() => track('deployment_link_clicked', { entry_id: entry.id, entry_title: entry.title, entry_level: entry.level, link_url: entry.link! })} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase hover:bg-accent hover:text-white transition-colors">
                Visit Site <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white transition-colors">✕</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <div className="flex-1 overflow-y-auto technical-scrollbar bg-[#0a0a0a] relative order-1 flex flex-col">
            <div className="relative px-6 py-12 lg:p-16 border-b border-white/10 overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-20 pointer-events-none"><div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" /></div>
              <div className="relative z-10 max-w-4xl mx-auto w-full">
                <div className="inline-block px-3 py-1 mb-6 border border-accent text-accent font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Market Ready /// L3</div>
                <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-[0.9] mb-8 tracking-tight">{entry.title}.</h1>
                <p className="font-sans text-xl text-white/70 leading-relaxed border-l-2 border-white/20 pl-6">{entry.description}</p>
              </div>
            </div>
            <div className="p-6 lg:p-16 max-w-4xl mx-auto w-full flex-1">
              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-accent prose-blockquote:border-l-accent prose-code:text-accent prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-sm pb-24">
                <MarkdownContent content={entry.content} inverted={true} />
              </div>
            </div>
            <div className="lg:hidden p-4 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md shrink-0">
              {entry.link && (
                <a href={entry.link} target="_blank" rel="noreferrer" onClick={() => track('deployment_link_clicked', { entry_id: entry.id, entry_title: entry.title, entry_level: entry.level, link_url: entry.link! })} className="flex items-center justify-center w-full py-4 bg-accent text-white font-mono font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,79,0,0.4)]">Launch Application</a>
              )}
            </div>
          </div>

          <div className={`w-full lg:w-[450px] xl:w-[500px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shrink-0 order-2 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMetaExpanded ? 'h-[60vh]' : 'h-14'} lg:h-full border-t border-white/10 lg:border-t-0`}>
            <div className="lg:hidden flex items-center justify-between p-4 bg-[#111] border-b border-white/10 cursor-pointer shrink-0" onClick={() => { const next = !isMobileMetaExpanded; track('product_meta_toggled', { entry_id: entry.id, expanded: next }); setIsMobileMetaExpanded(next) }}>
              <div className="flex items-center gap-2"><ActivityIcon className="w-4 h-4 text-accent" /><span className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Live Metrics</span></div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 transition-opacity duration-200 ${isMobileMetaExpanded ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                  <span className="font-mono text-[9px] uppercase font-bold text-white/80 tracking-wider">Online</span>
                </div>
                <div className={`transform transition-transform duration-300 ${isMobileMetaExpanded ? 'rotate-180' : 'rotate-0'}`}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-white/50"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            <div className={`flex-1 overflow-y-auto technical-scrollbar transition-opacity duration-300 ${isMobileMetaExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
              <div className="grid grid-cols-2 gap-px bg-white/10 border-b border-white/10">
                {entry.metrics?.map((m, i) => (
                  <div key={i} className="bg-[#111] p-6 group hover:bg-[#161616] transition-colors relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 text-white/30 group-hover:text-accent transition-colors">
                      <span className="font-mono text-[10px] uppercase tracking-widest">{m.label}</span>
                      {getMetricIcon(m.label)}
                    </div>
                    <div className="font-sans text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{m.value}</div>
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
                {(!entry.metrics || entry.metrics.length === 0) && (
                  <div className="col-span-2 p-8 text-center text-white/30 font-mono text-xs italic">Connecting to telemetry stream...</div>
                )}
              </div>
              <div className="p-8 flex-1">
                <h3 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2"><ActivityIcon className="w-3 h-3" /> Release Log</h3>
                <div className="relative border-l border-white/10 ml-3 space-y-8 pb-8">
                  {entry.updates?.slice().reverse().map((u, i) => (
                    <div key={i} className="relative pl-8 group">
                      <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-[#0f0f0f] shadow-[0_0_0_2px_#333] transition-colors ${i === 0 ? 'bg-accent shadow-[0_0_0_2px_#FF4F00] animate-pulse' : 'bg-[#333] group-hover:bg-white'}`} />
                      <div className="flex flex-col">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className={`font-mono text-xs font-bold ${i === 0 ? 'text-white' : 'text-white/60'}`}>{u.version || 'UPDATE'}</span>
                          <span className="font-mono text-[10px] text-white/30">{u.date}</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed group-hover:text-white transition-colors">{u.content}</p>
                        {u.type === 'release' && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[9px] text-accent uppercase font-bold tracking-wider"><CheckCircleIcon className="w-3 h-3" /> Milestone Reached</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 border-t border-white/10 bg-[#0a0a0a]">
                <h3 className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Architecture</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:text-white hover:border-white/40 transition-colors cursor-default">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block h-8 bg-accent text-white overflow-hidden border-t border-white/10 shrink-0 relative z-20">
          <div className="h-full flex items-center animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>System Optimal</span><span>///</span><span>Revenue: Tracking</span><span>///</span><span>Uptime: 99.99%</span><span>///</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
