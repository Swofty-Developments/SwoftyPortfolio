'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ENABLE_SPLINE = true;

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-violet-950/30 via-black to-black" />
  ),
});

type SplineBackgroundProps = {
  onSplineLoad?: () => void;
};

export default function SplineBackground({ onSplineLoad }: SplineBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSplineLoad = () => {
    setIsLoaded(true);
    onSplineLoad?.();
  };

  return (
    <div className="w-full h-full">
      {/* Container limited to exactly one viewport height */}
      <div className="absolute inset-0">
        {/* Gradient fallback behind everything */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black">
          <div className="absolute inset-0">
            <div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"
              style={{ animation: 'pulse 4s ease-in-out infinite' }}
            ></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"
              style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}
            ></div>
            <div
              className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[80px]"
              style={{ animation: 'pulse 4s ease-in-out infinite 2s' }}
            ></div>
          </div>
        </div>

        {/* Spline canvas */}
        {ENABLE_SPLINE && mounted && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <Spline
              scene="https://prod.spline.design/zKCnRlFiWMuKJfsx/scene.splinecode"
              renderOnDemand={true}
              onLoad={handleSplineLoad}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
          </div>
        )}

        {/* Black box to cover bottom-right corner */}
        <div
          className="absolute bottom-0 right-0 bg-black pointer-events-none z-20"
          style={{
            width: '340px',
            height: '220px',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }}
        ></div>
      </div>
    </div>
  );
}
