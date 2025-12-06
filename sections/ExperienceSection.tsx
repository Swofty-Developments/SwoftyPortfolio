'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceOrAward, Experience, Award } from '@/types/experience';

type ParticleConfig = {
  uX: number;
  uY: number;
  ampX: number;
  ampY: number;
  speed: number;
  size: number;
};

type OrbState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  driftPhase: number;
  driftSpeed: number;
};

const ORB_RADIUS = 80;
const ORB_BUFFER = 28;
const HOVER_RADIUS = ORB_RADIUS + 20;
const PARTICLE_LINK_DISTANCE = 180;

const ATTRACTION_STRENGTH = 0.0000042;
const REPULSION_STRENGTH = 30000;
const REPULSION_RADIUS = 200;
const DAMPING = 0.985;
const MAX_VELOCITY = 5.5;
const MIN_VELOCITY_THRESHOLD = 0.02;
const RELEASE_DELAY_MS = 150;
const IDLE_DRIFT_STRENGTH = 0.08;

const GRAB_STRENGTH = 0.00008;
const GRAB_MAX_VELOCITY = 12;
const POST_GRAB_MOMENTUM_MS = 400;
const POST_GRAB_DAMPING = 0.995;

const noise = (x: number, y: number, t: number): number => {
  const n1 = Math.sin(x * 0.01 + t * 0.3) * Math.cos(y * 0.012 + t * 0.2);
  const n2 = Math.sin(x * 0.008 - t * 0.15) * Math.sin(y * 0.009 + t * 0.25);
  const n3 = Math.cos(x * 0.015 + y * 0.01 + t * 0.1);
  return (n1 + n2 + n3) / 3;
};

const createSeededRandom = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const createOrbStates = (count: number): OrbState[] => {
  const rand = createSeededRandom(20250216);
  const states: OrbState[] = [];
  const MIN_DISTANCE = ORB_RADIUS * 2 + ORB_BUFFER;
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let newPos = { x: 0, y: 0 };

    while (!validPosition && attempts < maxAttempts) {
      newPos = {
        x: (rand() - 0.5) * 480,
        y: (rand() - 0.5) * 280,
      };

      validPosition = states.every(existingState => {
        const dx = newPos.x - existingState.x;
        const dy = newPos.y - existingState.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= MIN_DISTANCE;
      });

      attempts++;
    }

    states.push({
      x: newPos.x,
      y: newPos.y,
      vx: 0,
      vy: 0,
      mass: 0.7 + rand() * 0.6,
      driftPhase: rand() * Math.PI * 2,
      driftSpeed: 0.0003 + rand() * 0.0004,
    });
  }

  return states;
};

const createParticleConfig = (): ParticleConfig[] => {
  const rand = createSeededRandom(20250301);
  return Array.from({ length: 42 }, () => ({
    uX: rand(),
    uY: rand(),
    ampX: 40 + rand() * 40,
    ampY: 40 + rand() * 40,
    speed: 0.08 + rand() * 0.16,
    size: 1.5 + rand() * 2,
  }));
};

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExperienceOrAward | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [cursorInside, setCursorInside] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'experience' | 'awards'>('all');
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [, forceRender] = useState(0);

  const mouseRef = useRef({ x: 0, y: 0, inside: false, grabbing: false });
  const lastHoveredRef = useRef({ index: -1, releaseTime: 0 });
  const grabReleaseTimeRef = useRef(0);
  const particleConfigRef = useRef<ParticleConfig[]>(createParticleConfig());

  const experiences: Experience[] = [
    {
      id: 'mac',
      title: 'Projects Officer',
      company: 'Monash Association of Coding',
      period: 'Oct 2025 - Present',
      location: 'Hybrid',
      description:
        "Designed, coordinated and delivered a range of hands-on coding projects and technical workshops for MAC's student community. Collaborated with committee teams and industry partners to scope project requirements, organise resources and oversee execution from initial concept through to completion.",
      type: 'experience',
    },
    {
      id: 'ceebs',
      title: 'Technical Project Manager',
      company: 'Ceebs',
      period: 'Aug 2025 - Present',
      location: 'Melbourne, VIC',
      description:
        'Designed, developed and orchestrated a large refactor from a monolithic architecture to a microservices based food delivery platform. Delivered an event-sourced CQRS architecture with Kafka as event store, PostgreSQL as read model projection, Redis for geospatial indexing and pub/sub.',
      type: 'experience',
    },
    {
      id: 'bathroom',
      title: 'Systems Administrator',
      company: 'Bathroom Superstore',
      period: 'Nov 2024 - Present',
      location: 'Melbourne, VIC',
      description:
        'Designed, developed and maintained infrastructure serving over a thousand catalogue items and tens of thousands of monthly requests. Orchestrated various services using docker, and implemented advanced logging through Datadog.',
      type: 'experience',
    },
    {
      id: 'hypixel',
      title: 'Software Engineer',
      company: 'Hypixel Inc',
      period: 'Sep 2023 - Nov 2024',
      location: 'Remote',
      description:
        "Managed and consulted on large-scale infrastructure systems for one of the world's biggest gaming networks, supporting 200,000+ concurrent players. Architected and optimised DevOps pipelines using Kubernetes, Prometheus, and Grafana.",
      type: 'experience',
    },
    {
      id: 'schs',
      title: 'Student Ambassador',
      company: 'Suzanne Cory High School',
      period: 'Nov 2022 - Nov 2023',
      location: 'Melbourne, VIC',
      description:
        'Played an active role within the school community by helping run formal events and guiding prospective students. Participated as an interviewer on the staff hiring panel.',
      type: 'experience',
    },
  ];

  const awards: Award[] = [
    {
      id: 'mcpc-2025',
      title: '2nd Place MCPC 2025',
      issuer: 'Monash Algorithms and Problem Solving',
      date: 'Oct 2025',
      description:
        'Pioneered a small team to win 2nd place in the yearly Monash Collegiate Programming Competition. Skills involved were algorithm design and implementation, set theory and number theory.',
      type: 'award',
    },
    {
      id: 'advent-2025',
      title: '1st Place Advent of MAPS',
      issuer: 'Monash Algorithms and Problem Solving',
      date: 'Aug 2025',
      description:
        'Won 1st place in the yearly month-long competitive programming competition. Skills include graph theory, number theory, dynamic programming, and algorithm optimization.',
      type: 'award',
    },
    {
      id: 'macathon-2025',
      title: '1st Place MACATHON 2025',
      issuer: 'Monash Association of Coding',
      date: 'May 2025',
      description:
        "Led a team to win 1st place and $1,800 prize at Monash University's 48-hour hackathon with Catch N Go, a location-based app built using Python/FastAPI, MongoDB, Kotlin, and OpenAI.",
      type: 'award',
    },
    {
      id: 'future-innovators',
      title: 'Future Innovators',
      issuer: 'Australian Defence Force',
      date: 'Nov 2024',
      description:
        'Recognized for innovative thinking and technical excellence in software development and system design.',
      type: 'award',
    },
  ];

  const allItems: ExperienceOrAward[] = [...experiences, ...awards];
  const orbStatesRef = useRef<OrbState[]>(createOrbStates(allItems.length));
  const orbStates = orbStatesRef.current;

  const filteredItems = filterType === 'all'
    ? allItems
    : allItems.filter(item =>
        filterType === 'experience' ? item.type === 'experience' : item.type === 'award'
      );

  useEffect(() => {
    const handleResetOrbs = () => {
      const rand = createSeededRandom(Date.now());
      const rect = containerRef.current?.getBoundingClientRect();
      const halfWidth = rect ? rect.width / 2 : 520;
      const halfHeight = rect ? rect.height / 2 : 360;
      const MIN_DISTANCE = ORB_RADIUS * 2 + ORB_BUFFER;
      const maxAttempts = 100;

      for (let i = 0; i < orbStates.length; i++) {
        let attempts = 0;
        let validPosition = false;
        let newPos = { x: 0, y: 0 };

        while (!validPosition && attempts < maxAttempts) {
          newPos = {
            x: (rand() - 0.5) * (halfWidth - ORB_RADIUS * 2),
            y: (rand() - 0.5) * (halfHeight - ORB_RADIUS * 2),
          };

          validPosition = orbStates.every((existingState, idx) => {
            if (idx >= i) return true;
            const dx = newPos.x - existingState.x;
            const dy = newPos.y - existingState.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance >= MIN_DISTANCE;
          });

          attempts++;
        }

        orbStates[i].x = newPos.x;
        orbStates[i].y = newPos.y;
        orbStates[i].vx = 0;
        orbStates[i].vy = 0;
      }
    };

    const handleFilterExperience = (e: Event) => {
      const customEvent = e as CustomEvent;
      setFilterType(customEvent.detail);
    };

    window.addEventListener('resetOrbs', handleResetOrbs);
    window.addEventListener('filterExperience', handleFilterExperience as EventListener);

    return () => {
      window.removeEventListener('resetOrbs', handleResetOrbs);
      window.removeEventListener('filterExperience', handleFilterExperience as EventListener);
    };
  }, [orbStates]);

  useEffect(() => {
    mouseRef.current = { x: mousePos.x, y: mousePos.y, inside: cursorInside, grabbing: isGrabbing };
  }, [mousePos, cursorInside, isGrabbing]);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let lastTime = performance.now();

    let wasGrabbing = false;
    
    const animate = (timestamp: number) => {
      const dt = Math.min(0.05, (timestamp - lastTime) / 1000 || 0.016);
      lastTime = timestamp;
      setTime((t) => t + dt);

      const mouse = mouseRef.current;
      const now = performance.now();

      // Track grab release for momentum preservation
      if (wasGrabbing && !mouse.grabbing) {
        grabReleaseTimeRef.current = now;
      }
      wasGrabbing = mouse.grabbing;
      
      const timeSinceGrabRelease = now - grabReleaseTimeRef.current;
      const isInPostGrabMomentum = timeSinceGrabRelease < POST_GRAB_MOMENTUM_MS && grabReleaseTimeRef.current > 0;

      const rect = containerRef.current?.getBoundingClientRect();
      const halfWidth = rect ? rect.width / 2 : 520;
      const halfHeight = rect ? rect.height / 2 : 360;

      let hoveredIndex = -1;
      if (mouse.inside) {
        let closestDist = Infinity;
        for (let i = 0; i < orbStates.length; i++) {
          const orb = orbStates[i];
          const dx = mouse.x - orb.x;
          const dy = mouse.y - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < HOVER_RADIUS && dist < closestDist) {
            closestDist = dist;
            hoveredIndex = i;
          }
        }
      }

      const lastHovered = lastHoveredRef.current;
      if (lastHovered.index !== -1 && hoveredIndex !== lastHovered.index) {
        if (lastHovered.releaseTime === 0) {
          lastHovered.releaseTime = now;
        }
      }

      if (hoveredIndex !== -1) {
        lastHovered.index = hoveredIndex;
        lastHovered.releaseTime = 0;
      }

      const recentlyReleasedIndex = (lastHovered.releaseTime > 0 &&
        now - lastHovered.releaseTime < RELEASE_DELAY_MS)
        ? lastHovered.index
        : -1;

      if (lastHovered.releaseTime > 0 && now - lastHovered.releaseTime >= RELEASE_DELAY_MS) {
        lastHovered.index = -1;
        lastHovered.releaseTime = 0;
      }

      for (let i = 0; i < orbStates.length; i++) {
        const orb = orbStates[i];
        const isHovered = i === hoveredIndex;
        const isRecentlyReleased = i === recentlyReleasedIndex;

        // When grabbing, don't freeze hovered orb - let it be thrown
        if (!mouse.grabbing && (isHovered || isRecentlyReleased)) {
          orb.vx *= 0.8;
          orb.vy *= 0.8;
          continue;
        }

        let fx = 0;
        let fy = 0;

        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (mouse.inside && dist > 1) {
          const jitter = 0.9 + noise(orb.x, orb.y, now * 0.001) * 0.2;
          
          // Use much stronger grab force when clicking
          const strength = mouse.grabbing ? GRAB_STRENGTH : ATTRACTION_STRENGTH;
          const force = strength * distSq * jitter;

          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }

        const t = now * orb.driftSpeed;
        const noiseX = noise(orb.x + 1000, orb.y, t + orb.driftPhase);
        const noiseY = noise(orb.x, orb.y + 1000, t + orb.driftPhase + 50);
        fx += noiseX * IDLE_DRIFT_STRENGTH;
        fy += noiseY * IDLE_DRIFT_STRENGTH;

        for (let j = 0; j < orbStates.length; j++) {
          if (i === j) continue;
          const other = orbStates[j];
          const rdx = orb.x - other.x;
          const rdy = orb.y - other.y;
          const rDistSq = rdx * rdx + rdy * rdy;
          const rDist = Math.sqrt(rDistSq);

          if (rDist < REPULSION_RADIUS && rDist > 1) {
            const overlap = REPULSION_RADIUS - rDist;
            const softness = overlap / REPULSION_RADIUS;
            const force = REPULSION_STRENGTH * softness * softness * 0.01;

            const tangentX = -rdy / rDist;
            const tangentY = rdx / rDist;
            const swirl = noise(orb.x + other.x, orb.y + other.y, now * 0.0005) * 0.3;

            fx += (rdx / rDist) * force + tangentX * force * swirl;
            fy += (rdy / rDist) * force + tangentY * force * swirl;
          }
        }

        const ax = fx / orb.mass;
        const ay = fy / orb.mass;

        // Use much less damping right after releasing grab to preserve momentum
        const currentDamping = isInPostGrabMomentum ? POST_GRAB_DAMPING : DAMPING;
        orb.vx = (orb.vx + ax) * currentDamping;
        orb.vy = (orb.vy + ay) * currentDamping;

        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed < MIN_VELOCITY_THRESHOLD && !isInPostGrabMomentum) {
          orb.vx *= 0.5;
          orb.vy *= 0.5;
        }

        // Allow higher velocity when grabbing or in post-grab momentum for throwing effect
        const maxVel = (mouse.grabbing || isInPostGrabMomentum) ? GRAB_MAX_VELOCITY : MAX_VELOCITY;
        if (speed > maxVel) {
          orb.vx = (orb.vx / speed) * maxVel;
          orb.vy = (orb.vy / speed) * maxVel;
        }

        orb.x += orb.vx;
        orb.y += orb.vy;

        const minX = -halfWidth + ORB_RADIUS;
        const maxX = halfWidth - ORB_RADIUS;
        const minY = -halfHeight + ORB_RADIUS;
        const maxY = halfHeight - ORB_RADIUS;

        if (orb.x < minX) {
          orb.x = minX;
          orb.vx *= -0.5;
        } else if (orb.x > maxX) {
          orb.x = maxX;
          orb.vx *= -0.5;
        }

        if (orb.y < minY) {
          orb.y = minY;
          orb.vy *= -0.5;
        } else if (orb.y > maxY) {
          orb.y = maxY;
          orb.vy *= -0.5;
        }
      }

      forceRender(n => n + 1);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, orbStates]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        if (cursorInside) setCursorInside(false);
        return;
      }
      if (!cursorInside) setCursorInside(true);
      setMousePos({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [cursorInside]);

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

  const borderOpacities = (() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { top: 0, bottom: 0 };
    const halfHeight = rect.height / 2;

    let minTop = Infinity;
    let minBottom = Infinity;

    for (const orb of orbStates) {
      const distTop = orb.y + halfHeight;
      const distBottom = halfHeight - orb.y;
      if (distTop >= 0 && distTop < minTop) minTop = distTop;
      if (distBottom >= 0 && distBottom < minBottom) minBottom = distBottom;
    }

    const cursorTop = mousePos.y + halfHeight;
    const cursorBottom = halfHeight - mousePos.y;
    if (cursorTop >= 0 && cursorTop < minTop) minTop = cursorTop;
    if (cursorBottom >= 0 && cursorBottom < minBottom) minBottom = cursorBottom;

    const MAX_DIST = 200;
    const topT = Math.max(0, Math.min(1, 1 - minTop / MAX_DIST));
    const bottomT = Math.max(0, Math.min(1, 1 - minBottom / MAX_DIST));

    return { top: topT * topT, bottom: bottomT * bottomT };
  })();

  const particleLayout = (() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 1200;
    const height = rect?.height ?? 700;
    const centerX = width / 2;
    const centerY = height / 2;

    return particleConfigRef.current.map((p, idx) => {
      const baseX = (p.uX - 0.5) * width;
      const baseY = (p.uY - 0.5) * height;
      const x = centerX + baseX + Math.sin(time * p.speed + idx) * p.ampX;
      const y = centerY + baseY + Math.cos(time * p.speed + idx) * p.ampY;
      return { x, y, size: p.size };
    });
  })();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen relative pointer-events-none py-24"
      style={{ overflow: 'hidden', isolation: 'isolate' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-violet-950/40 to-black/90 -z-10" />

      <div className="relative z-10 pb-12 px-6 md:px-12 pointer-events-auto">
        <div className="flex items-center gap-4 mb-8">
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
            EXPERIENCE & AWARDS
          </span>
        </div>

        <div className="pt-4 md:pl-[8vw]" style={{ paddingLeft: '6vw' }}>
          <h2
            className={`text-5xl md:text-7xl lg:text-8xl font-light text-white transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MY{' '}
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              JOURNEY
            </span>
          </h2>

          <p
            className={`text-white/50 text-lg mt-6 max-w-2xl transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Orbs are magnetically attracted to your cursor. Click to explore details.
          </p>
        </div>
      </div>

      <div className="relative z-10 pointer-events-auto">
        <div
          ref={containerRef}
          className={`relative w-full h-[720px] pointer-events-auto ${isGrabbing ? 'cursor-grabbing' : 'cursor-default'}`}
          onMouseDown={(e) => {
            if (e.button === 0) {
              setIsGrabbing(true);
            }
          }}
          onMouseUp={() => setIsGrabbing(false)}
          onMouseLeave={() => setIsGrabbing(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/80 to-transparent"
              style={{ opacity: borderOpacities.top }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/80 to-transparent"
              style={{ opacity: borderOpacities.bottom }}
            />

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {(() => {
                const lines: Array<{
                  x1: number;
                  y1: number;
                  x2: number;
                  y2: number;
                  opacity: number;
                }> = [];

                for (let i = 0; i < particleLayout.length; i++) {
                  for (let j = i + 1; j < particleLayout.length; j++) {
                    const a = particleLayout[i];
                    const b = particleLayout[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > PARTICLE_LINK_DISTANCE) continue;
                    const t = 1 - dist / PARTICLE_LINK_DISTANCE;
                    lines.push({
                      x1: a.x,
                      y1: a.y,
                      x2: b.x,
                      y2: b.y,
                      opacity: Math.pow(t, 1.5) * 0.35,
                    });
                  }
                }

                return (
                  <>
                    {lines.map((line, idx) => (
                      <line
                        key={`line-${idx}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#particle-line)"
                        strokeWidth={1}
                        opacity={line.opacity}
                      />
                    ))}
                    <defs>
                      <linearGradient id="particle-line" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    {particleLayout.map((p, idx) => (
                      <circle
                        key={`particle-${idx}`}
                        cx={p.x}
                        cy={p.y}
                        r={p.size}
                        fill="#a855f7"
                        fillOpacity={0.4}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {isVisible &&
                cursorInside &&
                containerRef.current &&
                filteredItems.map((item) => {
                  const actualIndex = allItems.findIndex(i => i.id === item.id);
                  const orb = orbStates[actualIndex];
                  const isExperience = item.type === 'experience';
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return null;
                  const svgCenterX = rect.width / 2;
                  const svgCenterY = rect.height / 2;

                  return (
                    <line
                      key={`line-${item.id}`}
                      x1={svgCenterX + mousePos.x}
                      y1={svgCenterY + mousePos.y}
                      x2={svgCenterX + orb.x}
                      y2={svgCenterY + orb.y}
                      stroke={isExperience ? '#a855f7' : '#ec4899'}
                      strokeWidth={isGrabbing ? 4 : 2}
                      strokeDasharray={isGrabbing ? "8,4" : "5,5"}
                      opacity={isGrabbing ? 0.9 : 0.6}
                      style={{
                        filter: isGrabbing ? 'drop-shadow(0 0 6px currentColor)' : 'none',
                        transition: 'stroke-width 0.15s, opacity 0.15s',
                      }}
                    />
                  );
                })}
            </svg>

            {filteredItems.map((item) => {
              const isExperience = item.type === 'experience';
              const actualIndex = allItems.findIndex(i => i.id === item.id);
              const orb = orbStates[actualIndex];
              const tiltOffset = Math.sin(time + actualIndex * 1.15) * 14;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={
                    isVisible
                      ? {
                          opacity: 1,
                          scale: 1,
                          x: orb.x,
                          y: orb.y,
                          rotate: tiltOffset,
                        }
                      : { opacity: 0, scale: 0.35 }
                  }
                  transition={{
                    opacity: { duration: 0.6, delay: actualIndex * 0.08 },
                    scale: { duration: 0.6, delay: actualIndex * 0.08, ease: 'easeOut' },
                    x: { type: 'tween', ease: 'linear', duration: 0 },
                    y: { type: 'tween', ease: 'linear', duration: 0 },
                    rotate: { type: 'tween', ease: 'linear', duration: 0 },
                  }}
                  className="absolute left-1/2 top-1/2 cursor-pointer group pointer-events-auto"
                  onClick={() => setSelectedItem(item)}
                  style={{
                    willChange: 'transform',
                    zIndex: 2,
                    marginLeft: '-80px',
                    marginTop: '-80px',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                    style={{
                      width: '220px',
                      height: '220px',
                      margin: '-30px',
                      background: isExperience
                        ? 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)',
                    }}
                  />

                  <div
                    className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 backdrop-blur-sm shadow-2xl overflow-hidden ${
                      isExperience
                        ? 'bg-gradient-to-br from-violet-500/80 via-purple-600/80 to-purple-700/80'
                        : 'bg-gradient-to-br from-fuchsia-500/80 via-pink-600/80 to-pink-700/80'
                    }`}
                    style={{
                      boxShadow: isExperience
                        ? '0 0 40px rgba(168,85,247,0.6), inset 0 0 20px rgba(255,255,255,0.1)'
                        : '0 0 40px rgba(236,72,153,0.6), inset 0 0 20px rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="absolute top-2 left-2 w-10 h-10 rounded-full bg-white/20 blur-md"
                      style={{ transform: 'translate(10px, -5px)' }}
                    />

                    <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center select-none">
                      <p className="text-white text-sm font-semibold leading-tight mb-2 line-clamp-2">
                        {isExperience
                          ? (item as Experience).company
                          : (item as Award).title}
                      </p>
                      <p className="text-white/70 text-xs leading-tight">
                        {isExperience
                          ? (item as Experience).period
                          : (item as Award).date}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 select-none">
                    <div className="bg-black/95 px-5 py-3 rounded-xl border border-violet-500/40 backdrop-blur-md shadow-xl">
                      <p className="text-white text-sm font-medium">
                        {isExperience
                          ? (item as Experience).company
                          : (item as Award).title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              key="detail-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-40 overflow-y-auto pointer-events-auto"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="absolute inset-0 bg-black/90 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <div className="relative min-h-full flex items-center justify-center px-10 md:px-20 lg:px-28 py-20 md:py-24 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative z-10 w-[90%] md:w-[70%] lg:w-[60%] max-w-3xl rounded-3xl border border-violet-500/40 bg-gradient-to-b from-violet-900/40 via-black/80 to-black/95 shadow-[0_0_90px_rgba(124,58,237,0.7)] overflow-hidden p-12 md:p-16 lg:p-18 box-border pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full flex justify-center" style={{ marginBottom: '12px' }}>
                    <div className="w-full max-w-2xl flex flex-col gap-8 md:gap-10 pb-12 md:pb-14 lg:pb-16">
                      <div className="inline-flex">
                        <div className="px-[5.5rem] md:px-[6rem] py-3 rounded-full bg-gradient-to-r from-violet-500/30 to-purple-500/30 min-w-[230px] flex items-center justify-center">
                          <span className="text-violet-100 text-[11px] font-medium uppercase tracking-[0.25em] whitespace-nowrap text-center">
                            {selectedItem.type === 'experience'
                              ? 'EXPERIENCE'
                              : 'AWARD'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 md:gap-5">
                        <h2
                          className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {selectedItem.type === 'experience'
                            ? (selectedItem as Experience).title
                            : (selectedItem as Award).title}
                        </h2>
                        <h3 className="text-lg md:text-xl text-violet-200">
                          {selectedItem.type === 'experience'
                            ? (selectedItem as Experience).company
                            : (selectedItem as Award).issuer}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {selectedItem.type === 'experience'
                              ? (selectedItem as Experience).period
                              : (selectedItem as Award).date}
                          </span>
                        </div>

                        {selectedItem.type === 'experience' && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{(selectedItem as Experience).location}</span>
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                      <p className="text-white/80 leading-relaxed text-base md:text-lg">
                        {selectedItem.description}
                      </p>

                      <div className="flex justify-center pt-8">
                        <motion.button
                          onClick={() => setSelectedItem(null)}
                          whileHover={{ scale: 1.06, y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center justify-center gap-2 text-lg md:text-xl text-white font-semibold tracking-wide px-6 py-3"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          <span>Back to journey</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}