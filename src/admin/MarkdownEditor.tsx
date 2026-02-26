import { useState, useRef, useCallback, useEffect } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
}

const wrapSelection = (textarea: HTMLTextAreaElement, before: string, after: string) => {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.slice(start, end)

  // If already wrapped, unwrap
  const beforeStart = start - before.length
  const afterEnd = end + after.length
  if (
    beforeStart >= 0 &&
    afterEnd <= text.length &&
    text.slice(beforeStart, start) === before &&
    text.slice(end, afterEnd) === after
  ) {
    const newValue = text.slice(0, beforeStart) + selected + text.slice(afterEnd)
    return { value: newValue, selectionStart: beforeStart, selectionEnd: beforeStart + selected.length }
  }

  const newValue = text.slice(0, start) + before + selected + after + text.slice(end)
  return { value: newValue, selectionStart: start + before.length, selectionEnd: end + before.length }
}

export const MarkdownEditor = ({ value, onChange, onSave }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    setLineCount(value.split('\n').length)
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget

      // Cmd+S / Ctrl+S → save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
        return
      }

      // Cmd+B → bold
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        const result = wrapSelection(textarea, '**', '**')
        onChange(result.value)
        requestAnimationFrame(() => {
          textarea.selectionStart = result.selectionStart
          textarea.selectionEnd = result.selectionEnd
        })
        return
      }

      // Cmd+I → italic
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault()
        const result = wrapSelection(textarea, '*', '*')
        onChange(result.value)
        requestAnimationFrame(() => {
          textarea.selectionStart = result.selectionStart
          textarea.selectionEnd = result.selectionEnd
        })
        return
      }

      // Cmd+E → inline code
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        const result = wrapSelection(textarea, '`', '`')
        onChange(result.value)
        requestAnimationFrame(() => {
          textarea.selectionStart = result.selectionStart
          textarea.selectionEnd = result.selectionEnd
        })
        return
      }

      // Tab → indent
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = value.slice(0, start) + '  ' + value.slice(end)
        onChange(newValue)
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        })
        return
      }

      // Shift+Tab → outdent
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault()
        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf('\n', start - 1) + 1
        const linePrefix = value.slice(lineStart, start)
        if (linePrefix.startsWith('  ')) {
          const newValue = value.slice(0, lineStart) + value.slice(lineStart + 2)
          onChange(newValue)
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(start - 2, lineStart)
          })
        }
        return
      }
    },
    [value, onChange, onSave],
  )

  return (
    <div className="flex-1 flex border border-white/10 rounded-sm bg-[#111] overflow-hidden relative group">
      {/* Line numbers */}
      <div className="w-12 bg-white/[0.02] border-r border-white/5 py-6 select-none overflow-hidden shrink-0">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="px-2 text-right font-mono text-[10px] text-white/15 leading-6">
            {i + 1}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent p-6 font-mono text-sm leading-6 text-white/90 resize-none focus:outline-none technical-scrollbar selection:bg-accent/30 selection:text-white"
        placeholder="# Write here..."
        spellCheck={false}
      />

      {/* Keyboard hints */}
      <div className="absolute bottom-2 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {['⌘B Bold', '⌘I Italic', '⌘E Code', '⌘S Save'].map((hint) => (
          <span key={hint} className="font-mono text-[9px] text-white/20">
            {hint}
          </span>
        ))}
      </div>
    </div>
  )
}
