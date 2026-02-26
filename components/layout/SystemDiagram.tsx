import React from 'react';
import { 
    WaterWheelIcon, 
    PlayIcon, 
    TerminalIcon, 
    BoxIcon, 
    ArrowLeft, 
    ActivityIcon, 
    UsersIcon, 
    TrendingUpIcon, 
    BeakerIcon 
} from '../Icons';

const PowerLawDiagram = () => (
    <div className="py-20 px-4 md:px-8 border-b border-ink bg-[#FAFAFA]">
         <div className="max-w-6xl mx-auto border-[3px] border-dashed border-ink/10 p-8 md:p-20 relative rounded-[2px] bg-white overflow-hidden">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ink -translate-x-[2px] -translate-y-[2px]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ink translate-x-[2px] -translate-y-[2px]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ink -translate-x-[2px] translate-y-[2px]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ink translate-x-[2px] translate-y-[2px]" />

            <div className="text-center mb-16 relative z-10">
                <h2 className="font-serif text-4xl md:text-6xl mb-4 text-ink">The Power Law of Returns</h2>
                <div className="inline-block px-3 py-1 bg-ink text-white font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">Expected yield per 100 ideas</div>
            </div>

            {/* Diagram Container */}
            <div className="relative">
                {/* Connecting Line (Desktop) - Centered at 72px (half of 144px/h-36 container) */}
                <div className="hidden md:block absolute top-[72px] left-0 w-full h-[2px] bg-ink/10 z-0 -translate-y-1/2"></div>
                
                {/* Connecting Line (Mobile) - Centered vertically */}
                <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-[2px] bg-ink/10 -translate-x-1/2 z-0"></div>

                {/* Nodes Wrapper */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4 relative z-10">
                    
                    {/* 1. IDEAS */}
                    <div className="flex flex-col items-center gap-6 group w-full md:w-auto relative">
                        {/* Shape Container: Fixed Height 144px (h-36) to ensure vertical alignment */}
                        <div className="w-36 h-36 flex items-center justify-center relative bg-white md:bg-transparent py-4 md:py-0">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-ink bg-white flex items-center justify-center relative shadow-hard transition-transform hover:-translate-y-1 z-10">
                                <div className="text-center">
                                    <div className="font-serif text-3xl md:text-5xl font-bold text-ink">100</div>
                                    <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-subtle">Ideas</div>
                                </div>
                            </div>
                        </div>
                        <div className="font-mono text-[10px] uppercase text-subtle tracking-widest text-center border-t border-ink/20 pt-2 w-full md:w-auto bg-white relative z-10">
                            Lab Notes
                        </div>
                    </div>

                    {/* 2. PROTOS */}
                    <div className="flex flex-col items-center gap-6 group w-full md:w-auto relative">
                        <div className="w-36 h-36 flex items-center justify-center bg-white md:bg-transparent py-4 md:py-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-ink bg-[#FEF3C7] flex items-center justify-center relative shadow-hard transition-transform hover:-translate-y-1 z-10">
                                <div className="text-center">
                                    <div className="font-serif text-2xl md:text-4xl font-bold text-ink">30</div>
                                    <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-ink/60">Protos</div>
                                </div>
                            </div>
                        </div>
                         <div className="font-mono text-[10px] uppercase text-subtle tracking-widest text-center border-t border-ink/20 pt-2 w-full md:w-auto bg-white relative z-10">
                            Experiments
                        </div>
                    </div>

                    {/* 3. PROJS */}
                     <div className="flex flex-col items-center gap-6 group w-full md:w-auto relative">
                        <div className="w-36 h-36 flex items-center justify-center bg-white md:bg-transparent py-4 md:py-0">
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-ink bg-[#FFDBC1] flex items-center justify-center relative shadow-hard transition-transform hover:-translate-y-1 z-10">
                                <div className="text-center">
                                    <div className="font-serif text-xl md:text-3xl font-bold text-ink">10</div>
                                    <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-ink/60">Projs</div>
                                </div>
                            </div>
                        </div>
                         <div className="font-mono text-[10px] uppercase text-subtle tracking-widest text-center border-t border-ink/20 pt-2 w-full md:w-auto bg-white relative z-10">
                            Projects
                        </div>
                    </div>

                    {/* 4. PRODUCTS */}
                     <div className="flex flex-col items-center gap-6 group w-full md:w-auto relative">
                        <div className="w-36 h-36 flex items-center justify-center relative z-10 bg-white md:bg-transparent py-4 md:py-0">
                             <div className="absolute inset-0 w-16 h-16 md:w-24 md:h-24 m-auto border-2 border-ink bg-[#D1FAE5] rotate-45 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-[50deg] group-hover:scale-105"></div>
                             <div className="relative z-10 text-center">
                                <div className="font-serif text-2xl md:text-4xl font-bold text-ink">3</div>
                                <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-ink/60">Prods</div>
                            </div>
                        </div>
                         <div className="font-mono text-[10px] uppercase text-subtle tracking-widest text-center border-t border-ink/20 pt-2 w-full md:w-auto bg-white relative z-10">
                            The 1%
                        </div>
                    </div>

                    {/* 5. SUCCESS */}
                     <div className="flex flex-col items-center gap-6 group w-full md:w-auto relative">
                        <div className="w-36 h-36 flex items-center justify-center bg-white md:bg-transparent py-4 md:py-0">
                             <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-accent border-2 border-ink animate-pulse shadow-[0_0_15px_rgba(255,79,0,0.6)] z-10"></div>
                        </div>
                         <div className="font-mono text-[10px] uppercase text-accent font-bold tracking-widest text-center w-full md:w-auto bg-white relative z-10">
                            Success
                        </div>
                    </div>

                </div>
            </div>
         </div>
    </div>
);

const LevelSpec = ({ 
    level, 
    title, 
    time, 
    stack, 
    gate, 
    bgColorClass,
    desc,
    isLast
}: { 
    level: string, 
    title: string, 
    time: string, 
    stack: string[], 
    gate: string[], 
    bgColorClass: string,
    desc: string,
    isLast?: boolean
}) => (
    <div className={`grid md:grid-cols-12 group relative ${!isLast ? 'border-b border-ink' : ''}`}>
        {/* Number Column */}
        <div className={`
            md:col-span-1 p-6 flex items-start justify-center 
            border-b md:border-b-0 md:border-r border-ink
            ${bgColorClass} group-hover:bg-ink group-hover:text-white transition-colors
        `}>
            <div className="font-serif text-5xl font-bold sticky top-20">{level}</div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-7 p-8 md:p-12 bg-white relative">
             <div className="flex flex-wrap items-center gap-4 mb-6">
                <h3 className="font-serif text-4xl font-bold">{title}</h3>
                <span className="font-mono text-[10px] uppercase font-bold px-3 py-1 border border-ink rounded-full bg-white shadow-sm">
                    Time: {time}
                </span>
            </div>
            <p className="font-sans text-lg text-subtle mb-8 leading-relaxed max-w-2xl">
                {desc}
            </p>

            <div className="space-y-3">
                 <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 font-bold border-b border-ink/10 pb-2">Technical Constraints</div>
                 <div className="flex flex-wrap gap-2">
                    {stack.map(s => (
                        <span key={s} className="px-2 py-1 bg-level-0 border border-ink/10 text-xs font-mono text-ink/80 rounded-[2px]">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Gate Column */}
        <div className="md:col-span-4 p-8 md:p-12 bg-level-0/20 border-t md:border-t-0 md:border-l border-ink flex flex-col justify-center relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
             
             <div className="relative z-10">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 border-2 border-accent rounded-full animate-pulse" />
                    Graduation Gate
                </div>
                <ul className="space-y-4">
                    {gate.map((g, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-sans text-ink group-hover:translate-x-1 transition-transform">
                            <span className="font-mono text-accent/50 font-bold">[{i+1}]</span>
                            {g}
                        </li>
                    ))}
                </ul>
             </div>
        </div>
    </div>
);

export const SystemDiagram = () => {
    return (
        <div className="animate-fade-in bg-paper text-ink min-h-screen">
            
            {/* --- HERO HEADER --- */}
            <div className="border-b border-ink pt-20 pb-12 px-6 md:px-12 bg-dot-grid">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-ink text-white px-2 py-1 font-mono text-[10px] uppercase font-bold tracking-widest">
                            Operating Manual v1.0
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                            Last Revised: Jan 2025
                        </div>
                    </div>
                    
                    <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter mb-8">
                        The Pipeline.
                    </h1>
                    
                    <p className="font-sans text-lg md:text-2xl text-subtle max-w-2xl leading-relaxed border-l-4 border-accent pl-8">
                        Escalay is a constraint engine. It forces ideas to earn their complexity through 
                        layers of validation. We don't build looking for problems; we build to solve pain.
                    </p>
                </div>
            </div>

            {/* --- PHILOSOPHY GRID --- */}
            <div className="border-b border-ink">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-ink border-x border-ink bg-white">
                    {[
                        { num: '01', title: 'Start Small, Fail Fast', text: 'Every idea begins as a lab note costing $0. Kill bad ideas before they become bad code.' },
                        { num: '02', title: 'Public by Default', text: 'Transparency creates accountability. Share the wins, the losses, and the revenue.' },
                        { num: '03', title: 'Solve Your Pain', text: 'You are user zero. If you won\'t use it daily, don\'t build it for others.' },
                        { num: '04', title: 'Revenue is Validation', text: 'Money is the only honest feedback. A single $5 payment outweighs 1,000 likes.' }
                    ].map((item, idx) => (
                         <div key={idx} className="p-8 group hover:bg-level-0 transition-colors">
                            <div className="font-mono text-4xl mb-4 font-bold text-ink/10 group-hover:text-accent transition-colors">{item.num}</div>
                            <h3 className="font-serif text-xl mb-2 italic">{item.title}</h3>
                            <p className="font-sans text-xs text-subtle leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- THE POWER LAW (Visual) --- */}
            <PowerLawDiagram />

            {/* --- THE PIPELINE (Detailed Specs) --- */}
            <div className="max-w-7xl mx-auto border-x border-ink bg-white">
                <div className="p-4 bg-ink text-white font-mono text-xs uppercase font-bold tracking-widest flex justify-between items-center sticky top-14 z-20">
                    <span>Progression System</span>
                    <span>Scroll Down ↓</span>
                </div>

                <LevelSpec 
                    level="0"
                    bgColorClass="bg-level-0"
                    title="The Lab Note"
                    time="2-4 Hours"
                    desc="Pure ideation and feasibility study. No code allowed. Just markdown, research, and a go/no-go decision."
                    stack={['Markdown', 'Market Research', 'Competitor Analysis']}
                    gate={[
                        'Problem is clearly articulated',
                        'Solution is technically feasible',
                        'Excitement persists after 24h',
                        'Market research completed'
                    ]}
                />

                <LevelSpec 
                    level="1"
                    bgColorClass="bg-level-1"
                    title="The Experiment"
                    time="10-20 Hours"
                    desc="A rapid prototype to validate the core interaction. Does it work? Is it useful? Rough edges are expected."
                    stack={['Next.js (App Router)', 'Tailwind CSS', 'Vercel Free Tier', 'No Auth / No DB']}
                    gate={[
                        '50+ Unique Visitors',
                        'You use it 3+ times/week',
                        'Core feature actually works',
                        'Positive external feedback'
                    ]}
                />

                <LevelSpec 
                    level="2"
                    bgColorClass="bg-level-2"
                    title="The Project"
                    time="40-60 Hours"
                    desc="A multi-feature tool with persistence. This is where you address the 'Yeah, but...' feedback. It becomes a reliable utility."
                    stack={['Supabase / PocketBase', 'Authentication', 'Stripe Integration', 'User Dashboard']}
                    gate={[
                        '100+ Signups',
                        '$50 Monthly Revenue',
                        'Clear path to monetization',
                        'Users requesting features'
                    ]}
                />

                <LevelSpec 
                    level="3"
                    bgColorClass="bg-level-3"
                    title="The Product"
                    time="100+ Hours"
                    desc="A business. Scalable infrastructure, customer support, and growth marketing. It pays for its own existence."
                    stack={['AWS / Production Infra', 'Monitoring & Logging', 'Customer Support System', 'Legal & Compliance']}
                    gate={[
                        '$100+ MRR',
                        'Sustainable Growth',
                        '<5% Churn',
                        'Automated Operations'
                    ]}
                    isLast={true}
                />
            </div>

            {/* --- THE RHYTHM (Weekly System) --- */}
            <div className="border-y border-ink bg-ink text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                
                <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-serif text-5xl md:text-6xl mb-8">The Weekly Pulse.</h2>
                        <p className="font-sans text-xl text-white/70 mb-8 leading-relaxed">
                            We don't rely on motivation. We rely on rhythm. The studio operates on a strict 7-day cycle to ensure consistent output.
                        </p>
                        <div className="space-y-6 font-mono text-sm">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 font-bold text-accent">MON</div>
                                <div className="flex-1 border-b border-white/20 pb-2">Planning & Prioritization</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 font-bold text-white/50">TUE-THU</div>
                                <div className="flex-1 border-b border-white/20 pb-2">Deep Work (Feature Dev)</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 font-bold text-accent">FRI</div>
                                <div className="flex-1 border-b border-white/20 pb-2">Experiment Day (New Ideas)</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 font-bold text-white/50">SAT-SUN</div>
                                <div className="flex-1 border-b border-white/20 pb-2">Documentation & Rest</div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/20 p-8 bg-white/5 rounded-sm">
                        <div className="font-mono text-xs uppercase tracking-widest mb-6 border-b border-white/20 pb-4 flex justify-between">
                            <span>Focus Protocol</span>
                            <span className="text-accent animate-pulse">● Active</span>
                        </div>
                        <ul className="space-y-4 font-sans text-sm text-white/80">
                            <li className="flex gap-3">
                                <span className="text-accent">01.</span>
                                <span>One active experiment at a time. No multitasking.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-accent">02.</span>
                                <span>No new features until current level graduation.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-accent">03.</span>
                                <span>Documentation happens <i>while</i> building, not after.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-accent">04.</span>
                                <span>If it takes {'>'}20 hours for L1, kill it.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};