import { useState, useEffect, useCallback } from 'react'
import type { Entry, MaturityLevel, UpdateLog } from '@/types'
import { MarkdownContent } from '@/ui/MarkdownContent'
import { MarkdownEditor } from './MarkdownEditor'
import { Save, X, Eye, AlertTriangle, PlusCircle, Trash2, ArrowUpCircle } from 'lucide-react'

interface EntryEditorProps {
  entry?: Entry
  onClose: () => void
  onSaved: () => void
}

const LEVEL_OPTIONS = [
  { value: 0, label: 'L0 - Lab Note', type: 'note' },
  { value: 1, label: 'L1 - Experiment', type: 'experiment' },
  { value: 2, label: 'L2 - Project', type: 'project' },
  { value: 3, label: 'L3 - Product', type: 'product' },
] as const

const LOG_TYPE_COLORS: Record<string, string> = {
  fix: 'bg-red-400',
  feat: 'bg-green-400',
  release: 'bg-accent text-white',
  chore: 'bg-gray-400',
  init: 'bg-blue-400',
}

const makeDefaultEntry = (): Entry => ({
  id: `note-${Date.now()}`,
  slug: 'new-entry',
  title: 'Untitled Entry',
  description: '',
  level: 0 as MaturityLevel,
  type: 'note',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  content: '# New Idea\n\nWrite something brilliant.',
  updates: [],
})

export const EntryEditor = ({ entry, onClose, onSaved }: EntryEditorProps) => {
  const isNew = !entry
  const [formData, setFormData] = useState<Entry>(entry ?? makeDefaultEntry())
  const [tagInput, setTagInput] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [errors, setErrors] = useState<string[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showMobileSettings, setShowMobileSettings] = useState(false)

  // Update log form
  const [newLog, setNewLog] = useState({ type: 'chore' as UpdateLog['type'], content: '', version: '' })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleChange = (field: keyof Entry, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        handleChange('tags', [...formData.tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleAddLog = async () => {
    if (!newLog.content || isNew) return

    try {
      const postRes = await fetch(`/api/entries/${formData.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newLog.type,
          content: newLog.content,
          version: newLog.version || undefined,
        }),
      })

      if (!postRes.ok) {
        setErrors(['Failed to append update log'])
        return
      }

      // Refresh updates
      const res = await fetch(`/api/entries/${formData.id}/updates`)
      if (!res.ok) throw new Error('Failed to fetch updates')
      const updates = await res.json()
      setFormData((prev) => ({ ...prev, updates }))
      setNewLog({ type: 'chore', content: '', version: '' })
    } catch {
      setErrors(['Failed to append update log'])
    }
  }

  const handlePromote = async (newLevel: number) => {
    if (isNew) return
    try {
      const res = await fetch(`/api/entries/${formData.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel }),
      })
      if (res.ok) {
        const updated = await res.json()
        setFormData(updated)
      }
    } catch {
      setErrors(['Failed to promote entry'])
    }
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setErrors([])

    try {
      const { updates, ...payload } = formData

      if (isNew) {
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          setErrors([err.error?.toString() ?? 'Failed to create entry'])
          return
        }
      } else {
        const res = await fetch(`/api/entries/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          setErrors([err.error?.toString() ?? 'Failed to update entry'])
          return
        }
      }

      setIsDirty(false)
      onSaved()
    } catch {
      setErrors(['Network error'])
    } finally {
      setSaving(false)
    }
  }, [formData, isNew, onSaved])

  const nextLevel = formData.level < 3 ? formData.level + 1 : null

  return (
    <div className="fixed inset-0 bg-[#0f0f0f] z-[60] flex flex-col font-sans text-white">
      {/* Toolbar */}
      <div className="h-16 border-b border-white/10 bg-[#161616] px-4 md:px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-white/50 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="bg-transparent text-lg font-bold font-sans focus:outline-none w-40 md:w-96 placeholder:text-white/20 truncate"
            placeholder="Entry Title"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* View Toggle */}
          <div className="hidden md:flex bg-black p-1 rounded-sm border border-white/10 mr-4">
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1 text-xs font-mono uppercase rounded-[1px] transition-colors ${mode === 'edit' ? 'bg-white text-black font-bold' : 'text-white/50 hover:text-white'}`}
            >
              Writer
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-3 py-1 text-xs font-mono uppercase rounded-[1px] transition-colors ${mode === 'preview' ? 'bg-white text-black font-bold' : 'text-white/50 hover:text-white'}`}
            >
              Split View
            </button>
          </div>

          {/* Mobile Settings Toggle */}
          <button
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className={`lg:hidden p-2 transition-colors ${showMobileSettings ? 'text-accent' : 'text-white/50'}`}
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Promote button */}
          {!isNew && nextLevel !== null && (
            <button
              onClick={() => handlePromote(nextLevel)}
              className="hidden md:flex items-center gap-2 px-4 py-2 border border-accent/50 text-accent hover:bg-accent hover:text-white transition-colors font-mono text-xs uppercase"
              title={`Promote to L${nextLevel}`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>L{nextLevel}</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-black font-mono text-xs font-bold uppercase hover:bg-accent hover:text-white transition-colors disabled:opacity-50 ${isDirty ? 'ring-2 ring-accent ring-offset-2 ring-offset-black' : ''}`}
          >
            <Save className="w-4 h-4" /> <span className="hidden md:inline">{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Settings Sidebar */}
        {showMobileSettings && (
          <div className="absolute inset-0 bg-black/80 z-30 lg:hidden" onClick={() => setShowMobileSettings(false)} />
        )}

        <div
          className={`
            w-80 border-r border-white/10 bg-[#111] overflow-y-auto flex flex-col p-6 gap-8 shrink-0
            fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:transform-none lg:z-auto
            ${showMobileSettings ? 'translate-x-0 top-16 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase text-white/40 tracking-widest font-bold">Metadata</h3>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-white/30">ID</label>
              <input disabled value={formData.id} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-white/50" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-white/30">Slug</label>
              <input
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-accent focus:border-accent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-white/30">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-accent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-white/30">Maturity Level</label>
              <select
                value={formData.level}
                onChange={(e) => {
                  const level = parseInt(e.target.value)
                  handleChange('level', level)
                  handleChange('type', LEVEL_OPTIONS[level].type)
                }}
                className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-accent outline-none"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-white/30">Link (optional)</label>
              <input
                value={formData.link ?? ''}
                onChange={(e) => handleChange('link', e.target.value || undefined)}
                placeholder="https://..."
                className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-accent outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase text-white/40 tracking-widest font-bold">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/10 rounded-sm text-[10px] font-mono flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleChange('tags', formData.tags.filter((t) => t !== tag))} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag + Enter"
              className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-accent outline-none"
            />
          </div>

          {/* Add Log (only for existing entries) */}
          {!isNew && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-mono text-xs uppercase text-white/40 tracking-widest font-bold flex items-center gap-2">
                <PlusCircle className="w-3 h-3" /> Add Log
              </h3>
              <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-3">
                <div className="flex gap-2">
                  <select
                    className="bg-black border border-white/10 text-[10px] font-mono uppercase px-2 py-1 focus:border-accent outline-none flex-1"
                    value={newLog.type}
                    onChange={(e) => setNewLog({ ...newLog, type: e.target.value as UpdateLog['type'] })}
                  >
                    <option value="chore">Chore</option>
                    <option value="feat">Feat</option>
                    <option value="fix">Fix</option>
                    <option value="release">Release</option>
                    <option value="init">Init</option>
                  </select>
                  <input
                    placeholder="v1.0"
                    className="bg-black border border-white/10 text-[10px] font-mono px-2 py-1 w-16 focus:border-accent outline-none"
                    value={newLog.version}
                    onChange={(e) => setNewLog({ ...newLog, version: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="What changed?"
                  className="w-full bg-black border border-white/10 p-2 text-xs font-mono h-20 focus:border-accent outline-none resize-none"
                  value={newLog.content}
                  onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                />
                <button
                  onClick={handleAddLog}
                  disabled={!newLog.content}
                  className="w-full bg-white/10 hover:bg-white text-white hover:text-black py-2 text-[10px] font-mono uppercase font-bold transition-colors disabled:opacity-50"
                >
                  Append Update
                </button>
              </div>
            </div>
          )}

          {/* History */}
          {formData.updates && formData.updates.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-mono text-xs uppercase text-white/40 tracking-widest font-bold flex justify-between">
                <span>History</span>
                <span>{formData.updates.length}</span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 technical-scrollbar">
                {[...formData.updates].reverse().map((u, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-sm border border-white/5 text-[10px] font-mono hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/50">{u.date}</span>
                      <span className={`px-1 rounded-[1px] text-black font-bold uppercase ${LOG_TYPE_COLORS[u.type] ?? 'bg-gray-400'}`}>{u.type}</span>
                    </div>
                    <div className="text-white/80 leading-tight break-words">{u.content}</div>
                    {u.version && <div className="mt-1 text-white/30">v{u.version}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-sm">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-2">
                <AlertTriangle className="w-3 h-3" /> Errors
              </div>
              <ul className="list-disc pl-4 text-[10px] text-red-400 space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Editor / Preview Pane */}
        <div className="flex-1 flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden relative">
          {/* Input Area */}
          <div className={`flex-1 flex flex-col h-full ${mode === 'preview' ? 'hidden md:flex md:w-1/2 border-r border-white/10' : 'w-full'}`}>
            <div className="p-6 pb-0">
              <label className="block font-mono text-[10px] uppercase text-white/30 mb-2">Abstract / Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full bg-[#111] text-white/80 p-4 text-sm font-sans border border-white/10 focus:border-accent outline-none rounded-sm resize-none h-24 leading-relaxed"
                placeholder="Brief summary of the entry..."
              />
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <label className="block font-mono text-[10px] uppercase text-white/30 mb-2">Markdown Content</label>
              <MarkdownEditor value={formData.content} onChange={(v) => handleChange('content', v)} onSave={handleSave} />
              <div className="mt-2 text-right font-mono text-[10px] text-white/20">{formData.content.length} chars</div>
            </div>
          </div>

          {/* Preview Pane */}
          {mode === 'preview' && (
            <div className="flex-1 bg-black overflow-y-auto technical-scrollbar p-8 lg:p-12 relative">
              <div className="absolute top-0 right-0 p-2 bg-black border-b border-l border-white/10 z-10 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                Live Preview
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <h1 className="font-serif text-4xl mb-6">{formData.title}</h1>
                <MarkdownContent content={formData.content} inverted={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
