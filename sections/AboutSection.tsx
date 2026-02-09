'use client';

import { useRef, useState, useEffect } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightMode, setHighlightMode] = useState<'all' | 'background' | 'skills' | 'interests'>('all');

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Listen for contextual actions from navbar
  useEffect(() => {
    const handleAboutAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail;

      if (action === 'background') {
        setHighlightMode('background');
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const textContent = aboutSection.querySelector('[data-about-text="true"]');
          textContent?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (action === 'skills') {
        setHighlightMode('skills');
        const aboutSection = document.getElementById('about');
        aboutSection?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'interests') {
        setHighlightMode('interests');
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const textContent = aboutSection.querySelector('[data-about-text="true"]');
          textContent?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('aboutAction', handleAboutAction as EventListener);
    return () => {
      window.removeEventListener('aboutAction', handleAboutAction as EventListener);
    };
  }, []);

  // Mouse-following spotlight for the scrolling tech background
  useEffect(() => {
    const spotlight = spotlightRef.current;
    const container = scrollContainerRef.current;
    if (!spotlight || !container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        spotlight.style.opacity = '1';
        spotlight.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
        spotlight.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
      } else {
        spotlight.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const technologies = [
    { text: 'kubernetes', category: 'skill' },
    { text: 'competitive programming', category: 'interest' },
    { text: 'docker', category: 'skill' },
    { text: 'minecraft development', category: 'interest' },
    { text: 'java', category: 'skill' },
    { text: 'algorithm design', category: 'interest' },
    { text: 'python', category: 'skill' },
    { text: 'open source', category: 'interest' },
    { text: 'react', category: 'skill' },
    { text: 'hackathons', category: 'interest' },
    { text: 'typescript', category: 'skill' },
    { text: 'system architecture', category: 'interest' },
    { text: 'postgresql', category: 'skill' },
    { text: 'mathematics', category: 'interest' },
    { text: 'kafka', category: 'skill' },
    { text: 'machine learning', category: 'interest' },
    { text: 'mongodb', category: 'skill' },
    { text: 'data science', category: 'interest' },
    { text: 'next.js', category: 'skill' },
    { text: 'artificial intelligence', category: 'interest' },
    { text: 'node.js', category: 'skill' },
    { text: 'deep learning', category: 'interest' },
    { text: 'redis', category: 'skill' },
    { text: 'neural networks', category: 'interest' },
    { text: 'aws', category: 'skill' },
    { text: 'problem solving', category: 'interest' },
    { text: 'graphql', category: 'skill' },
    { text: 'graph theory', category: 'interest' },
    { text: 'terraform', category: 'skill' },
    { text: 'dynamic programming', category: 'interest' },
    { text: 'google cloud', category: 'skill' },
    { text: 'game development', category: 'interest' },
    { text: 'jenkins', category: 'skill' },
    { text: 'multiplayer systems', category: 'interest' },
    { text: 'rest apis', category: 'skill' },
    { text: 'plugin architecture', category: 'interest' },
    { text: 'azure', category: 'skill' },
    { text: 'optimization', category: 'interest' },
    { text: 'spring boot', category: 'skill' },
    { text: 'scalability', category: 'interest' },
    { text: 'github actions', category: 'skill' },
    { text: 'distributed systems', category: 'interest' },
    { text: 'fastapi', category: 'skill' },
    { text: 'event sourcing', category: 'interest' },
    { text: 'mysql', category: 'skill' },
    { text: 'cqrs', category: 'interest' },
    { text: 'express.js', category: 'skill' },
    { text: 'number theory', category: 'interest' },
    { text: 'grpc', category: 'skill' },
    { text: 'combinatorics', category: 'interest' },
    { text: 'elasticsearch', category: 'skill' },
    { text: 'coding competitions', category: 'interest' },
    { text: 'rabbitmq', category: 'skill' },
    { text: 'software engineering', category: 'interest' },
    { text: 'nginx', category: 'skill' },
    { text: 'performance tuning', category: 'interest' },
    { text: 'linux', category: 'skill' },
    { text: 'debugging', category: 'interest' },
    { text: 'bash', category: 'skill' },
    { text: 'refactoring', category: 'interest' },
    { text: 'git', category: 'skill' },
    { text: 'code review', category: 'interest' },
    { text: 'ci/cd', category: 'skill' },
    { text: 'team collaboration', category: 'interest' },
    { text: 'microservices', category: 'skill' },
    { text: 'mentoring', category: 'interest' },
    { text: 'devops', category: 'skill' },
    { text: 'teaching', category: 'interest' },
    { text: 'monitoring', category: 'skill' },
    { text: 'technical writing', category: 'interest' },
  ];

  const activeHighlight =
    highlightMode === 'skills' ? 'skill' : highlightMode === 'interests' ? 'interest' : null;

  const getSpanOpacity = (category: string): number => {
    if (activeHighlight) return category === activeHighlight ? 0.65 : 0.03;
    return 0.12;
  };

  const highlightClass =
    highlightMode === 'skills'
      ? 'highlight-skills'
      : highlightMode === 'interests'
        ? 'highlight-interests'
        : '';

  return (
    <section id="about" ref={sectionRef} className="min-h-screen relative pointer-events-auto overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm -z-10" />

      {/* Scrolling background text with per-span fade */}
      <div
        ref={scrollContainerRef}
        className={`absolute inset-0 flex flex-col justify-around transition-opacity duration-1000 ${highlightClass} ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          zIndex: 0,
          padding: '10vh 0'
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => {
          const isEven = rowIndex % 2 === 0;
          const shuffledTechs = [...technologies].slice(rowIndex * 10).concat([...technologies].slice(0, rowIndex * 10));

          return (
            <div
              key={rowIndex}
              className="relative flex overflow-hidden"
            >
              <div
                className={`flex whitespace-nowrap ${
                  isEven ? 'animate-scroll-left' : 'animate-scroll-right'
                }`}
              >
                {shuffledTechs.map((tech, index) => (
                  <span
                    key={`row${rowIndex}-a-${index}`}
                    data-tech-span="true"
                    data-category={tech.category}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-violet-500 mx-6 md:mx-10"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      opacity: getSpanOpacity(tech.category),
                      transition: 'opacity 0.5s ease',
                    }}
                  >
                    {tech.text}
                  </span>
                ))}
              </div>
              <div
                className={`flex whitespace-nowrap ${
                  isEven ? 'animate-scroll-left' : 'animate-scroll-right'
                }`}
                aria-hidden="true"
              >
                {shuffledTechs.map((tech, index) => (
                  <span
                    key={`row${rowIndex}-b-${index}`}
                    data-tech-span="true"
                    data-category={tech.category}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-violet-500 mx-6 md:mx-10"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      opacity: getSpanOpacity(tech.category),
                      transition: 'opacity 0.5s ease',
                    }}
                  >
                    {tech.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(circle 250px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(139,92,246,0.4) 0%, transparent 100%)',
          mixBlendMode: 'lighten',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Foreground content */}
      <div className="relative min-h-screen flex flex-col" style={{ zIndex: 10 }}>
        {/* ABOUT ME label at top */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 w-full pt-24">
          <div className="grid md:grid-cols-3 gap-12 md:gap-24">
            <div>
              <div className="flex items-center gap-4">
                <div
                  className={`h-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500 transition-all duration-1000 ${
                    isVisible ? 'w-24' : 'w-0'
                  }`}
                />
                <span
                  className={`text-xs tracking-[0.3em] text-violet-400/60 whitespace-nowrap transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  ABOUT ME
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - vertically centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
            <div className="grid md:grid-cols-3 gap-12 md:gap-24">
              <div />
              <div data-about-text="true" className={`md:col-span-2 space-y-16 transition-opacity duration-500 ${
                highlightMode === 'skills' || highlightMode === 'interests' ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}>
                <h2
                  className={`text-4xl md:text-5xl lg:text-6xl font-light leading-[1.4] transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span className="text-white">Hello! My name is </span>
                  <span
                    className="inline-block"
                    style={{
                      background: 'linear-gradient(180deg, #c4b5fd 0%, #a855f7 50%, #d946ef 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Swofty
                  </span>
                  <br className="hidden md:block" />
                  <span className="text-white">and I enjoy creating things</span>
                  <br className="hidden md:block" />
                  <span className="text-white">that live on the internet.</span>
                </h2>

                <div
                  className={`space-y-8 transition-all duration-1000 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <p className="text-white/70 text-xl leading-[1.8] max-w-2xl">
                    I'm a <span className="text-violet-300/90">computer science student</span> and competitive programmer,
                    currently studying Advanced Computer Science with Honours at university.
                  </p>

                  <p className="text-white/70 text-xl leading-[1.8] max-w-2xl">
                    Majoring in <span className="text-violet-300/90">Mathematics</span> and specializing in{' '}
                    <span className="text-violet-300/90">Data Science</span> and{' '}
                    <span className="text-violet-300/90">Artificial Intelligence</span>.
                  </p>

                  <p className="text-white/70 text-xl leading-[1.8] max-w-2xl">
                    I have extensive experience with <span className="text-violet-300/90">Minecraft development</span> and
                    building large-scale multiplayer experiences, including an open source Hypixel SkyBlock
                    recreation that has gained hundreds of stars on GitHub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
