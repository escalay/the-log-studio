
import React from 'react';
import { JournalIcon } from '../Icons';

export const Navbar = ({ view, setView }: { view: string, setView: (v: 'collection' | 'system' | 'journal') => void }) => (
    <nav className="border-b border-ink bg-paper sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest hidden md:inline">The Log Studio_</span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest md:hidden">TLS_</span>
        </div>
        
        <div className="flex h-full">
            <button 
                onClick={() => setView('collection')}
                className={`px-4 md:px-6 h-full font-mono text-xs uppercase border-l border-ink hover:bg-ink hover:text-white transition-colors ${view === 'collection' ? 'bg-ink text-white' : ''}`}
            >
                Collection
            </button>
            <button 
                onClick={() => setView('system')}
                className={`px-4 md:px-6 h-full font-mono text-xs uppercase border-l border-ink hover:bg-ink hover:text-white transition-colors ${view === 'system' ? 'bg-ink text-white' : ''}`}
            >
                System
            </button>
             <button 
                onClick={() => setView('journal')}
                className={`px-4 md:px-6 h-full font-mono text-xs uppercase border-l border-ink hover:bg-ink hover:text-white transition-colors flex items-center gap-2 ${view === 'journal' ? 'bg-ink text-white' : ''}`}
            >
                <JournalIcon className="w-3 h-3" />
                <span className="hidden md:inline">The Register</span>
                <span className="md:hidden">Log</span>
            </button>
        </div>
    </nav>
);
