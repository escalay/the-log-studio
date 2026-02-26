import { useState, useMemo } from 'react'
import type { Entry } from '@/types'
import { MarkdownContent } from '@/ui/MarkdownContent'
import { BookIcon, TerminalIcon, BoxIcon, BeakerIcon } from '@/ui/Icons'

type TabView = 'overview' | 'files' | 'commits'

interface MockFile {
  name: string
  type: 'file' | 'folder'
  icon: React.ReactNode
  content?: string
  language?: string
}

export const ProjectDetail = ({ entry, onClose }: { entry: Entry; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<TabView>('overview')
  const [selectedFile, setSelectedFile] = useState<string>('README.md')
  const [expandedCommit, setExpandedCommit] = useState<number | null>(null)

  const files: MockFile[] = useMemo(() => [
    { name: 'README.md', type: 'file', icon: <BookIcon className="w-3 h-3 text-accent" />, language: 'markdown' },
    { name: 'package.json', type: 'file', icon: <TerminalIcon className="w-3 h-3 text-subtle" />, language: 'json', content: JSON.stringify({ name: entry.slug, version: entry.updates?.[entry.updates.length - 1]?.version || '0.1.0', description: entry.description, scripts: { start: 'node dist/index.js', dev: 'nodemon src/index.ts', test: 'jest' }, dependencies: Object.fromEntries(entry.tags.map((t) => [t, 'latest'])), license: 'MIT' }, null, 2) },
    { name: 'src', type: 'folder', icon: <BoxIcon className="w-3 h-3 text-subtle" /> },
    { name: 'src/index.ts', type: 'file', icon: <BeakerIcon className="w-3 h-3 text-subtle" />, language: 'typescript', content: `import { ${entry.title.replace(/\s/g, '')} } from './core';\n\nconst app = new ${entry.title.replace(/\s/g, '')}({\n  env: process.env.NODE_ENV,\n  debug: true\n});\n\napp.start().then(() => {\n  console.log("System Online");\n});` },
    { name: 'tests', type: 'folder', icon: <div className="w-3 h-3 border border-ink rounded-[1px]" /> },
  ], [entry])

  const handleFileClick = (file: MockFile) => {
    if (file.type === 'folder') return
    setSelectedFile(file.name)
    if (window.innerWidth < 1024) setActiveTab('overview')
  }

  const renderContent = () => {
    const file = files.find((f) => f.name === selectedFile)
    if (selectedFile === 'README.md') {
      return (
        <div className="prose max-w-none font-sans animate-fade-in">
          <div className="flex justify-between items-start border-b border-ink pb-8 mb-8">
            <div>
              <h1 className="font-sans font-bold text-4xl mb-2">{entry.title}</h1>
              <p className="font-sans text-subtle text-lg">{entry.description}</p>
            </div>
            {entry.link && (
              <a href={entry.link} target="_blank" rel="noreferrer" className="hidden lg:block bg-ink text-white px-6 py-2 font-mono text-xs font-bold hover:bg-accent hover:border-ink border border-transparent transition-all shadow-hard-sm">VISIT DEPLOYMENT</a>
            )}
          </div>
          <MarkdownContent content={entry.content} />
        </div>
      )
    }
    return (
      <div className="font-mono text-sm animate-fade-in">
        <div className="mb-4 text-subtle text-xs uppercase tracking-widest border-b border-ink/10 pb-2">{file?.language} source</div>
        <div className="bg-[#fefce8] p-6 border border-ink/10 rounded-sm overflow-x-auto">
          <pre>
            {file?.content?.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-right pr-4 text-subtle/50 select-none border-r border-ink/10 mr-4">{i + 1}</span>
                <span className="table-cell pl-4 whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-0 lg:p-4">
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-white shadow-hard-xl pointer-events-auto animate-slide-up border-x border-y lg:border border-ink flex flex-col h-full lg:h-[85vh]">
        <div className="bg-level-0 border-b border-ink p-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 px-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full border border-ink bg-white hover:bg-red-500 transition-colors cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full border border-ink bg-white hover:bg-yellow-500 transition-colors" />
              <div className="w-3 h-3 rounded-full border border-ink bg-white hover:bg-green-500 transition-colors" />
            </div>
            <div className="hidden lg:block font-mono text-xs bg-white border border-ink px-4 py-1 rounded-sm shadow-sm select-none">~/{entry.slug}/{selectedFile}</div>
          </div>
          <button onClick={onClose} className="lg:hidden px-3 py-1 font-mono text-xs font-bold bg-ink text-white">CLOSE</button>
          <div className="hidden lg:block text-[10px] font-mono text-subtle uppercase">ReadOnly Mode</div>
        </div>

        <div className="lg:hidden flex border-b border-ink bg-white shrink-0">
          {(['overview', 'files', 'commits'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 font-mono text-xs uppercase font-bold transition-colors ${activeTab === tab ? 'bg-ink text-white' : 'text-ink hover:bg-level-0'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:flex w-72 bg-level-0 border-r border-ink flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 border-b border-ink">
              <div className="font-mono text-[10px] uppercase text-subtle mb-4 font-bold tracking-wider flex items-center gap-2"><BoxIcon className="w-3 h-3" /> Explorer</div>
              <ul className="space-y-1 font-mono text-xs">
                {files.map((f) => (
                  <li key={f.name} onClick={() => handleFileClick(f)} className={`flex items-center gap-2 py-1.5 px-2 rounded-sm cursor-pointer transition-colors select-none ${selectedFile === f.name ? 'bg-white border border-ink shadow-sm' : 'hover:bg-white/50 border border-transparent'} ${f.type === 'folder' ? 'pl-2' : f.name.includes('/') ? 'ml-4' : ''}`}>
                    {f.icon}
                    <span className={f.type === 'folder' ? 'text-subtle font-bold' : ''}>{f.name.split('/').pop()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-1/2 overflow-y-auto p-4 bg-white/50">
              <div className="font-mono text-[10px] uppercase text-subtle mb-4 font-bold tracking-wider flex items-center gap-2"><TerminalIcon className="w-3 h-3" /> git log --oneline</div>
              <div className="relative border-l border-ink/20 ml-1.5 pl-4 space-y-4">
                {entry.updates?.slice().reverse().map((u, i) => (
                  <div key={i} className="text-[10px] font-mono cursor-pointer group" onClick={() => setExpandedCommit(expandedCommit === i ? null : i)}>
                    <div className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full border border-ink mt-0.5 transition-colors ${expandedCommit === i ? 'bg-accent' : 'bg-white group-hover:bg-ink'}`} />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-subtle opacity-75">{u.date}</span>
                      {u.version && <span className="bg-ink text-white px-1 rounded-[1px]">{u.version}</span>}
                    </div>
                    <div className="font-bold leading-tight group-hover:text-accent transition-colors">{u.content}</div>
                    {expandedCommit === i && (
                      <div className="mt-2 p-2 bg-level-0 border border-ink animate-fade-in text-subtle">
                        <div className="flex justify-between mb-1"><span>Hash:</span><span className="font-bold">{(u.date + u.content).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0).toString(16).padStart(7, '0').slice(0, 7)}</span></div>
                        <div className="text-green-600">+ {((i + 1) * 13) % 50 + 3} additions</div>
                        <div className="text-red-600">- {((i + 1) * 7) % 20 + 1} deletions</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`flex-1 bg-white p-6 lg:p-12 overflow-y-auto ${activeTab === 'overview' ? 'block' : 'hidden lg:block'}`}>{renderContent()}</div>

          <div className={`flex-1 bg-level-0 p-4 overflow-y-auto ${activeTab === 'files' ? 'block' : 'hidden'} lg:hidden`}>
            <div className="font-mono text-xs uppercase font-bold mb-4">Project Files</div>
            <ul className="space-y-2 font-mono text-sm">
              {files.map((f) => (
                <li key={f.name} onClick={() => handleFileClick(f)} className={`flex items-center gap-3 py-3 px-3 bg-white border border-ink shadow-sm active:translate-y-0.5 active:shadow-none ${selectedFile === f.name ? 'ring-2 ring-accent' : ''}`}>
                  {f.icon}
                  <span className={f.type === 'folder' ? 'font-bold' : ''}>{f.name}</span>
                  {selectedFile === f.name && <span className="ml-auto text-[10px] text-accent font-bold">ACTIVE</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className={`flex-1 bg-white p-4 overflow-y-auto ${activeTab === 'commits' ? 'block' : 'hidden'} lg:hidden`}>
            <div className="font-mono text-xs uppercase font-bold mb-4">Activity Log</div>
            <div className="space-y-4">
              {entry.updates?.slice().reverse().map((u, i) => (
                <div key={i} className="border border-ink p-3 shadow-sm bg-level-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-[10px] text-subtle">{u.date}</div>
                    {u.version && <div className="bg-ink text-white text-[10px] px-1.5 py-0.5 font-bold">{u.version}</div>}
                  </div>
                  <div className="font-mono text-sm">{u.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
