'use client';

import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  isLocked: boolean;
  index: number;
  isVisible: boolean;
}

export default function ProjectCard({ title, category, isLocked, index, isVisible }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    'from-violet-900/50 to-zinc-900',
    'from-purple-900/40 to-zinc-900',
    'from-fuchsia-900/40 to-zinc-900',
    'from-indigo-900/40 to-zinc-900',
    'from-violet-800/40 to-zinc-900',
  ];

  return (
    <div
      className={`group relative aspect-[4/5] overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.15) 0%, transparent 50%)'
        }}></div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-14 h-14 border border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9 15.84V18.53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-violet-400/60"/>
                <path d="M18.87 23.92H0.93V10.46H18.87V23.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-violet-400/60"/>
                <path d="M17.08 10.46V7.76C17.08 3.8 13.86 0.59 9.9 0.59C5.94 0.59 2.72 3.8 2.72 7.76V10.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-violet-400/60"/>
              </svg>
            </div>
            <span className="text-xs tracking-[0.25em] text-violet-300/40">UNDER NDA</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3
          className={`text-2xl md:text-3xl font-light text-white mb-2 transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-1'}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>
        <p className={`text-violet-300/50 text-xs tracking-[0.15em] transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-1'}`}>
          {category}
        </p>
      </div>

      <div className={`absolute bottom-6 right-6 w-10 h-10 border border-violet-500/30 rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100 scale-100 bg-violet-500/20' : 'opacity-0 scale-75'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-300">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </div>
  );
}
