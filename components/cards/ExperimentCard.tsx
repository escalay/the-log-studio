import React from 'react';
import { Entry } from '../../types';
import { BeakerIcon } from '../Icons';

export const ExperimentCard = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="group relative h-full bg-surface border border-ink hover:shadow-hard transition-all duration-200 cursor-pointer flex flex-col select-none overflow-hidden"
    >
        {/* --- INDUSTRIAL HEADER BAR --- */}
        <div className="flex items-center justify-between px-4 py-2 bg-level-0 border-b border-ink">
            <div className="flex items-center gap-3">
                {/* ID Tag */}
                <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-ink text-white px-1.5 py-0.5 rounded-[1px]">
                    EXP-{entry.id.split('-')[1]}
                </span>
                {/* Decorative lines */}
                <div className="flex flex-col gap-[2px]">
                    <div className="w-8 h-[1px] bg-ink/20"></div>
                    <div className="w-6 h-[1px] bg-ink/20"></div>
                </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase text-subtle/80 tracking-tight hidden sm:inline-block">Status:</span>
                <div className="relative flex items-center justify-center w-3 h-3">
                    <div className="absolute w-2 h-2 bg-accent rounded-full animate-blink opacity-80" />
                    <div className="absolute w-2 h-2 bg-accent rounded-full animate-ping opacity-20" />
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="p-5 flex-1 flex flex-col relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[linear-gradient(-45deg,transparent_45%,#f3f4f6_45%,#f3f4f6_55%,transparent_55%)] bg-[length:6px_6px] pointer-events-none opacity-50" />
            
            <div className="relative z-10">
                <div className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 border border-accent"></span>
                    Hypothesis
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl leading-[0.9] mb-4 text-ink group-hover:text-accent transition-colors">
                    {entry.title}
                </h3>
                
                <p className="font-mono text-[10px] md:text-[11px] text-subtle leading-relaxed line-clamp-3 mb-6 bg-level-0/50 p-2 border-l-2 border-ink/10">
                    {entry.description}
                </p>
            </div>

            {/* --- METRICS GRID --- */}
            <div className="mt-auto grid grid-cols-2 gap-px bg-ink/10 border border-ink/10">
                {entry.metrics?.slice(0, 2).map((m, i) => (
                    <div key={i} className="bg-white p-2 flex flex-col justify-between hover:bg-level-0 transition-colors">
                        <span className="font-mono text-[8px] uppercase text-subtle/70 tracking-tight mb-1">{m.label}</span>
                        <span className="font-mono text-xs font-bold text-ink">{m.value}</span>
                    </div>
                ))}
                {(!entry.metrics || entry.metrics.length === 0) && (
                    <div className="col-span-2 bg-white p-2 font-mono text-[9px] text-subtle italic flex items-center justify-center">
                        NO TELEMETRY DATA
                    </div>
                )}
            </div>
        </div>

        {/* --- FOOTER TICKET --- */}
        <div className="bg-ink text-white p-2 flex justify-between items-center text-[9px] font-mono uppercase tracking-wider relative overflow-hidden">
             {/* Hazard Stripes Background on Footer */}
             <div className="absolute inset-0 bg-hazard-stripes opacity-10 pointer-events-none mix-blend-overlay"></div>
             
             <div className="relative z-10 flex items-center gap-2 truncate max-w-[80%]">
                <BeakerIcon className="w-3 h-3 text-accent" />
                <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                    {entry.updates && entry.updates.length > 0 ? entry.updates[entry.updates.length-1].content : "SYSTEM INITIALIZED"}
                </span>
             </div>
             <div className="relative z-10 w-2 h-2 border border-white/40 bg-transparent group-hover:bg-accent transition-colors" />
        </div>
        
        {/* --- CORNER SCREWS (Visual Decoration) --- */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-ink/20 rounded-full" />
        <div className="absolute top-2 right-2 w-1 h-1 bg-ink/20 rounded-full" />
        <div className="absolute bottom-10 left-2 w-1 h-1 bg-ink/20 rounded-full" />
        <div className="absolute bottom-10 right-2 w-1 h-1 bg-ink/20 rounded-full" />
    </div>
);