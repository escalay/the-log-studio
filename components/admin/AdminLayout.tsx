import React, { useState, useEffect } from 'react';
import { DataManager } from '../../data';
import { Entry, MaturityLevel } from '../../types';
import { Plus, Edit3, Trash2, LayoutGrid, FileText, ArrowLeft, RefreshCw, Box } from 'lucide-react';
import { EntryEditor } from './EntryEditor';

export const AdminLayout = ({ onClose }: { onClose: () => void }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [editingEntry, setEditingEntry] = useState<Entry | 'new' | null>(null);

    useEffect(() => {
        // Load data on mount
        setEntries(DataManager.getEntries());
        
        // Listen for updates from other tabs/components
        const handleStorageUpdate = () => {
            setEntries(DataManager.getEntries());
        };
        window.addEventListener('storage-update', handleStorageUpdate);
        return () => window.removeEventListener('storage-update', handleStorageUpdate);
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this record? This cannot be undone.')) {
            DataManager.deleteEntry(id);
            setEntries(DataManager.getEntries());
        }
    };

    const handleReset = () => {
        if(confirm('Factory Reset: This will wipe all local changes and restore the seed data. Continue?')) {
            setEntries(DataManager.resetEntries());
        }
    }

    // Render Editor if active
    if (editingEntry) {
        return (
            <EntryEditor 
                entry={editingEntry === 'new' ? undefined : editingEntry} 
                onClose={() => setEditingEntry(null)} 
                onSave={(savedEntry) => {
                    DataManager.saveEntry(savedEntry);
                    setEditingEntry(null);
                    setEntries(DataManager.getEntries());
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">
            
            {/* --- TOP BAR --- */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a1a] sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/60" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="font-mono font-bold uppercase tracking-widest text-sm">Studio Control</h1>
                        <span className="text-[10px] text-white/40 font-mono">LOCAL_ENV: WRITE_ACCESS_GRANTED</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors font-mono text-xs uppercase"
                        title="Reset to Seed Data"
                    >
                        <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                    <button 
                        onClick={() => setEditingEntry('new')}
                        className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-white hover:text-accent transition-colors font-mono text-xs font-bold uppercase"
                    >
                        <Plus className="w-4 h-4" /> New Entry
                    </button>
                </div>
            </header>

            {/* --- DASHBOARD CONTENT --- */}
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    
                    {/* STATS OVERVIEW */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                         <div className="bg-white/5 border border-white/10 p-6">
                            <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Total Signals</div>
                            <div className="text-3xl font-serif">{entries.length}</div>
                         </div>
                         <div className="bg-white/5 border border-white/10 p-6">
                            <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Projects (L2)</div>
                            <div className="text-3xl font-serif">{entries.filter(e => e.level === MaturityLevel.L2).length}</div>
                         </div>
                         <div className="bg-white/5 border border-white/10 p-6">
                            <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Products (L3)</div>
                            <div className="text-3xl font-serif text-accent">{entries.filter(e => e.level === MaturityLevel.L3).length}</div>
                         </div>
                         <div className="bg-white/5 border border-white/10 p-6">
                            <div className="text-[10px] uppercase text-white/40 font-mono mb-2">Latest Update</div>
                            <div className="text-xl font-serif text-white/60 truncate">{entries[0]?.date || 'N/A'}</div>
                         </div>
                    </div>

                    {/* TABLE HEADER */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-3xl">Registry</h2>
                        <div className="flex gap-2 text-[10px] font-mono text-white/40 uppercase">
                             <span className="px-2 py-1 border border-white/10 rounded-sm">Sort: Date (Desc)</span>
                        </div>
                    </div>

                    {/* ENTRIES LIST */}
                    <div className="border border-white/10 bg-[#0a0a0a]">
                        {entries.length === 0 ? (
                            <div className="p-12 text-center text-white/30 font-mono">No entries found. Start creating.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {entries.map((entry) => (
                                    <div 
                                        key={entry.id} 
                                        onClick={() => setEditingEntry(entry)}
                                        className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`
                                                w-2 h-2 rounded-full shrink-0
                                                ${entry.level === MaturityLevel.L3 ? 'bg-accent' : 
                                                  entry.level === MaturityLevel.L2 ? 'bg-yellow-400' : 
                                                  entry.level === MaturityLevel.L1 ? 'bg-blue-400' : 'bg-gray-400'}
                                            `} />
                                            <div>
                                                <div className="font-mono text-[10px] text-white/40 uppercase mb-1 flex gap-2">
                                                    <span>{entry.id}</span>
                                                    <span>—</span>
                                                    <span>{entry.type}</span>
                                                    <span>—</span>
                                                    <span>{entry.date}</span>
                                                </div>
                                                <h3 className="font-sans font-bold text-lg leading-tight group-hover:text-accent transition-colors">
                                                    {entry.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                                            <div className="hidden md:flex gap-2">
                                                {entry.tags.slice(0,3).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] font-mono text-white/50 border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setEditingEntry(entry); }}
                                                    className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(entry.id, e)}
                                                    className="p-2 text-white/20 hover:text-red-500 hover:bg-white/10 rounded-sm transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};
