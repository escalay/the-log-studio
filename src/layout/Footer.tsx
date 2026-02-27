import { useState, useRef, useEffect } from 'react'
import { track } from '@/lib/analytics'

const AXIOMS = [
  'Simplicity is the ultimate sophistication.',
  'Form follows function.',
  'Constraints breed creativity.',
  'Ship early, ship often.',
  'Perfect is the enemy of good.',
  'Data beats opinion.',
  'Delete code.',
  'It works on my machine.',
]

export const Footer = () => {
  const [activeReceipt, setActiveReceipt] = useState<{ id: number; text: string } | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const hideTimerRef = useRef<number | null>(null)
  const transitionTimerRef = useRef<number | null>(null)

  const scheduleAutoHide = () => {
    hideTimerRef.current = window.setTimeout(() => {
      setShowReceipt(false)
      transitionTimerRef.current = window.setTimeout(() => {
        setActiveReceipt(null)
      }, 300)
    }, 2000)
  }

  const printReceipt = () => {
    const newText = AXIOMS[Math.floor(Math.random() * AXIOMS.length)]
    track('footer_receipt_printed', { axiom_text: newText })
    const newReceipt = { id: Date.now(), text: newText }

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)

    if (showReceipt) {
      setShowReceipt(false)
      transitionTimerRef.current = window.setTimeout(() => {
        setActiveReceipt(newReceipt)
        requestAnimationFrame(() => {
          setShowReceipt(true)
          scheduleAutoHide()
        })
      }, 300)
    } else {
      setActiveReceipt(newReceipt)
      requestAnimationFrame(() => {
        setShowReceipt(true)
        scheduleAutoHide()
      })
    }
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  return (
    <footer className="relative z-20 bg-ink text-white border-t-4 border-accent">
      <div className="absolute bottom-full left-0 w-full pointer-events-none flex flex-col items-center justify-end overflow-hidden h-[500px] z-20 pb-0">
        {activeReceipt && (
          <div
            className={`
              bg-white text-ink w-64 max-w-[90vw] p-4 font-mono text-xs shadow-lg relative border-b-2 border-dashed border-gray-300
              transition-all duration-300 ease-cubic-out origin-bottom
              ${showReceipt ? 'translate-y-0 opacity-100 rotate-1' : 'translate-y-[120%] opacity-0 rotate-0'}
            `}
          >
            <div className="text-center border-b border-black pb-2 mb-2">
              ESCALAY LOG
              <br />
              {new Date(activeReceipt.id).toLocaleTimeString()}
            </div>
            <div className="text-center font-bold text-sm py-2">"{activeReceipt.text}"</div>
            <div className="mt-4 text-[8px] text-center uppercase tracking-widest text-gray-500">
              *** END OF TRANSMISSION ***
            </div>
            <div
              className="absolute -bottom-1 left-0 right-0 h-2 bg-white"
              style={{
                maskImage:
                  'linear-gradient(45deg, transparent 33.33%, #000 33.33%, #000 66.66%, transparent 66.66%), linear-gradient(-45deg, transparent 33.33%, #000 33.33%, #000 66.66%, transparent 66.66%)',
                maskSize: '10px 20px',
                WebkitMaskImage:
                  'linear-gradient(45deg, transparent 33.33%, #000 33.33%, #000 66.66%, transparent 66.66%), linear-gradient(-45deg, transparent 33.33%, #000 33.33%, #000 66.66%, transparent 66.66%)',
                WebkitMaskSize: '10px 20px',
              }}
            />
          </div>
        )}
      </div>

      <div className="relative z-30 border-t border-white/20 bg-ink">
        <div className="container mx-auto grid md:grid-cols-4 border-x border-white/20">
          <div className="p-8 border-b md:border-b-0 md:border-r border-white/20">
            <div className="font-serif font-bold text-2xl mb-2">Escalay.Space</div>
            <a
              href="https://github.com/escalay/the-log-studio/releases"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('footer_link_clicked', { link_url: 'https://github.com/escalay/the-log-studio/releases' })}
              className="font-mono text-[10px] text-white/50 uppercase tracking-widest hover:text-accent transition-colors"
            >
              v{__APP_VERSION__}
            </a>
          </div>

          <div className="p-8 border-b md:border-b-0 md:border-r border-white/20 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-white/50">AUTHOR</span>
              <a href="https://abdallahaho.com" target="_blank" rel="noopener noreferrer" onClick={() => track('footer_link_clicked', { link_url: 'https://abdallahaho.com' })} className="hover:text-accent transition-colors">ABDALLAH OTHMAN</a>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">LOC</span>
              <span>HAMBURG, DE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">LIC</span>
              <span>MIT</span>
            </div>
          </div>

          <div
            onClick={printReceipt}
            className="p-8 border-b md:border-b-0 md:border-r border-white/20 cursor-pointer hover:bg-white/5 transition-colors group select-none"
          >
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
              <div className={`w-2 h-2 bg-accent rounded-full ${showReceipt ? '' : 'animate-pulse'}`} />
              System Log
            </div>
            <div className="font-mono text-xs text-white/70 group-hover:text-white">
              {'>'} Click to print diagnostic
              <br />
              {'>'} {showReceipt ? 'Printing...' : '_'}
            </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center bg-white/5 gap-2">
            <button
              className="bg-white text-ink font-mono text-xs font-bold uppercase px-6 py-3 hover:bg-accent hover:text-white transition-colors w-full"
              onClick={() => { track('footer_back_to_top'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              Back to Top ^
            </button>

          </div>
        </div>

        <div className="border-t border-white/20 p-2 text-center font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()}{' '}
          <a href="https://abdallahaho.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Abdallah Othman</a>
          {' '}&mdash; Hamburg, DE. No Refunds.
        </div>
      </div>
    </footer>
  )
}
