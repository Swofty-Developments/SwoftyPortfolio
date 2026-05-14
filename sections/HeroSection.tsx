'use client';

import { useEffect, useRef, useState } from 'react';
import CursorDots from '@/components/ui/CursorDots';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden text-bone min-h-[520px] md:min-h-screen"
      style={{
        // Pull hero up so the banner + nav float OVER it — the video then
        // occupies the entire first viewport, not the part below the chrome.
        marginTop: '-139px',
      }}
    >
      {/* Real video background — the cinematic dusk pan */}
      <HeroVideo />

      {/* Soft tint baked over the video to pull it toward the iris/lavender palette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to left bottom, rgba(168, 164, 216, 0.18), rgba(107, 165, 232, 0.14), rgba(176, 112, 192, 0.22), rgba(144, 136, 208, 0.16))',
          mixBlendMode: 'screen',
        }}
      />

      {/* Jacob portrait — anchored to bottom-center on md+ (large enough
          viewport to absorb the negative margin). On mobile it gets pulled
          into the content flow below the CTAs instead. */}
      <JacobPortrait variant="anchored" />

      {/* Cursor dot trail — desktop only, no cursor on touch devices */}
      <CursorDots className="hidden md:block absolute inset-0 pointer-events-none z-[4]" />

      {/* Floating glassmorphic panels with magnetic pull */}
      <FloatingPanels />

      {/* Hero content — concise, sits in the upper third so it doesn't
          overlap the portrait silhouette below */}
      <div
        className="relative z-10 container-page flex flex-col items-center text-center min-h-[520px] md:min-h-screen pt-[190px] md:pt-[200px] pb-0 md:pb-[60px]"
      >
        <h1
          className="anim-fade-down text-white text-display-fluid max-w-[20ch]"
          style={{ animationDelay: '0.05s' }}
        >
          Software, shipped where it lives.
        </h1>

        <div
          className="anim-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '0.25s' }}
        >
          <a href="#work" className="btn-primary">
            See my work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#714cb6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-[8px] border border-white/40 px-3 py-[9px] text-[14px] font-[540] text-white hover:bg-white/10 transition"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile-only inline portrait — sits right below the CTAs so the
            face is anchored to the bottom of the visible hero without
            stretching the section to a full viewport. */}
        <JacobPortrait variant="inline" />
      </div>
    </section>
  );
}

/**
 * Force-muted autoplay <video> plus a painted loading approximation.
 *
 * Before the video has any decoded frames, we show a CSS gradient that
 * approximates the colour stops of the dusk scene (violet sky → magenta
 * horizon → near-black tree silhouettes at the bottom). Once the first
 * frame is decoded (`canplay` event), the video fades in over 700ms.
 *
 * Also re-mutes + .play() on every relevant event because the VolumeControl
 * browser extension sometimes un-mutes the element after render, blocking
 * autoplay.
 */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const force = () => {
      try {
        v.muted = true;
        v.defaultMuted = true;
        v.playbackRate = 1.0;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {
        /* ignore */
      }
    };
    const onCanPlay = () => {
      setReady(true);
      force();
    };
    force();
    // If the video element already has decoded data (cached from a hot
    // reload), the canplay event may have already fired — check readyState.
    if (v.readyState >= 2) setReady(true);

    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('loadeddata', onCanPlay);

    const events: (keyof HTMLMediaElementEventMap)[] = [
      'pause',
      'volumechange',
      'stalled',
      'suspend',
    ];
    events.forEach((e) => v.addEventListener(e, force));
    const visIO = () => {
      if (!document.hidden) force();
    };
    document.addEventListener('visibilitychange', visIO);
    return () => {
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('loadeddata', onCanPlay);
      events.forEach((e) => v.removeEventListener(e, force));
      document.removeEventListener('visibilitychange', visIO);
    };
  }, []);

  return (
    <>
      {/* Painted loading state — a layered approximation of the dusk video.
          Sits behind the <video> at the same inset, so the fade-in feels
          like the scene is "developing" rather than swapping in. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            // Tree silhouette band at the bottom
            'linear-gradient(to top, rgba(18, 10, 26, 0.92) 0%, rgba(18, 10, 26, 0.55) 14%, rgba(18, 10, 26, 0) 28%)',
            // Hot pink magenta near the horizon
            'radial-gradient(140% 60% at 70% 70%, rgba(214, 130, 178, 0.55) 0%, rgba(214, 130, 178, 0) 60%)',
            // Cooler violet at top-left
            'radial-gradient(120% 90% at 18% 12%, rgba(120, 96, 180, 0.65) 0%, rgba(120, 96, 180, 0) 70%)',
            // Warm orange glow low-right (echoes the rim light in the video)
            'radial-gradient(80% 50% at 92% 86%, rgba(245, 162, 134, 0.32) 0%, rgba(245, 162, 134, 0) 70%)',
            // Base vertical wash
            'linear-gradient(to bottom, #2d1a4a 0%, #4c2356 38%, #6c2f5f 60%, #2b1432 88%, #120a1a 100%)',
          ].join(', '),
          filter: 'saturate(110%)',
        }}
      />
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.svg"
        style={{
          objectPosition: '50% 35%',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.7s ease-out',
          willChange: 'opacity',
        }}
      >
        <source src="/video/hero-dusk-slow.mp4" type="video/mp4" />
      </video>
    </>
  );
}

/**
 * Jacob portrait — feathered so the photo melts into the dusk.
 *
 *   variant="anchored" → absolute bottom-center, desktop-only. Used on md+
 *     where the section is full-viewport tall.
 *   variant="inline"   → relative, mobile-only. Sits inside the content
 *     column directly under the CTAs so the face is right below the buttons
 *     without stretching the hero to 100vh.
 */
function JacobPortrait({ variant }: { variant: 'anchored' | 'inline' }) {
  const wrapperClass =
    variant === 'anchored'
      ? 'hidden md:flex absolute inset-x-0 bottom-0 pointer-events-none z-[2] justify-center'
      : 'md:hidden mt-auto pointer-events-none w-full flex justify-center';
  return (
    <div aria-hidden="true" className={wrapperClass}>
      <div
        style={{
          width: variant === 'anchored' ? 'min(900px, 84vw)' : '78vw',
          aspectRatio: '1535 / 1024',
          backgroundImage: 'url(/img/jacob-cut.png)',
          // Figure is centered in the source frame.
          backgroundPosition: 'center top',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          // All chroma + top-fade feathering is baked into the PNG itself —
          // no CSS mask. No CSS filter either: the face should render as
          // the camera captured it, not dimmed/desaturated.
          opacity: 1,
          transform: variant === 'anchored' ? 'translateY(2%)' : 'none',
          position: 'relative',
        }}
      />
    </div>
  );
}

type PanelProps = {
  className?: string;
  style?: React.CSSProperties;
  delay: number;
  floatClass: 'float-a' | 'float-b' | 'float-c';
  magnet: number;
  children: React.ReactNode;
};

/**
 * Each panel nests three transforms so the animations don't fight:
 *   outer — magnetic offset toward cursor (JS-driven)
 *   mid   — entrance fade/slide/blur (anim-panel-in)
 *   inner — ambient float keyframes (float-*)
 */
function Panel({
  className,
  style,
  delay,
  floatClass,
  magnet,
  children,
}: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cx = 0;
    let cy = 0;
    const refresh = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    refresh();

    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const RADIUS = 380;
    const STRENGTH = 26 * magnet;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > RADIUS) {
        targetX = 0;
        targetY = 0;
      } else {
        const k = 1 - d / RADIUS;
        targetX = (dx / RADIUS) * STRENGTH * k * k;
        targetY = (dy / RADIUS) * STRENGTH * k * k;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      raf = 0;
      tx += (targetX - tx) * 0.12;
      ty += (targetY - ty) * 0.12;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - tx) + Math.abs(targetY - ty) > 0.04) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, [magnet]);

  return (
    <div ref={ref} className="absolute will-change-transform" style={style}>
      <div className="anim-panel-in" style={{ animationDelay: `${delay}s` }}>
        <div className={`glass-panel ${className ?? ''} ${floatClass}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Each cycling pill holds a list of states (content + position), and rotates
 * through them every ~6-8 seconds with a fade-out → reposition → fade-in.
 * The terminal pill (kubectl rollout) is hard-anchored so the user always has
 * one constant element to read.
 */
type PillState = {
  content: React.ReactNode;
  position: { top: string; left?: string; right?: string };
};

const STATUS_PILL_STATES: PillState[] = [
  {
    position: { top: '24%', left: '6%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
        </span>
        uptime · 99.98%
      </span>
    ),
  },
  {
    position: { top: '32%', left: '4%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <span className="inline-flex h-2 w-2 rounded-full bg-iris" />
        Currently in Melbourne
      </span>
    ),
  },
  {
    position: { top: '28%', left: '8%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        311 GitHub followers
      </span>
    ),
  },
];

const NOW_PILL_STATES: PillState[] = [
  {
    position: { top: '52%', left: '4%' },
    content: (
      <>
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/70 font-[540]">Now</div>
        <div className="mt-2 text-[15px] font-[540] tracking-[-0.005em] text-white">
          Forward deployed @ Lyra
        </div>
        <div className="mt-1 text-[13px] text-white/82 leading-[1.4]">
          In the room. In the codebase. Shipping.
        </div>
      </>
    ),
  },
  {
    position: { top: '58%', left: '6%' },
    content: (
      <>
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/70 font-[540]">Studying</div>
        <div className="mt-2 text-[15px] font-[540] tracking-[-0.005em] text-white">
          BSc (Hons) Advanced CS
        </div>
        <div className="mt-1 text-[13px] text-white/82 leading-[1.4]">
          Monash University · algorithms & software.
        </div>
      </>
    ),
  },
  {
    position: { top: '50%', left: '3%' },
    content: (
      <>
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/70 font-[540]">Open source</div>
        <div className="mt-2 text-[15px] font-[540] tracking-[-0.005em] text-white">
          HypixelSkyBlock · 255★
        </div>
        <div className="mt-1 text-[13px] text-white/82 leading-[1.4]">
          1.21.11 sandbox · 33 contributors · 180k LOC.
        </div>
      </>
    ),
  },
];

const AWARD_PILL_STATES: PillState[] = [
  {
    position: { top: '20%', right: '5%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2.39 4.84L19.5 7.6l-3.75 3.66.88 5.16L12 13.77l-4.63 2.65.88-5.16L4.5 7.6l5.11-.76L12 2z" />
        </svg>
        1st · MACATHON 2025
      </span>
    ),
  },
  {
    position: { top: '26%', right: '7%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2.39 4.84L19.5 7.6l-3.75 3.66.88 5.16L12 13.77l-4.63 2.65.88-5.16L4.5 7.6l5.11-.76L12 2z" />
        </svg>
        1st · Advent of MAPS 2025
      </span>
    ),
  },
  {
    position: { top: '18%', right: '8%' },
    content: (
      <span className="inline-flex items-center gap-2 text-[13px] font-[540]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2.39 4.84L19.5 7.6l-3.75 3.66.88 5.16L12 13.77l-4.63 2.65.88-5.16L4.5 7.6l5.11-.76L12 2z" />
        </svg>
        2nd · MCPC 2025
      </span>
    ),
  },
];

const TAG_R_STATES: PillState[] = [
  {
    position: { top: '78%', right: '12%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        Hypixel · 200k CCU
      </span>
    ),
  },
  {
    position: { top: '82%', right: '10%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        Ceebs · event-sourced CQRS
      </span>
    ),
  },
  {
    position: { top: '76%', right: '14%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        Bathroom Superstore · 1k+ SKUs
      </span>
    ),
  },
];

const TAG_L_STATES: PillState[] = [
  {
    position: { top: '80%', left: '12%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        k8s · kafka · postgres
      </span>
    ),
  },
  {
    position: { top: '76%', left: '10%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        java · rust · c++
      </span>
    ),
  },
  {
    position: { top: '82%', left: '14%' },
    content: (
      <span className="text-[12px] tracking-[0.18em] uppercase text-white/90">
        terraform · datadog · redis
      </span>
    ),
  },
];

function CyclingPanel({
  states,
  className,
  floatClass,
  delay,
  magnet,
  intervalMs,
  offsetMs = 0,
}: {
  states: PillState[];
  className: string;
  floatClass: 'float-a' | 'float-b' | 'float-c';
  delay: number;
  magnet: number;
  intervalMs: number;
  offsetMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const startTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    startTimerRef.current = window.setTimeout(() => {
      const tick = () => {
        setPhase('out');
        fadeTimerRef.current = window.setTimeout(() => {
          setIdx((i) => (i + 1) % states.length);
          setPhase('in');
        }, 350);
      };
      intervalRef.current = window.setInterval(tick, intervalMs);
    }, offsetMs);
    return () => {
      if (startTimerRef.current !== null) window.clearTimeout(startTimerRef.current);
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current);
    };
  }, [intervalMs, offsetMs, states.length]);

  const state = states[idx];
  return (
    <Panel
      className={className}
      floatClass={floatClass}
      delay={delay}
      magnet={magnet}
      style={{
        ...state.position,
        transition: 'top 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), left 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), right 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)',
      }}
    >
      <div
        style={{
          opacity: phase === 'in' ? 1 : 0,
          transform: `translateY(${phase === 'in' ? '0' : '-6px'})`,
          transition: 'opacity 0.34s ease, transform 0.34s ease',
        }}
      >
        {state.content}
      </div>
    </Panel>
  );
}

function FloatingPanels() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
      <CyclingPanel
        states={STATUS_PILL_STATES}
        className="glass-pill"
        floatClass="float-a"
        delay={0.55}
        magnet={1.1}
        intervalMs={6800}
        offsetMs={0}
      />

      <CyclingPanel
        states={NOW_PILL_STATES}
        className="glass-rect"
        floatClass="float-b"
        delay={0.75}
        magnet={0.7}
        intervalMs={8200}
        offsetMs={2200}
      />

      <CyclingPanel
        states={AWARD_PILL_STATES}
        className="glass-pill"
        floatClass="float-c"
        delay={0.6}
        magnet={1.1}
        intervalMs={7400}
        offsetMs={1100}
      />

      {/* Terminal panel — anchored, never cycles */}
      <Panel
        className="glass-rect"
        floatClass="float-a"
        delay={0.85}
        magnet={0.7}
        style={{ top: '46%', right: '4%', width: '280px' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/35" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/35" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/35" />
          <span className="ml-2 text-[11px] tracking-[0.12em] uppercase text-white/55">~ swofty</span>
        </div>
        <pre className="mt-3 text-[12.5px] leading-[1.5] text-white/85 font-mono whitespace-pre-wrap">
{`$ kubectl rollout status \\
    deploy/edge-gateway

deployment "edge-gateway"
successfully rolled out`}
        </pre>
      </Panel>

      <CyclingPanel
        states={TAG_R_STATES}
        className="glass-pill"
        floatClass="float-b"
        delay={0.95}
        magnet={1.3}
        intervalMs={7800}
        offsetMs={3300}
      />

      <CyclingPanel
        states={TAG_L_STATES}
        className="glass-pill"
        floatClass="float-c"
        delay={1.0}
        magnet={1.3}
        intervalMs={6600}
        offsetMs={4400}
      />
    </div>
  );
}
