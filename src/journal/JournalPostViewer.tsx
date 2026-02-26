import { useEffect } from 'react'
import type { JournalEntry, JournalBlock } from '@/types'
import { ArrowLeft } from '@/ui/Icons'
import { MarkdownContent } from '@/ui/MarkdownContent'
import { BarChart, ListHighlight } from './custom/CustomComponents'

const renderBlock = (block: JournalBlock, index: number) => {
  switch (block.type) {
    case 'markdown':
      return (
        <div key={index} className="prose prose-lg max-w-none font-serif text-ink mb-8 leading-relaxed">
          <MarkdownContent content={block.content} />
        </div>
      )
    case 'pull-quote':
      return (
        <blockquote key={index} className="border-l-4 border-accent pl-6 my-12 font-serif text-3xl md:text-4xl italic text-ink/90 leading-tight">
          "{block.content}"
        </blockquote>
      )
    case 'image':
      return (
        <figure key={index} className="my-12 -mx-4 md:-mx-12">
          <img src={block.content} alt="Journal asset" className="w-full h-auto border-y border-ink grayscale hover:grayscale-0 transition-all duration-700" />
        </figure>
      )
    case 'component':
      try {
        const props = JSON.parse(block.content)
        if (block.componentName === 'BarChart') return <BarChart key={index} {...props} />
        if (block.componentName === 'ListHighlight') return <ListHighlight key={index} {...props} />
        return null
      } catch {
        return null
      }
    default:
      return null
  }
}

export const JournalPostViewer = ({ post, onClose }: { post: JournalEntry; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[60] bg-paper overflow-y-auto animate-fade-in custom-scrollbar">
      <div className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink flex items-center justify-between px-4 md:px-8 h-16">
        <button onClick={onClose} className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Register
        </button>
        <div className="font-serif italic hidden md:block">{post.title}</div>
        <div className="font-mono text-[10px] bg-ink text-white px-2 py-1">{post.readTime}</div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <header className="mb-16 text-center">
          <div className="flex justify-center gap-4 font-mono text-xs text-subtle uppercase tracking-widest mb-6">
            <span>{post.quarter}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-[0.9] text-ink">{post.title}</h1>
          <p className="font-sans text-xl md:text-2xl text-subtle leading-relaxed max-w-xl mx-auto border-b border-accent/20 pb-8">{post.subtitle}</p>
        </header>

        <div className="journal-content">
          {post.blocks.map((block, i) => renderBlock(block, i))}
        </div>

        <footer className="mt-24 pt-12 border-t border-ink flex flex-col items-center">
          <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center font-serif font-bold text-2xl mb-4">E.</div>
          <p className="font-mono text-xs uppercase tracking-widest">End of Record</p>
        </footer>
      </article>
    </div>
  )
}
