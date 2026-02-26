
import React from 'react';
import { JOURNAL_ENTRIES } from '../../data';
import { BarChart } from './custom/CustomComponents';
import { ArrowLeft, JournalIcon } from '../Icons';

export const JournalPreviewSection = ({ onNavigate }: { onNavigate: () => void }) => {
    // Get latest entry
    const latest = JOURNAL_ENTRIES[0];
    const others = JOURNAL_ENTRIES.slice(1, 4);

    // Try to find a component block to render as a teaser
    const teaserBlock = latest.blocks.find(b => b.type === 'component');
    
    // Helper to render the teaser
    const renderTeaser = () => {
        if (!teaserBlock) return null;
        try {
            const props = JSON.parse(teaserBlock.content);
            if (teaserBlock.componentName === 'BarChart') {
                return (
                    <div className="transform scale-90 origin-top-left pointer-events-none">
                         <BarChart {...props} />
                    </div>
                );
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    return (
        <section className="border-t-4 border-ink bg-level-0 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-graph-paper opacity-40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-7xl border-x border-ink">
                {/* Header */}
                <div className="border-b border-ink p-6 md:p-8 flex flex-col md:flex-row justify-between items-baseline gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-ink animate-pulse" />
                        <h2 className="font-serif text-3xl md:text-5xl italic">From The Register</h2>
                    </div>
                    <button 
                        onClick={onNavigate}
                        className="font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                        View Full Archive
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid md:grid-cols-12 min-h-[500px]">
                    
                    {/* Main Feature (Latest) */}
                    <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-ink p-8 md:p-12 relative group cursor-pointer" onClick={onNavigate}>
                        <div className="absolute top-0 right-0 bg-ink text-white px-3 py-1 font-mono text-xs font-bold uppercase">
                            Latest Issue
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="font-mono text-xs text-subtle uppercase tracking-widest mb-6">
                                {latest.quarter} — {latest.date}
                            </div>
                            
                            <h3 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8 group-hover:text-accent transition-colors">
                                {latest.title}
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <p className="font-sans text-lg text-ink/80 leading-relaxed">
                                    {latest.subtitle}
                                </p>
                                {/* Render the interactive teaser if available */}
                                {teaserBlock && (
                                    <div className="hidden md:block border border-ink bg-white p-2 shadow-sm rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                        <div className="font-mono text-[9px] uppercase border-b border-ink/10 mb-2 pb-1 text-subtle">Fig 1. Data Preview</div>
                                        {renderTeaser()}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-8 flex items-center gap-2 font-mono text-xs font-bold uppercase text-accent">
                                Read Deep Dive <div className="h-[1px] w-8 bg-accent" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Previous) */}
                    <div className="md:col-span-4 bg-white">
                        <div className="p-4 border-b border-ink bg-diagonal-stripes">
                            <span className="font-mono text-[10px] uppercase font-bold bg-white px-2 py-0.5 border border-ink shadow-sm">
                                Previously
                            </span>
                        </div>
                        
                        {others.length > 0 ? (
                            <div className="divide-y divide-ink">
                                {others.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={onNavigate}
                                        className="p-6 md:p-8 hover:bg-level-0 transition-colors cursor-pointer group"
                                    >
                                        <div className="font-mono text-[10px] text-subtle mb-2">{post.date}</div>
                                        <h4 className="font-serif text-2xl leading-tight mb-2 group-hover:underline decoration-accent underline-offset-4">
                                            {post.title}
                                        </h4>
                                        <div className="text-xs font-mono text-subtle uppercase">
                                            {post.readTime}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-subtle font-mono text-xs">
                                Archive is empty.
                            </div>
                        )}

                        <div className="p-6 md:p-8 bg-ink text-white h-full flex flex-col justify-center items-center text-center mt-auto">
                            <JournalIcon className="w-12 h-12 mb-4 opacity-50" />
                            <h4 className="font-serif text-2xl italic mb-2">Subscribe to RSS</h4>
                            <p className="font-sans text-white/60 text-xs mb-4">Get raw updates when they ship.</p>
                            <div className="flex w-full gap-2">
                                <input type="email" placeholder="email@address.com" className="bg-white/10 border border-white/20 px-3 py-2 text-xs font-mono w-full text-white placeholder:text-white/30 focus:outline-none focus:border-accent" />
                                <button className="bg-white text-ink px-3 py-2 font-bold font-mono text-xs hover:bg-accent hover:text-white transition-colors">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
