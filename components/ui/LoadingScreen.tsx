'use client';

import { useEffect, useRef, useState } from 'react';

type LoadingScreenProps = {
  isLoading: boolean;
  onComplete?: () => void;
};

const LETTERS = 'SWOFTY.'.split('');

export default function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Handle exit when loading finishes
  useEffect(() => {
    if (!isLoading && entered && !exiting) {
      setExiting(true);
      const timer = setTimeout(() => {
        setHidden(true);
        onComplete?.();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isLoading, entered, exiting, onComplete]);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'black',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* Subtle ambient glow behind text */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          animation: 'loadingPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div className="flex flex-col items-center gap-8">
        {/* Staggered letter entrance */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            lineHeight: 1,
            letterSpacing: '0.04em',
            display: 'flex',
          }}
        >
          {LETTERS.map((char, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(180deg, #c4b5fd 0%, #a855f7 50%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                opacity: entered ? 1 : 0,
                transform: entered
                  ? exiting
                    ? 'translateY(-20px)'
                    : 'translateY(0)'
                  : 'translateY(30px)',
                transition: exiting
                  ? `opacity 400ms ease ${i * 40}ms, transform 400ms ease ${i * 40}ms`
                  : `opacity 500ms cubic-bezier(0.0, 0.0, 0.2, 1) ${200 + i * 80}ms, transform 500ms cubic-bezier(0.0, 0.0, 0.2, 1) ${200 + i * 80}ms`,
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Expanding line */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
            transform: entered ? (exiting ? 'scaleX(0)' : 'scaleX(1)') : 'scaleX(0)',
            width: '180px',
            transition: exiting
              ? 'transform 500ms ease 100ms, opacity 500ms ease 100ms'
              : 'transform 800ms cubic-bezier(0.0, 0.0, 0.2, 1) 800ms',
            opacity: exiting ? 0 : 1,
          }}
        />

        {/* Subtle loading dots */}
        <div className="flex gap-2" style={{ height: '6px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#a855f7',
                opacity: entered ? (exiting ? 0 : 1) : 0,
                transition: exiting
                  ? `opacity 300ms ease ${i * 50}ms`
                  : `opacity 400ms ease ${1000 + i * 150}ms`,
                animation: entered && !exiting ? `loadingDot 1.4s ease-in-out ${i * 0.2}s infinite` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes loadingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
