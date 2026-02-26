export const CoffeeStain = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={`pointer-events-none opacity-10 mix-blend-multiply ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M100,10 A90,90 0 1,1 10,100 A90,90 0 0,1 100,10" fill="none" stroke="#5D4037" strokeWidth="15" strokeDasharray="100 50" transform="rotate(25 100 100)"/>
    <path d="M100,15 A85,85 0 1,1 15,100 A85,85 0 0,1 100,15" fill="none" stroke="#5D4037" strokeWidth="2" strokeDasharray="20 10" opacity="0.5"/>
  </svg>
)

export const TapeStrip = ({ className, rotation = 2 }: { className?: string; rotation?: number }) => (
  <div
    className={`absolute h-8 bg-yellow-100/80 backdrop-blur-[1px] shadow-sm border-l border-r border-white/40 ${className}`}
    style={{
      transform: `rotate(${rotation}deg)`,
      maskImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqonyQpCASmAY4qo6IAB9zw28AmQtEAAAAABJRU5ErkJggg==)',
      width: '120px',
    }}
  />
)

export const DoodleStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 50 50" className={`pointer-events-none overflow-visible w-12 h-12 ${className}`}>
    <path d="M25 2 L30 18 L48 18 L34 28 L39 44 L25 34 L11 44 L16 28 L2 18 L20 18 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ strokeDasharray: '200', strokeDashoffset: '0' }} />
  </svg>
)

export const DoodleArrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" className={`pointer-events-none overflow-visible w-24 h-12 ${className}`}>
    <path d="M10 25 Q 50 5, 90 25 M 80 15 L 90 25 L 80 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PaperHoles = () => (
  <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly py-8 pointer-events-none z-20">
    <div className="w-4 h-4 rounded-full bg-ink/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
    <div className="w-4 h-4 rounded-full bg-ink/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
    <div className="w-4 h-4 rounded-full bg-ink/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
  </div>
)
