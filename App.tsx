import React, { useState, useMemo } from 'react';
import { DataManager } from './data'; // Import DataManager instead of static ENTRIES
import { Entry, FilterState } from './types';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { Footer } from './components/layout/Footer';
import { FilterToolbar } from './components/layout/FilterToolbar';
import { SystemDiagram } from './components/layout/SystemDiagram';
import { JournalIndex } from './components/journal/JournalLayout';
import { JournalPreviewSection } from './components/journal/JournalPreviewSection';
import { EntryCardSwitcher } from './components/cards/EntryCardSwitcher';
import { DetailModalSwitcher } from './components/modals/DetailModalSwitcher';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  const [filter, setFilter] = useState<FilterState>({ level: 'all', tag: null });
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [view, setView] = useState<'collection' | 'system' | 'journal' | 'admin'>('collection');
  
  // Load initial entries from the DataManager
  const [entries, setEntries] = useState<Entry[]>(DataManager.getEntries());

  // Listen for storage updates to refresh the main view if Admin changes things
  React.useEffect(() => {
    const handleUpdate = () => {
        setEntries(DataManager.getEntries());
    };
    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (filter.level !== 'all' && entry.level !== filter.level) return false;
      if (filter.tag && !entry.tags.includes(filter.tag)) return false;
      return true;
    });
  }, [filter, entries]);

  // If in Admin Mode, render the Admin Layout overlay
  if (view === 'admin') {
      return <AdminLayout onClose={() => setView('collection')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-ink bg-dot-grid relative overflow-x-hidden w-full">
      <Navbar view={view} setView={(v) => { setView(v); window.scrollTo(0,0); }} />
      
      {view === 'collection' && <Hero />}
      
      <main className="flex-1 relative z-10 container mx-auto max-w-7xl md:border-x md:border-ink bg-paper min-h-screen">
         {view === 'collection' ? (
             <>
                <FilterToolbar filter={filter} setFilter={setFilter} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b border-ink">
                    {filteredEntries.map((entry, idx) => (
                        <div key={entry.id} className={`
                            ${idx % 3 !== 2 ? 'lg:border-r' : ''} 
                            ${idx % 2 !== 1 ? 'md:border-r lg:border-r-0' : ''}
                            border-b border-ink p-0
                        `}>
                            <EntryCardSwitcher 
                                entry={entry} 
                                onClick={() => setSelectedEntry(entry)} 
                            />
                        </div>
                    ))}
                    
                    {/* Empty State / Filler */}
                    {filteredEntries.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border-b border-ink">
                             <div className="w-16 h-16 border-2 border-dashed border-subtle rounded-full flex items-center justify-center mb-4">?</div>
                             <p className="font-serif text-2xl italic">No signals found.</p>
                             <button onClick={() => setFilter({level: 'all', tag: null})} className="mt-4 font-mono text-xs underline hover:text-accent">RESET FILTER</button>
                        </div>
                    )}
                </div>

                {/* New Journal Preview Section */}
                <JournalPreviewSection onNavigate={() => { setView('journal'); window.scrollTo(0,0); }} />
             </>
         ) : view === 'system' ? (
             <SystemDiagram />
         ) : (
             <JournalIndex />
         )}
      </main>

      <Footer onOpenAdmin={() => setView('admin')} />

      {selectedEntry && (
        <DetailModalSwitcher 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
        />
      )}
    </div>
  );
}