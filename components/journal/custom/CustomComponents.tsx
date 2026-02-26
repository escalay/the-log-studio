
import React from 'react';

// A bespoke Bar Chart component for the journal
export const BarChart = ({ data, title }: { data: { label: string, value: number, color: string }[], title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
        <div className="my-12 p-8 border border-ink bg-white shadow-hard">
            <div className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-ink pb-2">{title}</div>
            <div className="space-y-4">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="w-24 font-mono text-xs text-right text-subtle">{d.label}</div>
                        <div className="flex-1 h-8 bg-level-0 relative overflow-hidden">
                            <div 
                                className="h-full transition-all duration-1000 ease-out" 
                                style={{ width: `${(d.value / maxValue) * 100}%`, backgroundColor: d.color }}
                            />
                        </div>
                        <div className="w-12 font-mono text-xs font-bold">{d.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// A stylized list component
export const ListHighlight = ({ items, title }: { items: string[], title: string }) => (
    <div className="my-12 bg-ink text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 font-mono text-[10px] border-b border-l border-white/20">{title.toUpperCase()}</div>
        <ul className="space-y-4 relative z-10">
            {items.map((item, i) => (
                <li key={i} className="font-serif text-3xl italic border-b border-white/20 pb-2 last:border-0 hover:pl-4 transition-all duration-300 cursor-default">
                    {item}
                </li>
            ))}
        </ul>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 border-4 border-white/10 rounded-full" />
    </div>
);
