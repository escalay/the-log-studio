
import React, { useState, useEffect } from 'react';
import { JOURNAL_ENTRIES } from '../../data';
import { JournalEntry, JournalBlock } from '../../types';
import { ArrowLeft } from '../Icons';
import { MarkdownContent } from '../ui/MarkdownContent';
import { BarChart, ListHighlight } from './custom/CustomComponents';

// --- COMPONENTS REGISTRY ---
const renderBlock = (block: JournalBlock, index: number) => {
    switch (block.type) {
        case 'markdown':
            return (
                <div key={index} className="prose prose-lg max-w-none font-serif text-ink mb-8 leading-relaxed">
                    <MarkdownContent content={block.content} />
                </div>
            );
        case 'pull-quote':
            return (
                <blockquote key={index} className="border-l-4 border-accent pl-6 my-12 font-serif text-3xl md:text-4xl italic text-ink/90 leading-tight">
                    "{block.content}"
                </blockquote>
            );
        case 'image':
            return (
                <figure key={index} className="my-12 -mx-4 md:-mx-12">
                    <img src={block.content} alt="Journal asset" className="w-full h-auto border-y border-ink grayscale hover:grayscale-0 transition-all duration-700" />
                </figure>
            );
        case 'component':
            try {
                const props = JSON.parse(block.content);
                if (block.componentName === 'BarChart') return <BarChart key={index} {...props} />;
                if (block.componentName === 'ListHighlight') return <ListHighlight key={index} {...props} />;
                return null;
            } catch (e) {
                return null;
            }
        default:
            return null;
    }
};

// --- POST VIEWER ---
const JournalPostViewer = ({ post, onClose }: { post: JournalEntry, onClose: () => void }) => {
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Restore body scroll
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-paper overflow-y-auto animate-fade-in custom-scrollbar">
            {/* Reading Progress / Header */}
            <div className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink flex items-center justify-between px-4 md:px-8 h-16">
                <button onClick={onClose} className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Register
                </button>
                <div className="font-serif italic hidden md:block">{post.title}</div>
                <div className="font-mono text-[10px] bg-ink text-white px-2 py-1">{post.readTime}</div>
            </div>

            <article className="max-w-3xl mx-auto px-6 py-12 md:py-24">
                {/* Editorial Header */}
                <header className="mb-16 text-center">
                    <div className="flex justify-center gap-4 font-mono text-xs text-subtle uppercase tracking-widest mb-6">
                        <span>{post.quarter}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-[0.9] text-ink">
                        {post.title}
                    </h1>
                    <p className="font-sans text-xl md:text-2xl text-subtle leading-relaxed max-w-xl mx-auto border-b border-accent/20 pb-8">
                        {post.subtitle}
                    </p>
                </header>

                {/* Content Flow */}
                <div className="journal-content">
                    {post.blocks.map((block, i) => renderBlock(block, i))}
                </div>

                {/* Footer / Signature */}
                <footer className="mt-24 pt-12 border-t border-ink flex flex-col items-center">
                    <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center font-serif font-bold text-2xl mb-4">
                        E.
                    </div>
                    <p className="font-mono text-xs uppercase tracking-widest">End of Record</p>
                </footer>
            </article>
        </div>
    );
};

// --- MAIN JOURNAL INDEX ---
export const JournalIndex = () => {
    const [activePost, setActivePost] = useState<JournalEntry | null>(null);

    return (
        <div className="animate-fade-in w-full bg-paper min-h-screen">
            {activePost && <JournalPostViewer post={activePost} onClose={() => setActivePost(null)} />}

            {/* Masthead */}
            <div className="border-b-4 border-ink py-16 px-4 md:px-12 text-center bg-dot-grid relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-diagonal-stripes" />
                <h1 className="font-serif text-8xl md:text-[10rem] leading-none mb-2 tracking-tighter mix-blend-multiply">
                    The Register.
                </h1>
                <div className="flex justify-center items-center gap-4 font-mono text-xs md:text-sm uppercase tracking-widest border-y border-ink py-2 max-w-md mx-auto bg-paper relative z-10">
                    <span>Quarterly</span>
                    <span className="w-1 h-1 bg-ink rounded-full" />
                    <span>Deep Dives</span>
                    <span className="w-1 h-1 bg-ink rounded-full" />
                    <span>Retrospectives</span>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto max-w-7xl border-x border-ink min-h-screen">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink border-b border-ink">
                    
                    {JOURNAL_ENTRIES.map((post, i) => (
                        <div 
                            key={post.id} 
                            onClick={() => setActivePost(post)}
                            className="group cursor-pointer bg-paper hover:bg-level-0 transition-colors duration-300 flex flex-col h-full min-h-[400px]"
                        >
                            {/* Card Header */}
                            <div className="p-6 border-b border-ink/10 flex justify-between items-start">
                                <div className="font-mono text-[10px] uppercase border border-ink px-1.5 py-0.5 rounded-sm">
                                    {post.quarter}
                                </div>
                                <div className="w-2 h-2 bg-ink rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Card Body */}
                            <div className="p-8 flex-1 flex flex-col justify-center">
                                <h2 className="font-serif text-4xl md:text-5xl leading-[0.9] mb-6 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h2>
                                <p className="font-sans text-subtle leading-relaxed line-clamp-3 mb-8">
                                    {post.subtitle}
                                </p>
                                <div className="mt-auto flex items-center gap-2 font-mono text-xs font-bold uppercase group-hover:underline decoration-accent underline-offset-4">
                                    Read Entry <span className="text-accent">{'->'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for Next Quarter */}
                    <div className="bg-level-0/30 flex items-center justify-center p-12 min-h-[400px]">
                        <div className="text-center opacity-40">
                            <div className="font-serif text-6xl mb-2 text-subtle italic">Q2</div>
                            <div className="font-mono text-xs uppercase tracking-widest">Coming Soon</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
