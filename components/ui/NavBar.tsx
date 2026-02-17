'use client';

import { useState, useEffect, useRef } from 'react';

const navItems = [
  {
    label: 'ABOUT ME',
    href: '#about',
    description: 'Who I am, what I enjoy and what I work on.',
    id: 'about',
  },
  {
    label: 'EXPERIENCE',
    href: '#experience',
    description: 'Professional journey and achievements.',
    id: 'experience',
  },
  {
    label: 'WORK',
    href: '#work',
    description: 'Projects, experiments and things I\'ve built.',
    id: 'work',
  },
  {
    label: 'CONTACT',
    href: '#contact',
    description: 'Reach out, collaborate or just say hi.',
    id: 'contact',
  },
];

type ContextualOption = {
  label: string;
  action: () => void;
  isActive: boolean;
};

// Contextual options for About section - dispatches events to AboutSection
const getAboutContextualOptions = (activeView: string, setActiveView: (view: string) => void) => [
  {
    label: 'Background',
    action: () => {
      window.dispatchEvent(new CustomEvent('aboutAction', { detail: 'background' }));
      setActiveView('background');
    },
    isActive: activeView === 'background',
  },
  {
    label: 'Skills',
    action: () => {
      window.dispatchEvent(new CustomEvent('aboutAction', { detail: 'skills' }));
      setActiveView('skills');
    },
    isActive: activeView === 'skills',
  },
  {
    label: 'Interests',
    action: () => {
      window.dispatchEvent(new CustomEvent('aboutAction', { detail: 'interests' }));
      setActiveView('interests');
    },
    isActive: activeView === 'interests',
  },
];

// Contextual options for Experience section - now receives activeFilter
const getExperienceContextualOptions = (activeFilter: string, setActiveFilter: (filter: string) => void) => [
  {
    label: 'Experience',
    action: () => {
      window.dispatchEvent(new CustomEvent('filterExperience', { detail: 'experience' }));
      setActiveFilter('experience');
    },
    isActive: activeFilter === 'experience',
  },
  {
    label: 'Awards',
    action: () => {
      window.dispatchEvent(new CustomEvent('filterExperience', { detail: 'awards' }));
      setActiveFilter('awards');
    },
    isActive: activeFilter === 'awards',
  },
  {
    label: 'Reset Orbs',
    action: () => {
      window.dispatchEvent(new CustomEvent('resetOrbs'));
      window.dispatchEvent(new CustomEvent('filterExperience', { detail: 'all' }));
      setActiveFilter('all');
    },
    isActive: false,
  },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeAboutView, setActiveAboutView] = useState<string>('background');
  const [previousSection, setPreviousSection] = useState('home');
  const [isExiting, setIsExiting] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeSectionRef = useRef('home');
  const exitTimeoutRef = useRef<number | null>(null);
  const pendingSectionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!topBarRef.current) return;

    const rafId = window.requestAnimationFrame(() => {
      if (!topBarRef.current) return;
      topBarRef.current.classList.remove('opacity-0', '-translate-y-4');
      topBarRef.current.classList.add('opacity-100', 'translate-y-0');
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // RAF-throttled magnetic transform updates with cached rects
  useEffect(() => {
    let rafId: number | null = null;
    const maxDistance = 120;
    const maxOffset = 8;

    // Cache link positions — refresh on resize only, not every frame
    type LinkCache = { el: HTMLElement; cx: number; cy: number };
    let cachedLinks: LinkCache[] = [];

    const refreshLinkCache = () => {
      const links: LinkCache[] = [];
      for (const el of navLinksRef.current) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        links.push({ el, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 });
      }
      cachedLinks = links;
    };

    refreshLinkCache();

    const updateNavLinkTransforms = () => {
      rafId = null;
      const { x: mouseX, y: mouseY } = mousePosRef.current;

      for (let i = 0; i < cachedLinks.length; i++) {
        const { el, cx, cy } = cachedLinks[i];
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let xOffset = 0;
        let yOffset = 0;

        if (distance < maxDistance) {
          const factor = 1 - (distance / maxDistance);
          const strength = factor * factor;
          const angle = Math.atan2(dy, dx);
          xOffset = Math.cos(angle) * maxOffset * strength;
          yOffset = Math.sin(angle) * maxOffset * strength;
        }

        el.style.transform = `translate(${xOffset}px, ${yOffset - 2}px)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateNavLinkTransforms);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', refreshLinkCache);
    updateNavLinkTransforms();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', refreshLinkCache);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Consolidated scroll handling for progress ring + active section detection
  useEffect(() => {
    const ringCircumference = 2 * Math.PI * 29;
    let rafId: number | null = null;

    const processScroll = () => {
      rafId = null;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      const clampedProgress = Math.min(100, Math.max(0, progress));
      scrollProgressRef.current = clampedProgress;

      if (progressCircleRef.current) {
        progressCircleRef.current.setAttribute(
          'stroke-dashoffset',
          `${ringCircumference * (1 - (clampedProgress / 100))}`
        );
      }

      const sections = ['home', 'about', 'experience', 'work', 'contact'];
      let current = 'home';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Consider a section active if its top is in the upper half of viewport
          if (rect.top <= window.innerHeight / 3 && rect.bottom > window.innerHeight / 3) {
            current = sectionId;
          }
        }
      }

      const previous = activeSectionRef.current;
      if (current !== previous) {
        // Check if we're leaving a section with contextual options
        const wasInContextualSection = previous === 'about' || previous === 'experience';

        if (wasInContextualSection) {
          if (exitTimeoutRef.current !== null) {
            pendingSectionRef.current = current;
            return;
          }

          // Trigger exit animation when leaving any contextual section
          setIsExiting(true);
          pendingSectionRef.current = current;
          // Wait for animation to complete before updating section
          exitTimeoutRef.current = window.setTimeout(() => {
            const nextSection = pendingSectionRef.current ?? current;
            setPreviousSection(previous);
            setActiveSection(nextSection);
            activeSectionRef.current = nextSection;
            setIsExiting(false);
            exitTimeoutRef.current = null;
            pendingSectionRef.current = null;
          }, 300); // Match animation duration
        } else {
          setPreviousSection(previous);
          setActiveSection(current);
          activeSectionRef.current = current;
        }
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(processScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    processScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      pendingSectionRef.current = null;
    };
  }, []);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    navLinksRef.current.forEach((element) => {
      if (!element) return;
      if (!element.style.transform) {
        element.style.transform = 'translate(0px, -2px)';
      }
    });
  }, [activeSection, isExiting]);

  useEffect(() => {
    const updateActiveIndicator = () => {
      if (!activeIndicatorRef.current) return;

      const index = navItems.findIndex(item => item.id === activeSection);
      if (index === -1) {
        activeIndicatorRef.current.style.left = '0px';
        activeIndicatorRef.current.style.width = '0px';
        return;
      }

      const element = navLinksRef.current[index];
      if (!element) {
        activeIndicatorRef.current.style.left = '0px';
        activeIndicatorRef.current.style.width = '0px';
        return;
      }

      // Use offsetLeft which is relative to parent and unaffected by transforms
      activeIndicatorRef.current.style.left = `${element.offsetLeft}px`;
      activeIndicatorRef.current.style.width = `${element.offsetWidth}px`;
    };

    updateActiveIndicator();
    window.addEventListener('resize', updateActiveIndicator);

    return () => {
      window.removeEventListener('resize', updateActiveIndicator);
    };
  }, [activeSection, isExiting]);

  // Get contextual options based on active section
  const getContextualOptions = () => {
    if (activeSection === 'about') return getAboutContextualOptions(activeAboutView, setActiveAboutView);
    if (activeSection === 'experience') return getExperienceContextualOptions(activeFilter, setActiveFilter);
    return null;
  };

  const contextualOptions = getContextualOptions();

  // Determine if we had contextual options in previous section
  const previousHadOptions = previousSection === 'about' || previousSection === 'experience';
  const currentHasOptions = activeSection === 'about' || activeSection === 'experience';

  // Show contextual options if: currently in a contextual section OR exiting from one
  const shouldShowContextualOptions = currentHasOptions || isExiting;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{
        padding: 'clamp(24px, 3vh, 32px) clamp(32px, 8vw, 120px)',
      }}
    >
      {/* Backdrop blur bar - tapers at bottom */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none backdrop-blur-md"
        style={{
          height: '120px',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Top bar */}
      <div
        ref={topBarRef}
        className="flex justify-between items-center w-full pointer-events-auto transition-all duration-700 relative z-10 opacity-0 -translate-y-4"
      >
        {/* Swofty logo - click to scroll to top */}
        <a
          href="#home"
          className="relative group text-white focus:outline-none"
          aria-label="Scroll to top"
        >
          <span className="sr-only">Scroll to top</span>

          {/* Progress ring around logo */}
          <svg
            className="absolute pointer-events-none"
            style={{
              width: '62px',
              height: '62px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <circle
              cx="31"
              cy="31"
              r="29"
              fill="none"
              stroke="rgba(167, 139, 250, 0.15)"
              strokeWidth="2"
            />
            <circle
              ref={progressCircleRef}
              cx="31"
              cy="31"
              r="29"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 29}`}
              strokeDashoffset={`${2 * Math.PI * 29}`}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '31px 31px',
                transition: 'stroke-dashoffset 0.1s ease-out',
              }}
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glow behind logo on hover */}
          <div
            className="absolute -inset-3 rounded-full blur-xl transition-opacity duration-500 group-hover:opacity-70 opacity-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.9) 0%, transparent 55%)',
            }}
          />

          {/* Actual logo */}
          <div
            className="relative transition-all duration-500 will-change-transform text-white group-hover:text-violet-300 group-hover:scale-105"
          >
            <svg
              width="23"
              height="27"
              viewBox="0 0 30 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-500"
            >
              <path
                d="M11.5745 0H0.519359C0.259679 0 0.051468 0.206917 0.051468 0.519045L0 35.481C0 35.7919 0.207042 36 0.519359 36H11.5745C22.6822 36 30 29.1004 30 18.0006C30 6.90073 22.6822 0 11.5745 0ZM13.432 26.7308C10.1158 26.7051 7.46754 25.1117 6.90139 24.5728C6.79846 24.4957 6.74699 24.3928 6.84992 24.2385L8.5472 21.206C8.59867 21.1289 8.67587 21.0774 8.75307 21.0774C8.83027 21.0774 8.88174 21.1032 8.95894 21.1546C9.60229 21.6947 11.6587 22.7994 13.7665 22.7994C15.0778 22.7994 16.3633 22.3365 16.3633 21.3861C16.3633 20.7431 15.9516 19.947 13.2518 19.5098C9.08644 18.8166 6.95286 17.3261 6.84992 14.1136C6.74699 10.7994 9.36952 8.38305 13.6121 8.40877C16.6207 8.43449 18.8314 9.6678 19.3204 10.1307C19.4233 10.2079 19.4491 10.3622 19.3976 10.4908L18.0349 13.6004C17.9834 13.7033 17.9319 13.7547 17.8805 13.7547C17.8033 13.7547 17.7518 13.729 17.6746 13.6775C17.0067 13.2403 15.5667 12.3414 13.4577 12.3414C11.8634 12.3414 10.8095 13.0346 10.8095 13.8061C10.8095 14.7308 11.7347 15.0395 13.9467 15.5281C18.0091 16.4014 20.1942 17.8404 20.2971 21.2329C20.4 24.394 17.6488 26.7577 13.432 26.732V26.7308Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </a>

        {/* Desktop links on the right with magnetic effect */}
        <div
          className="hidden md:flex items-center gap-8 relative"
          style={{
            transform: shouldShowContextualOptions ? 'translateX(-260px)' : 'translateX(0)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Active section indicator */}
          <div
            ref={activeIndicatorRef}
            className="absolute bottom-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out pointer-events-none"
            style={{
              left: '0px',
              width: '0px',
              opacity: activeSection === 'home' ? 0 : 1,
            }}
          />

          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isContactButton = index === navItems.length - 1;

            return (
              <a
                key={item.href}
                ref={(el) => { navLinksRef.current[index] = el; }}
                href={item.href}
                className={`text-xs tracking-[0.2em] transition-all duration-300 relative focus:outline-none ${
                  isContactButton
                    ? `px-6 py-3 ${
                        isActive
                          ? 'text-white'
                          : 'text-white/90 hover:text-white'
                      }`
                    : isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                }`}
                style={{
                  willChange: 'transform',
                }}
              >
                {item.label}
              </a>
            );
          })}

          {/* Contextual options container wrapper */}
          <div
            className="absolute left-full flex items-center gap-3 pointer-events-none"
            style={{
              marginLeft: '24px',
              opacity: shouldShowContextualOptions ? 1 : 0,
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Divider */}
            <div className="w-px h-6 bg-violet-500/30" />

            {/* Contextual options */}
            <div
              className="flex items-center pointer-events-auto"
              style={{
                opacity: !isExiting ? 1 : 0,
                transform: !isExiting ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: !isExiting ? 'auto' : 'none',
              }}
            >
              {contextualOptions && (
                <div className="flex items-center gap-3">
                  {contextualOptions.map((option: ContextualOption, idx: number) => {
                    const isActive = option.isActive || false;
                    return (
                      <button
                        key={option.label}
                        onClick={option.action}
                        className={`text-[10px] tracking-[0.2em] transition-all duration-300 uppercase relative px-4 py-2 ${
                          isActive
                            ? 'text-white bg-violet-500/20 border border-violet-400/40 backdrop-blur-sm'
                            : 'text-violet-400/70 hover:text-violet-300 hover:bg-violet-500/10 border border-transparent'
                        }`}
                        style={{
                          animationDelay: !previousHadOptions && !isExiting ? `${(idx + 1) * 100}ms` : '0ms',
                          borderRadius: '4px',
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minimal mobile right side (kept clean) */}
        <div className="md:hidden" />
      </div>
    </nav>
  );
}
