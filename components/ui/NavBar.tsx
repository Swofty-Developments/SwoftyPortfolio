'use client';

import { useEffect, useRef, useState } from 'react';
import Wordmark from './Wordmark';

const navItems = [
  { label: 'Open Source', href: '#open-source' },
  { label: 'About', href: '#about' },
  { label: 'Awards', href: '#experience' },
];

export default function NavBar() {
  const headerRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let raf = 0;

    /**
     * Modeled after superhuman.com:
     *   Phase 1 — over hero: bg alpha 0 → ~0.9 via pow(p, 5),
     *             backdrop-blur stays at 0 until p ≥ 0.15 then ramps to 12px
     *   Phase 2 — past hero: solid white, ink text, no blur
     *
     * Sampled SH values for reference: y=400 → 0.0097, y=600 → 0.063,
     * y=800 → 0.32. p^5 fits these almost perfectly.
     */
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const heroEnd = Math.max(vh, 540);
      const scrollY = window.scrollY;
      const p = Math.min(1, Math.max(0, scrollY / heroEnd));
      const past = scrollY > heroEnd;

      if (past) {
        header.style.setProperty('--nav-bg', '#ffffff');
        header.style.setProperty('--nav-blur', '0px');
        header.style.setProperty('--nav-border', 'rgba(115, 113, 109, 0.2)');
      } else {
        const alpha = Math.pow(p, 5) * 0.9;
        // Don't engage backdrop-blur until we've actually committed to a
        // surface — otherwise it just makes the hero video look smeary.
        const blurOn = p > 0.18;
        const blurStrength = blurOn ? Math.min(12, (p - 0.18) * 24) : 0;
        header.style.setProperty('--nav-bg', `rgba(255, 255, 255, ${alpha.toFixed(4)})`);
        header.style.setProperty('--nav-blur', `${blurStrength.toFixed(2)}px`);
        header.style.setProperty(
          '--nav-border',
          `rgba(252, 250, 247, ${(alpha * 0.22).toFixed(4)})`
        );
      }

      setPastHero((prev) => (prev !== past ? past : prev));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      data-global-header
      data-past-hero={pastHero}
      className="sh-header sticky top-0 z-[201] w-full"
      style={{
        background: 'var(--nav-bg, rgba(255,255,255,0))',
        backdropFilter: 'blur(var(--nav-blur, 0px))',
        WebkitBackdropFilter: 'blur(var(--nav-blur, 0px))',
        borderBottom: '1px solid var(--nav-border, transparent)',
        transition: 'border-color 0.2s ease, color 0.2s ease',
        color: pastHero ? 'var(--color-ink)' : 'rgba(255,255,255,0.95)',
      }}
    >
      <div className="relative mx-auto flex h-[67px] w-full max-w-[1440px] items-center justify-between px-8">
        <a
          href="#home"
          aria-label="Swofty home"
          className="inline-flex items-center text-[currentColor]"
        >
          <Wordmark size={20} color="currentColor" />
        </a>

        {/* Absolutely-centered nav so its position doesn't depend on the
            widths of the logo / CTAs on either side. */}
        <nav
          aria-label="Primary"
          className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Swofty-Developments"
            target="_blank"
            rel="noreferrer"
            className="nav-link hidden sm:inline-flex"
          >
            GitHub
          </a>
          <a
            href="#contact"
            className={`nav-cta ${pastHero ? 'nav-cta--ink' : 'nav-cta--chip'}`}
          >
            <span>Get in touch</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
