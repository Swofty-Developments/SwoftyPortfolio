'use client';

import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<NodeListOf<Element> | null>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    charsRef.current = container.querySelectorAll('[data-magnetic-char]');

    const observer = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    let rafId = 0;
    let pendingEvent: MouseEvent | null = null;

    const processMouseMove = () => {
      rafId = 0;
      if (!isInViewRef.current || !pendingEvent) {
        return;
      }

      const chars = charsRef.current;
      if (!chars) {
        return;
      }

      const e = pendingEvent;
      pendingEvent = null;

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(e.clientX - charCenterX, 2) +
          Math.pow(e.clientY - charCenterY, 2)
        );

        const isName = char.getAttribute('data-is-name') === 'true';
        const maxDistance = isName ? 200 : 150;
        const maxLift = isName ? 30 : 15;

        if (distance < maxDistance) {
          const factor = 1 - (distance / maxDistance);
          const easedFactor = factor * factor;
          const y = -maxLift * easedFactor;
          const scale = 1 + (0.15 * easedFactor);

          (char as HTMLElement).style.transform = `translateY(${y}px) scale(${scale})`;
        } else {
          (char as HTMLElement).style.transform = 'translateY(0px) scale(1)';
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(processMouseMove);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      charsRef.current = null;
    };
  }, []);
  
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center pointer-events-none"
    >
      {/* Content wrapper with guaranteed padding */}
      <div
        ref={containerRef}
        className="w-full"
        style={{
          paddingLeft: 'clamp(32px, 8vw, 120px)',
          paddingRight: 'clamp(32px, 8vw, 120px)',
        }}
      >
        <div className="max-w-5xl" style={{ position: 'relative', zIndex: 20 }}>
          {/* Subtitle */}
          <p
            className={`text-lg tracking-wide mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              color: 'rgba(196, 181, 253, 0.7)',
            }}
          >
            Hi, my name is
          </p>

          {/* Main name - SWOFTY */}
          <h1
            className="font-light leading-none tracking-tight mb-6"
            style={{
              fontSize: 'clamp(4rem, 15vw, 12rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            <span className="inline-flex">
              {'SWOFTY.'.split('').map((char, i) => (
                <span
                  key={i}
                  data-magnetic-char
                  data-is-name="true"
                  className={`inline-block select-none ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(180deg, #c4b5fd 0%, #a855f7 50%, #d946ef 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.6s ease ${i * 50}ms`,
                    willChange: 'transform',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Role description */}
          <p
            className={`font-light transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '400ms',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>I'm a </span>
            <span className="inline-flex" style={{ color: '#a78bfa' }}>
              {'DevOps'.split('').map((char, i) => (
                <span
                  key={i}
                  data-magnetic-char
                  data-is-name="false"
                  className={`inline-block select-none ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.6s ease ${450 + i * 30}ms`,
                    willChange: 'transform',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}> </span>
            <span className="inline-flex" style={{ color: '#a78bfa' }}>
              {'Engineer'.split('').map((char, i) => (
                <span
                  key={i}
                  data-magnetic-char
                  data-is-name="false"
                  className={`inline-block select-none ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.6s ease ${550 + i * 30}ms`,
                    willChange: 'transform',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
