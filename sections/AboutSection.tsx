'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [textRect, setTextRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 0, left: 0, width: 0, height: 0 });
  const [highlightMode, setHighlightMode] = useState<'all' | 'background' | 'skills' | 'interests'>('all');
  
  // Store current opacity values for smooth lerping
  const opacityMapRef = useRef<Map<HTMLElement, number>>(new Map());
  const animationFrameRef = useRef<number>(0);

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

  // Track text content rect in viewport coordinates
  const updateTextRect = useCallback(() => {
    if (textContentRef.current) {
      const rect = textContentRef.current.getBoundingClientRect();
      setTextRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    updateTextRect();
    window.addEventListener('resize', updateTextRect);
    window.addEventListener('scroll', updateTextRect, { passive: true });

    return () => {
      window.removeEventListener('resize', updateTextRect);
      window.removeEventListener('scroll', updateTextRect);
    };
  }, [isVisible, updateTextRect]);

  // Track mouse position using ref for smoother updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
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

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const lerp = (current: number, target: number, factor: number): number => {
      return current + (target - current) * factor;
    };

    const calculateTargetOpacity = (el: HTMLElement): number => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const category = el.getAttribute('data-category');

      const textTop = textRect.top;
      const textLeft = textRect.left;
      const textRight = textRect.left + textRect.width;
      const textBottom = textRect.top + textRect.height;

      // Distance to text rectangle (0 when inside)
      const dx = Math.max(textLeft - centerX, 0, centerX - textRight);
      const dy = Math.max(textTop - centerY, 0, centerY - textBottom);
      const distToText = Math.sqrt(dx * dx + dy * dy);

      // Adjust fade parameters based on highlight mode
      let innerRadius = 0;
      let outerRadius = 240;
      let minOpacityNearText = 0.0;
      let baseOpacity = 0.12;

      if (highlightMode === 'skills') {
        if (category === 'skill') {
          baseOpacity = 0.65;
          minOpacityNearText = 0.65;
          outerRadius = 0;
        } else {
          baseOpacity = 0.03;
          minOpacityNearText = 0.03;
          outerRadius = 0;
        }
      } else if (highlightMode === 'interests') {
        if (category === 'interest') {
          baseOpacity = 0.65;
          minOpacityNearText = 0.65;
          outerRadius = 0;
        } else {
          baseOpacity = 0.03;
          minOpacityNearText = 0.03;
          outerRadius = 0;
        }
      } else if (highlightMode === 'background') {
        baseOpacity = 0.06;
        minOpacityNearText = 0.0;
        outerRadius = 180;
      }

      let textFadeOpacity: number;

      if (distToText <= innerRadius) {
        textFadeOpacity = minOpacityNearText;
      } else if (distToText >= outerRadius) {
        textFadeOpacity = baseOpacity;
      } else {
        const t = (distToText - innerRadius) / (outerRadius - innerRadius);
        textFadeOpacity = minOpacityNearText + (baseOpacity - minOpacityNearText) * t;
      }

      // Mouse-based hover
      let mouseBoost = 0;
      if (highlightMode === 'background' || highlightMode === 'all') {
        const textFadeInfluence = outerRadius > 0 
          ? Math.min(1, distToText / outerRadius) 
          : 1;
        
        const mouseX = mousePosRef.current.x;
        const mouseY = mousePosRef.current.y;

        const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
        const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
        const mouseDx = mouseX - closestX;
        const mouseDy = mouseY - closestY;
        const distToMouse = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        const mouseInfluenceRadius = 220;

        if (distToMouse < mouseInfluenceRadius) {
          // Use easeOutCubic for smoother falloff
          const normalizedDist = distToMouse / mouseInfluenceRadius;
          const m = 1 - normalizedDist * normalizedDist * normalizedDist;
          mouseBoost = m * 0.55 * textFadeInfluence;
        }
      }

      return Math.max(minOpacityNearText, Math.min(1.0, textFadeOpacity + mouseBoost));
    };

    const animate = () => {
      const spans = scrollContainerRef.current?.querySelectorAll<HTMLElement>('[data-tech-span="true"]');
      if (!spans) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      spans.forEach((el) => {
        const targetOpacity = calculateTargetOpacity(el);
        const currentOpacity = opacityMapRef.current.get(el) ?? targetOpacity;
        
        // Lerp factor controls smoothness (lower = smoother but slower)
        // 0.08-0.12 is a good range for smooth transitions
        const lerpFactor = 0.1;
        const newOpacity = lerp(currentOpacity, targetOpacity, lerpFactor);
        
        opacityMapRef.current.set(el, newOpacity);
        el.style.opacity = String(newOpacity);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [textRect, highlightMode]);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen relative pointer-events-auto overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm -z-10" />

      {/* Scrolling background text with per-span fade */}
      <div
        ref={scrollContainerRef}
        className={`absolute inset-0 flex flex-col justify-around transition-opacity duration-1000 ${
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
                    style={{ fontFamily: "'Playfair Display', serif" }}
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
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {tech.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

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
              <div ref={textContentRef} data-about-text="true" className={`md:col-span-2 space-y-16 transition-opacity duration-500 ${
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