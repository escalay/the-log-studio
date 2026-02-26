
import React, { useState } from 'react';
import { Entry } from '../../types';
import { MarkdownContent } from '../ui/MarkdownContent';
import { BeakerIcon, TerminalIcon, AlertIcon } from '../Icons';

export const ExperimentDetail = ({ entry, onClose }: { entry: Entry, onClose: () => void }) => {
    const [isMobileMetaExpanded, setIsMobileMetaExpanded] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-6 xl:p-12 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-ink/90 backdrop-blur-sm animate-fade-in cursor-pointer" 
                onClick={onClose} 
            />
            
            {/* Main Chassis */}
            <div className="relative w-full h-full lg:max-w-7xl lg:h-[90vh] bg-paper shadow-2xl flex flex-col animate-slide-up border border-ink overflow-hidden lg:rounded-[2px]">
                
                {/* --- TOP BAR (Industrial Header) --- */}
                <div className="h-14 lg:h-16 flex items-center justify-between border-b-2 border-ink bg-level-0 shrink-0 z-50 select-none">
                    <div className="flex items-center h-full">
                         {/* Caution Stripes */}
                         <div className="h-full w-4 lg:w-8 bg-hazard-stripes border-r-2 border-ink" />
                         
                         <div className="px-4 lg:px-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                 <div className="font-mono text-[9px] uppercase text-subtle tracking-[0.2em] font-bold">Confidential</div>
                                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-blink" />
                            </div>
                            <h1 className="font-mono text-lg lg:text-2xl font-black tracking-tighter text-ink flex items-center gap-2 mt-0.5">
                                {entry.id.toUpperCase()}
                                <span className="hidden lg:flex h-5 items-center px-1.5 bg-ink text-white text-[9px] rounded-[1px] font-normal ml-2 tracking-normal">
                                    REV {entry.updates?.length || 1}.0
                                </span>
                            </h1>
                         </div>
                    </div>

                    <div className="flex items-center h-full">
                        <div className="hidden lg:flex flex-col items-end justify-center mr-6">
                            <span className="font-mono text-[9px] text-subtle uppercase tracking-widest">Clearance</span>
                            <span className="font-mono text-xs font-bold text-ink">LEVEL 4</span>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="h-full px-6 lg:px-8 bg-ink text-white hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2 border-l-2 border-ink group relative overflow-hidden"
                        >
                            <span className="relative z-10 font-mono text-xs lg:text-sm font-bold uppercase tracking-wider group-hover:scale-105 transition-transform">Close</span>
                            <span className="relative z-10 hidden lg:inline text-[10px] opacity-50 ml-1">[ESC]</span>
                            {/* Hover Fill Effect */}
                            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out" />
                        </button>
                    </div>
                </div>

                {/* --- MAIN SPLIT VIEW --- */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-level-0 relative">
                    
                    {/* 
                        LAYOUT LOGIC:
                        Mobile/Tablet: Content (Order 1) -> Meta (Order 2)
                        Desktop (LG+): Meta (Order 1) -> Content (Order 2)
                    */}

                    {/* --- META PANEL (Left / Bottom) --- */}
                    <div className={`
                        order-2 lg:order-1
                        w-full lg:w-80 xl:w-96 shrink-0 
                        bg-[#1a1a1a] text-gray-300
                        border-t-2 lg:border-t-0 lg:border-r-2 border-ink
                        flex flex-col
                        overflow-hidden
                        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${isMobileMetaExpanded ? 'h-[60vh]' : 'h-14'} 
                        lg:h-full
                    `}>
                        {/* Header for Meta Panel */}
                        <div 
                            className="bg-black p-3 border-b border-white/10 flex items-center justify-between sticky top-0 z-10 cursor-pointer lg:cursor-default h-14 shrink-0"
                            onClick={() => window.innerWidth < 1024 && setIsMobileMetaExpanded(!isMobileMetaExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <TerminalIcon className="w-4 h-4 text-accent" />
                                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">System Telemetry</span>
                            </div>

                            {/* Mobile Toggle & Summary */}
                            <div className="lg:hidden flex items-center gap-4">
                                <div className={`flex items-center gap-2 transition-opacity duration-200 ${isMobileMetaExpanded ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                                    <span className="font-mono text-[9px] uppercase font-bold text-white/80 tracking-wider">Operational</span>
                                </div>
                                <div className={`transform transition-transform duration-300 ${isMobileMetaExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/50">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={`flex-1 overflow-y-auto technical-scrollbar p-6 lg:p-8 space-y-8 transition-opacity duration-300 ${isMobileMetaExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                            
                            {/* Status Module */}
                            <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                                <div className="font-mono text-[9px] uppercase text-white/40 mb-2 tracking-wider">Run Status</div>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xl font-bold text-white tracking-tight">OPERATIONAL</span>
                                    <div className="w-3 h-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] rounded-full animate-pulse" />
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between font-mono text-[10px]">
                                    <span className="text-white/40">UPTIME</span>
                                    <span className="text-accent">14:02:59</span>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div>
                                 <h4 className="font-mono text-[9px] uppercase text-white/40 tracking-widest mb-3 font-bold border-l-2 border-accent pl-2">
                                    Performance Data
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {entry.metrics?.map((m, i) => (
                                        <div key={i} className="bg-black border border-white/20 p-3 flex justify-between items-center group hover:border-accent transition-colors">
                                            <span className="font-mono text-[10px] text-white/60 uppercase">{m.label}</span>
                                            <span className="font-mono text-lg text-white font-bold group-hover:text-accent">{m.value}</span>
                                        </div>
                                    ))}
                                    {(!entry.metrics || entry.metrics.length === 0) && (
                                        <div className="font-mono text-[10px] text-white/30 italic py-2">No sensors connected.</div>
                                    )}
                                </div>
                            </div>

                            {/* Event Log */}
                            <div>
                                <h4 className="font-mono text-[9px] uppercase text-white/40 tracking-widest mb-3 font-bold border-l-2 border-accent pl-2">
                                    Activity Log
                                </h4>
                                <div className="font-mono text-[10px] space-y-3 font-medium">
                                    {entry.updates?.slice().reverse().map((u, i) => (
                                        <div key={i} className="relative pl-4 border-l border-white/10 hover:border-accent transition-colors pb-1">
                                            <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 bg-[#1a1a1a] border border-white/40 rounded-full" />
                                            <div className="flex justify-between items-baseline mb-1 opacity-50">
                                                <span>{u.date}</span>
                                                <span className={`text-[8px] px-1 rounded-[1px] text-black font-bold uppercase ${u.type === 'fix' ? 'bg-red-400' : 'bg-green-400'}`}>
                                                    {u.type}
                                                </span>
                                            </div>
                                            <div className="text-gray-300 leading-tight">
                                                {u.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Decorative footer for meta panel */}
                            <div className="pt-8 opacity-20">
                                <div className="font-mono text-[8px] text-justify leading-3 tracking-tighter break-all">
                                    01010010 01000101 01000001 01000100 01011001 00100000 01000110 01001111 01010010 00100000 01010000 01010010 01001111 01000100 01010101 01000011 01010100 01001001 01001111 01001110 
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTENT PANEL (Right / Top) --- */}
                    <div className="
                        order-1 lg:order-2
                        flex-1 bg-white
                        overflow-y-auto technical-scrollbar
                        relative
                        h-full
                        flex flex-col
                    ">
                        {/* Header of Content Panel */}
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-ink/10 px-6 lg:px-12 py-4 flex justify-between items-center shadow-sm">
                             <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                                Document Viewer <span className="text-accent">///</span> Read-Only
                             </div>
                             <div className="hidden lg:block w-24 h-1 bg-ink/5 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-ink/20 animate-slide-up" />
                             </div>
                        </div>

                        <div className="relative z-10 p-6 lg:p-12 xl:p-16 max-w-4xl mx-auto flex-1">
                            
                            {/* Title Block */}
                            <header className="mb-10 lg:mb-16">
                                <div className="inline-flex items-center gap-2 border border-accent text-accent font-mono text-[9px] font-bold px-2 py-1 mb-6 shadow-[2px_2px_0_0_#FF4F00] uppercase tracking-widest">
                                    Experiment Report
                                </div>
                                <h2 className="font-serif text-4xl lg:text-7xl font-bold leading-[0.9] mb-8 text-ink tracking-tight">
                                    {entry.title}
                                </h2>
                                <div className="bg-[#F8F8F8] p-6 border-l-4 border-ink relative">
                                    <p className="font-mono text-xs lg:text-sm text-ink/80 leading-relaxed max-w-2xl">
                                        {entry.description}
                                    </p>
                                    {/* Quote mark decoration */}
                                    <div className="absolute top-2 right-4 text-6xl font-serif text-ink/5 font-bold italic leading-none">”</div>
                                </div>
                            </header>

                            {/* Markdown Body */}
                            <div className="prose prose-sm lg:prose-lg max-w-none font-sans text-ink/90 prose-headings:font-serif prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-a:text-accent prose-a:font-bold prose-code:bg-level-0 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-[2px] prose-code:font-mono prose-code:text-accent prose-code:border prose-code:border-ink/10 prose-strong:font-black pb-24">
                                <MarkdownContent content={entry.content} />
                            </div>

                        </div>
                        
                        {/* Footer of Content Panel */}
                        <div className="border-t border-dashed border-ink/20 p-6 lg:p-12 bg-[#fafafa]">
                            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 opacity-60">
                                <div>
                                    <div className="w-48 h-12 border-b border-ink mb-2 relative">
                                        <div className="absolute bottom-2 left-4 font-hand text-3xl text-blue-900 -rotate-6 mix-blend-multiply opacity-80">
                                            Approved
                                        </div>
                                    </div>
                                    <div className="font-mono text-[9px] uppercase tracking-widest">Supervisor Signature</div>
                                </div>
                                <div className="font-mono text-[9px] text-right">
                                    REF: {entry.slug.toUpperCase()}<br/>
                                    GEN: {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
