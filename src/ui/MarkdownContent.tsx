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

const parseTable = (lines: string[], startIdx: number, inverted: boolean) => {
  const rows: string[][] = []
  let i = startIdx

  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const cells = lines[i].trim().split('|').filter(c => c.trim() !== '')
    if (!cells.every(c => /^[\s-:]+$/.test(c))) {
      rows.push(cells.map(c => c.trim()))
    }
    i++
  }

  if (rows.length === 0) return { element: null, consumed: 0 }

  const header = rows[0]
  const body = rows.slice(1)

  return {
    element: (
      <div key={startIdx} className="my-6 overflow-x-auto">
        <table className={`w-full text-sm font-mono ${inverted ? 'text-white/80' : 'text-ink/80'}`}>
          <thead>
            <tr className={`border-b-2 ${inverted ? 'border-white/20' : 'border-ink/20'}`}>
              {header.map((cell, j) => (
                <th key={j} className={`text-left py-2 pr-4 font-bold uppercase tracking-wider text-xs ${inverted ? 'text-white/50' : 'text-subtle'}`}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, j) => (
              <tr key={j} className={`border-b ${inverted ? 'border-white/10' : 'border-ink/10'}`}>
                {row.map((cell, k) => (
                  <td key={k} className="py-2 pr-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    consumed: i - startIdx,
  }
}

export const MarkdownContent = ({ content, handwritten = false, inverted = false }: { content: string; handwritten?: boolean; inverted?: boolean }) => {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    // Table: starts with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const { element, consumed } = parseTable(lines, i, inverted)
      if (element && consumed > 0) {
        elements.push(element)
        i += consumed
        continue
      }
    }

    if (trimmed.startsWith('## '))
      elements.push(<h3 key={i} className={`${handwritten ? 'font-hand text-2xl font-bold mt-6 mb-2 text-subtle uppercase' : `font-mono text-lg font-bold mt-8 mb-4 uppercase ${inverted ? 'text-white/60' : 'text-subtle'} tracking-wider`}`}>{trimmed.slice(3)}</h3>)

    else if (trimmed.startsWith('# '))
      elements.push(<h2 key={i} className={`${handwritten ? 'font-marker text-4xl mt-6 mb-2 text-ink/90 -rotate-1' : `font-serif text-4xl mt-8 mb-4 border-b-2 ${inverted ? 'border-white/20 text-white' : 'border-accent/20 text-ink'} pb-2 inline-block`}`}>{trimmed.slice(2)}</h2>)

    else if (trimmed.startsWith('* ') || trimmed.startsWith('- '))
      elements.push(<li key={i} className={`list-disc ml-5 mb-2 pl-2 ${handwritten ? 'font-hand text-xl marker:text-gray-400 text-ink' : `marker:text-accent font-sans ${inverted ? 'text-white/80' : 'text-ink'}`}`}>{parseLine(trimmed.replace(/^[*|-]\s/, ''), handwritten)}</li>)

    else if (trimmed.startsWith('[ ] '))
      elements.push(<div key={i} className={`flex items-center gap-2 mb-2 ${handwritten ? 'font-hand text-xl' : `font-mono text-sm ${inverted ? 'text-white/70' : 'text-ink'}`}`}>
        <div className={`w-4 h-4 border rounded-sm ${inverted ? 'border-white/40' : 'border-ink'} ${handwritten ? 'border-2 border-gray-400 rotate-2 rounded-md' : ''}`}></div>
        {parseLine(trimmed.replace('[ ] ', ''), handwritten)}
      </div>)

    else if (trimmed.startsWith('[x] '))
      elements.push(<div key={i} className={`flex items-center gap-2 mb-2 ${handwritten ? 'font-hand text-xl' : `font-mono text-sm ${inverted ? 'text-white/70' : 'text-ink'}`}`}>
        <div className={`w-4 h-4 bg-accent border border-accent rounded-sm flex items-center justify-center text-white text-[10px] ${handwritten ? 'bg-transparent border-2 border-ink text-ink rotate-1' : ''}`}>{handwritten ? 'x' : '✓'}</div>
        <span className="line-through opacity-50">{parseLine(trimmed.replace('[x] ', ''), handwritten)}</span>
      </div>)

    else if (trimmed.startsWith('`') && trimmed.endsWith('`'))
      elements.push(<div key={i} className={`${handwritten ? 'font-pen text-xl bg-gray-100/50 p-2 -rotate-1 mx-2' : `${inverted ? 'bg-white/10 text-white/90 border-white/10' : 'bg-level-0 text-ink border-line'} p-4 font-mono text-xs border my-4`} whitespace-pre-wrap`}>{trimmed.replace(/`/g, '')}</div>)

    else if (trimmed === '')
      elements.push(<div key={i} className="h-4" />)

    else
      elements.push(<p key={i} className={`mb-4 leading-relaxed ${handwritten ? 'font-hand text-2xl text-ink/85' : `${inverted ? 'text-white/70' : 'text-ink/80'} font-sans`}`}>{parseLine(lines[i], handwritten)}</p>)

    i++
  }

  return <>{elements}</>
}
