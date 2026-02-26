const parseLine = (text: string, handwritten: boolean) => {
  const parts = text.split(/(\*\*.*?\*\*|~~.*?~~)/g)
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2)
      return <strong key={j} className={handwritten ? 'handwritten-highlight text-ink font-normal' : 'font-bold bg-yellow-100 px-1 rounded-sm text-ink'}>{content}</strong>
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
      const content = part.slice(2, -2)
      return <span key={j} className={handwritten ? 'scribble-scratch' : 'line-through decoration-2 decoration-red-500'}>{content}</span>
    }
    return part
  })
}

export const MarkdownContent = ({ content, handwritten = false, inverted = false }: { content: string; handwritten?: boolean; inverted?: boolean }) => (
  <>
    {content.split('\n').map((line, i) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('## '))
        return <h3 key={i} className={`${handwritten ? 'font-hand text-2xl font-bold mt-6 mb-2 text-subtle uppercase' : `font-mono text-lg font-bold mt-8 mb-4 uppercase ${inverted ? 'text-white/60' : 'text-subtle'} tracking-wider`}`}>{trimmed.slice(3)}</h3>

      if (trimmed.startsWith('# '))
        return <h2 key={i} className={`${handwritten ? 'font-marker text-4xl mt-6 mb-2 text-ink/90 -rotate-1' : `font-serif text-4xl mt-8 mb-4 border-b-2 ${inverted ? 'border-white/20 text-white' : 'border-accent/20 text-ink'} pb-2 inline-block`}`}>{trimmed.slice(2)}</h2>

      if (trimmed.startsWith('* ') || trimmed.startsWith('- '))
        return <li key={i} className={`list-disc ml-5 mb-2 pl-2 ${handwritten ? 'font-hand text-xl marker:text-gray-400 text-ink' : `marker:text-accent font-sans ${inverted ? 'text-white/80' : 'text-ink'}`}`}>{parseLine(trimmed.replace(/^[*|-]\s/, ''), handwritten)}</li>

      if (trimmed.startsWith('[ ] '))
        return <div key={i} className={`flex items-center gap-2 mb-2 ${handwritten ? 'font-hand text-xl' : `font-mono text-sm ${inverted ? 'text-white/70' : 'text-ink'}`}`}>
          <div className={`w-4 h-4 border rounded-sm ${inverted ? 'border-white/40' : 'border-ink'} ${handwritten ? 'border-2 border-gray-400 rotate-2 rounded-md' : ''}`}></div>
          {parseLine(trimmed.replace('[ ] ', ''), handwritten)}
        </div>

      if (trimmed.startsWith('[x] '))
        return <div key={i} className={`flex items-center gap-2 mb-2 ${handwritten ? 'font-hand text-xl' : `font-mono text-sm ${inverted ? 'text-white/70' : 'text-ink'}`}`}>
          <div className={`w-4 h-4 bg-accent border border-accent rounded-sm flex items-center justify-center text-white text-[10px] ${handwritten ? 'bg-transparent border-2 border-ink text-ink rotate-1' : ''}`}>{handwritten ? 'x' : '✓'}</div>
          <span className="line-through opacity-50">{parseLine(trimmed.replace('[x] ', ''), handwritten)}</span>
        </div>

      if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
        return <div key={i} className={`${handwritten ? 'font-pen text-xl bg-gray-100/50 p-2 -rotate-1 mx-2' : `${inverted ? 'bg-white/10 text-white/90 border-white/10' : 'bg-level-0 text-ink border-line'} p-4 font-mono text-xs border my-4`} whitespace-pre-wrap`}>{trimmed.replace(/`/g, '')}</div>
      }

      if (trimmed === '') return <div key={i} className="h-4" />

      return (
        <p key={i} className={`mb-4 leading-relaxed ${handwritten ? 'font-hand text-2xl text-ink/85' : `${inverted ? 'text-white/70' : 'text-ink/80'} font-sans`}`}>
          {parseLine(line, handwritten)}
        </p>
      )
    })}
  </>
)
