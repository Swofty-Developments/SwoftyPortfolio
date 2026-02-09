'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-violet-950/30 via-black to-black" />
  ),
});

const ENABLE_SPLINE = true;

export default function FooterSpline() {
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSplineLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
      {/* Gradient fallback behind everything */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black pointer-events-none">
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"
            style={{ animation: 'pulse 4s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"
            style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}
          />
          <div
            className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[80px]"
            style={{ animation: 'pulse 4s ease-in-out infinite 2s' }}
          />
        </div>
      </div>

      {/* Spline canvas */}
      {ENABLE_SPLINE && mounted && (
        <div
          className={`absolute inset-0 z-10 pointer-events-auto transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <Spline
            scene="https://prod.spline.design/MZq7kXo79Cm3jRXM/scene.splinecode"
            onLoad={handleSplineLoad}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'auto',
            }}
          />
        </div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
