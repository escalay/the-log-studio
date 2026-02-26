
import React from 'react';

export const EchoLogo = () => (
  <div className="relative h-24 w-full overflow-hidden select-none">
    {[0, 1, 2, 3, 4].map((i) => (
      <div 
        key={i}
        className="absolute inset-0 flex items-center justify-center font-serif text-8xl italic font-black tracking-tighter"
        style={{ 
            top: `${i * -8}px`, 
            opacity: i === 0 ? 1 : (0.4 - i * 0.08),
            zIndex: 10 - i,
            color: i === 0 ? '#111' : 'transparent',
            WebkitTextStroke: i === 0 ? '0px' : '1px #111',
            transform: `scale(${1 - i * 0.05})`
        }}
      >
        log.studio
      </div>
    ))}
  </div>
);

export const PipelineLine = () => (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none">
        {/* Start Node */}
        <circle cx="60" cy="80" r="6" fill="#FDFCF8" stroke="#111" strokeWidth="2" />
        <text x="50" y="60" className="font-mono text-[10px] fill-subtle">START</text>
        
        {/* Path */}
        <path 
            d="M 66 80 H 120 C 140 80 140 80 140 100 V 160 C 140 180 140 180 160 180 H 300"
            fill="none" 
            stroke="#111" 
            strokeWidth="2" 
            className="md:block hidden"
        />
        
        {/* Connection Points on Grid */}
        <circle cx="300" cy="180" r="4" fill="#111" className="md:block hidden" />
    </svg>
);
