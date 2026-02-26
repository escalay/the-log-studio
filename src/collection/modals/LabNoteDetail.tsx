import { useState, useEffect } from 'react'
import type { Entry } from '@/types'
import { MarkdownContent } from '@/ui/MarkdownContent'
import { TapeStrip, DoodleStar, PaperHoles } from '@/ui/HandwrittenEffects'

interface PageData {
  id: string
  date: string
  content: string
  type: 'main' | 'update'
  tag?: string
  version?: string
}

export const LabNoteDetail = ({ entry, onClose }: { entry: Entry; onClose: () => void }) => {
  const [pages, setPages] = useState<PageData[]>([])
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const allPages: PageData[] = [
      { id: 'main', date: entry.date, content: entry.content, type: 'main' },
      ...(entry.updates || []).map((u, i) => ({
        id: `upd-${i}`,
        date: u.date,
        content: u.content,
        type: 'update' as const,
        tag: u.type,
        version: u.version,
      })),
    ]
    setPages(allPages)
  }, [entry])

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFlipping || pages.length <= 1) return
    setIsFlipping(true)
    setTimeout(() => {
      setPages((prev) => {
        const newPages = [...prev]
        const top = newPages.shift()
        if (top) newPages.push(top)
        return newPages
      })
      setIsFlipping(false)
    }, 250)
  }

  if (pages.length === 0) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-500 animate-fade-in" onClick={onClose} />

      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-12 z-[100] pointer-events-auto text-white font-hand text-2xl md:text-3xl hover:scale-110 transition-transform drop-shadow-md">
          (close)
        </button>

        <div className="relative w-[90vw] md:w-[600px] h-[70vh] md:h-[800px] max-h-[85dvh] perspective-1000 pointer-events-auto" onClick={handleFlip}>
          {pages.map((page, index) => {
            if (index > 2) return null
            const isTop = index === 0

            let transform = ''
            let opacity = 1
            const zIndex = 50 - index

            if (isTop) {
              transform = isFlipping ? 'translate(120%, 10%) rotate(15deg)' : 'translate(0, 0) rotate(0deg)'
            } else {
              const rotation = index % 2 === 0 ? 3 : -2
              transform = `translate(${index * 4}px, ${index * 4}px) rotate(${rotation}deg) scale(${1 - index * 0.02})`
              opacity = 1 - index * 0.1
            }

            return (
              <div
                key={page.id}
                className="absolute inset-0 bg-[#fdfbf7] shadow-paper rounded-sm flex flex-col overflow-hidden border border-gray-300 transition-all duration-300 ease-in-out cursor-pointer origin-bottom-left"
                style={{ zIndex, transform, opacity }}
              >
                <div className="absolute inset-0 bg-lined-paper opacity-50 pointer-events-none" />
                <PaperHoles />
                {index === 0 && <TapeStrip className="absolute -top-3 left-1/3 w-32" rotation={-2} />}
                {index === 1 && <TapeStrip className="absolute top-1/2 -right-4 w-24" rotation={85} />}

                {page.type === 'update' && (
                  <div className="absolute top-8 right-8 z-10 pointer-events-none opacity-80 mix-blend-multiply transform rotate-12">
                    <div className="border-[3px] border-red-500 px-3 py-1 rounded-sm">
                      <div className="font-marker text-red-500 text-xl md:text-2xl leading-none">UPDATE</div>
                      {page.version && <div className="font-mono text-[8px] text-red-500 text-center font-bold tracking-widest">{page.version}</div>}
                    </div>
                  </div>
                )}

                <div className="relative z-10 p-6 md:p-12 h-full flex flex-col">
                  <div className="mb-6 font-hand text-gray-500 text-lg md:text-xl border-b border-gray-300 border-dashed pb-2 flex justify-between items-end">
                    <span>{page.date}</span>
                    {page.tag && (
                      <span className="font-mono text-[10px] bg-gray-100/80 px-2 py-0.5 rounded-sm border border-gray-300 text-gray-500 uppercase tracking-widest">
                        {page.tag}
                      </span>
                    )}
                  </div>

                  {page.type === 'update' ? (
                    <h2 className="font-marker text-3xl md:text-5xl mb-6 text-ink leading-[0.9]">Update: {page.date}</h2>
                  ) : (
                    <h2 className="font-marker text-3xl md:text-5xl mb-6 text-ink leading-[0.9]">{entry.title}</h2>
                  )}

                  <div className="flex-1 overflow-y-auto relative pr-2">
                    <MarkdownContent content={page.content} handwritten={true} />
                    <div className="mt-8 mb-4 font-hand text-2xl text-gray-300 transform -rotate-2 select-none">(end of note)</div>
                    {page.type === 'main' && (
                      <DoodleStar className="absolute bottom-20 right-0 md:right-10 w-16 h-16 text-blue-400 opacity-60 rotate-12" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {pages.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none">
              <div className="bg-ink text-white px-4 py-2 rounded-full font-mono text-[10px] md:text-xs shadow-lg animate-bounce opacity-90">
                Tap stack to flip
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
