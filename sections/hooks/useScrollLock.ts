import { useEffect, useRef, useCallback } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface UseScrollLockOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  swiperRef: React.RefObject<SwiperType | null>;
  totalSlides: number;
}

export function useScrollLock({
  sectionRef,
  swiperRef,
  totalSlides,
}: UseScrollLockOptions) {
  const isLockedRef = useRef(false);
  const edgeScrollCountRef = useRef(0);
  const lastDirectionRef = useRef<'up' | 'down' | null>(null);
  const isAnimatingRef = useRef(false);
  const lockTimestampRef = useRef(0);
  const unlockTimestampRef = useRef(0);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const entryDirectionRef = useRef<'up' | 'down'>('down');

  const SCROLL_THRESHOLD = 50;
  const EDGE_SCROLLS_TO_EXIT = 2;
  const ENTRY_COOLDOWN_MS = 800;
  const EXIT_COOLDOWN_MS = 1000;

  const scrollToSection = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth' });
  }, [sectionRef]);

  // Track scroll position continuously for direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY !== lastScrollYRef.current) {
        entryDirectionRef.current = currentY > lastScrollYRef.current ? 'down' : 'up';
        lastScrollYRef.current = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scrollbar/slow scroll detection
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const swiper = swiperRef.current;

        if (!entry.isIntersecting) {
          // Left viewport - unlock
          if (isLockedRef.current) {
            isLockedRef.current = false;
            edgeScrollCountRef.current = 0;
          }
          return;
        }

        // Already locked, ignore
        if (isLockedRef.current || !swiper) return;

        // Don't re-lock if we just exited
        const timeSinceUnlock = Date.now() - unlockTimestampRef.current;
        if (timeSinceUnlock < EXIT_COOLDOWN_MS) return;

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if section is mostly in view
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = visibleBottom - visibleTop;
        const visibleRatio = visibleHeight / viewportHeight;

        if (visibleRatio > 0.7) {
          isLockedRef.current = true;
          lockTimestampRef.current = Date.now();
          edgeScrollCountRef.current = 0;

          // Use tracked direction to determine start slide
          if (entryDirectionRef.current === 'up') {
            swiper.slideTo(totalSlides - 1, 0);
          } else {
            swiper.slideTo(0, 0);
          }

          scrollToSection();
        }
      },
      {
        threshold: [0.5, 0.7, 0.9],
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [sectionRef, swiperRef, totalSlides, scrollToSection]);

  // Wheel event handler for slide navigation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      const direction: 'up' | 'down' = e.deltaY > 0 ? 'down' : 'up';
      const currentIndex = swiper.activeIndex;
      const isAtFirstSlide = currentIndex === 0;
      const isAtLastSlide = currentIndex === totalSlides - 1;

      // ENTRY LOGIC via wheel
      if (!isLockedRef.current) {
        // Don't re-lock if we just exited
        const timeSinceUnlock = Date.now() - unlockTimestampRef.current;
        if (timeSinceUnlock < EXIT_COOLDOWN_MS) return;

        // Check if section is taking up most of the viewport (we should lock)
        const visibleTop = Math.max(0, sectionTop);
        const visibleBottom = Math.min(viewportHeight, sectionBottom);
        const visibleHeight = visibleBottom - visibleTop;
        const visibleRatio = visibleHeight / viewportHeight;

        // Lock if section is more than 60% visible
        if (visibleRatio > 0.6) {
          e.preventDefault();
          isLockedRef.current = true;
          lockTimestampRef.current = Date.now();
          edgeScrollCountRef.current = 0;
          
          // Determine start slide based on scroll direction
          if (direction === 'down') {
            swiper.slideTo(0, 0);
          } else {
            swiper.slideTo(totalSlides - 1, 0);
          }
          
          scrollToSection();
          return;
        }

        // Not visible enough, let scroll continue
        return;
      }

      // LOCKED: We own the scroll now
      e.preventDefault();

      if (isAnimatingRef.current) return;

      const timeSinceLock = Date.now() - lockTimestampRef.current;
      if (timeSinceLock < ENTRY_COOLDOWN_MS) return;

      if (lastDirectionRef.current !== direction) {
        edgeScrollCountRef.current = 0;
        lastDirectionRef.current = direction;
      }

      const tryingToExitTop = isAtFirstSlide && direction === 'up';
      const tryingToExitBottom = isAtLastSlide && direction === 'down';

      if (tryingToExitTop || tryingToExitBottom) {
        edgeScrollCountRef.current++;

        if (edgeScrollCountRef.current >= EDGE_SCROLLS_TO_EXIT) {
          isLockedRef.current = false;
          unlockTimestampRef.current = Date.now();
          edgeScrollCountRef.current = 0;
          lastDirectionRef.current = null;

          window.scrollBy({
            top: direction === 'down' ? viewportHeight : -viewportHeight,
            behavior: 'smooth',
          });
          return;
        }
        return;
      }

      edgeScrollCountRef.current = 0;

      if (Math.abs(e.deltaY) > SCROLL_THRESHOLD) {
        isAnimatingRef.current = true;

        if (direction === 'down') {
          swiper.slideNext();
        } else {
          swiper.slidePrev();
        }

        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 600);
      }
    };

    const swiper = swiperRef.current;
    if (swiper) {
      swiper.on('transitionEnd', () => {
        isAnimatingRef.current = false;
      });
    }

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [sectionRef, swiperRef, totalSlides, scrollToSection]);
}