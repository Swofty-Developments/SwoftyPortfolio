'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import type { Application } from '@splinetool/runtime';
import { useScrollLock } from './hooks/useScrollLock';

import 'swiper/css';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: 'skyblock',
    title: 'SkyBlock Recreation',
    description:
      'The best commercial Hypixel SkyBlock Sandbox / Recreation currently available. Contains Gemstones, 70% of Hypixels Items, Dwarven Mines, Guilds, Auction House, NPC shops, Quests, Islands, Bazaar and just about everything else!',
    tags: ['Spigot Library', 'Advanced NMS', 'Java', 'Cloudflare (Anti-DDOS)'],
    link: '#',
  },
  {
    id: 'mcmarket',
    title: '2nd Biggest MCMarket Setup',
    description:
      'I both hosted and helped develop the former 2nd highest rated setup on BuiltByBit (formerly MCMarket). It was a detailed SkyBlock setup utilizing a combination of 30 different plugins - The project helped me learn server setup, server development and most importantly DevOps.',
    tags: ['Server Setup', 'Spigot Library', 'Java'],
    link: '#',
  },
  {
    id: 'hyperlands',
    title: 'HyperLands',
    description:
      'Hyperlands is the former second biggest non-featured MCPE server, with it hitting peaks of over 2k players. I have helped develop, test, and create ideas for the server with me currently specializing in Web Development. The server boasts an active discord community of 30,000 people of which I have been a member of since 2019.',
    tags: ['React', 'Express', 'Styled Components', 'Proxy Development', 'Game Design'],
    link: '#',
  },
];

interface ProjectCardProps {
  project: Project;
  alignment: 'left' | 'right';
}

function ProjectCard({ project, alignment }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: alignment === 'left' ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: alignment === 'left' ? -30 : 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`
        absolute top-1/2 -translate-y-1/2 z-20 pointer-events-auto
        ${alignment === 'left' ? 'left-[5%] md:left-[8%] lg:left-[12%]' : 'right-[5%] md:right-[8%] lg:right-[12%]'}
      `}
    >
      <div
        className="relative w-[320px] md:w-[400px] lg:w-[440px] rounded-2xl p-6 md:p-8 lg:p-10 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(20, 12, 35, 0.92) 0%, rgba(12, 8, 24, 0.95) 100%)',
          boxShadow: '0 8px 64px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 20% 10%, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 space-y-5 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <span
              className="inline-block text-[9px] md:text-[10px] tracking-[0.3em] text-violet-400/70 uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Featured Project
            </span>
            <h3
              className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {project.title}
            </h3>
          </div>

          <p className="text-white/55 text-xs md:text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] md:text-[10px] text-violet-300/60 px-2 md:px-3 py-1 rounded-full border border-violet-500/15 bg-violet-500/5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-2 md:pt-3">
            <a
              href={project.link}
              className="inline-flex items-center gap-2 text-xs md:text-sm text-violet-400/80 hover:text-violet-300 transition-colors group"
            >
              <span className="tracking-wide">Explore Project</span>
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SectionHeaderProps {
  isVisible: boolean;
  alignment: 'left' | 'right';
}

function SectionHeader({ isVisible, alignment }: SectionHeaderProps) {
  const isRight = alignment === 'right';

  return (
    <motion.div
      className={`absolute top-20 md:top-24 z-20 pointer-events-none ${
        isRight 
          ? 'right-6 md:right-12 lg:right-16 text-right' 
          : 'left-6 md:left-12 lg:left-16'
      }`}
      initial={{ opacity: 0, x: isRight ? 60 : -60 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : (isRight ? 60 : -60) 
      }}
      exit={{ opacity: 0, x: isRight ? 30 : -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`flex items-center gap-4 mb-4 ${isRight ? 'flex-row-reverse' : ''}`}>
        <motion.div
          className={`h-[1px] ${
            isRight 
              ? 'bg-gradient-to-l from-violet-500/0 via-violet-500/60 to-violet-500' 
              : 'bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? 80 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.span
          className="text-[10px] tracking-[0.3em] text-violet-400/50 whitespace-nowrap uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Selected Work
        </motion.span>
      </div>

      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-light text-white"
        style={{ fontFamily: "'Playfair Display', serif" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Featured{' '}
        <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Projects
        </span>
      </motion.h2>
    </motion.div>
  );
}

function SlideIndicators({ currentSlide, total }: { currentSlide: number; total: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-none">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className="h-[2px] rounded-full"
          initial={false}
          animate={{
            width: index === currentSlide ? 32 : 12,
            backgroundColor: index === currentSlide ? '#a78bfa' : 'rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const splineRef = useRef<Application | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // Custom scroll locking
  useScrollLock({
    sectionRef: sectionRef as React.RefObject<HTMLElement>,
    swiperRef,
    totalSlides: projects.length,
  });

  const handleSplineLoad = useCallback((spline: Application) => {
    splineRef.current = spline;
    setSplineLoaded(true);
  }, []);

  // Trigger Spline hover animation based on current slide
  useEffect(() => {
    if (!splineRef.current || !splineLoaded) return;

    const triggerObjectName = 'Hover Trigger';

    if (currentSlide === 1) {
      splineRef.current.emitEvent('mouseHover', triggerObjectName);
    } else {
      splineRef.current.emitEventReverse('mouseHover', triggerObjectName);
    }
  }, [currentSlide, splineLoaded]);

  // Intersection observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getSplineOffset = (): string => {
    const offsets = ['18%', '-18%', '18%'];
    return offsets[currentSlide] || '0%';
  };

  const getCardAlignment = (index: number): 'left' | 'right' => {
    return index % 2 === 0 ? 'left' : 'right';
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative h-screen overflow-hidden mt-48"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/20 to-black" />

      {/* Spline container - outside Swiper so it persists */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        initial={false}
        animate={{ x: getSplineOffset() }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          className="w-full h-full"
          initial={false}
          animate={{ scale: currentSlide === 1 ? 1.12 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Spline
            scene="https://prod.spline.design/XOofHU3h92QIMFKI/scene.splinecode"
            onLoad={handleSplineLoad}
          />
        </motion.div>
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-[5] pointer-events-none" />

      {/* Section header - shows on slides 0 and 2 (left), slide 1 (right) */}
      <AnimatePresence mode="wait">
        {currentSlide === 1 ? (
          <SectionHeader 
            key="header-right"
            isVisible={isInView} 
            alignment="right" 
          />
        ) : (
          <SectionHeader 
            key="header-left"
            isVisible={isInView} 
            alignment="left" 
          />
        )}
      </AnimatePresence>

      {/* Swiper for slide navigation - we handle mousewheel ourselves */}
      <Swiper
        direction="vertical"
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex);
        }}
        allowTouchMove={true}
        speed={600}
        className="h-full w-full relative z-10"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.id}>
            <div className="relative h-full pointer-events-none">
              <AnimatePresence mode="wait">
                {index === currentSlide && (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    alignment={getCardAlignment(index)}
                  />
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide indicators */}
      <SlideIndicators currentSlide={currentSlide} total={projects.length} />
    </section>
  );
}