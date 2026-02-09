'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SplineBackground from '@/components/layout/SplineBackground';
import NavBar from '@/components/ui/NavBar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HeroSection from '@/sections/HeroSection';
import MobileReadme from '@/components/ui/MobileReadme';

const AboutSection = dynamic(() => import('@/sections/AboutSection'));
const ExperienceSection = dynamic(() => import('@/sections/ExperienceSection'));
const WorkSection = dynamic(() => import('@/sections/WorkSection'));
const ContactSection = dynamic(() => import('@/sections/ContactSection'));

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [siteReady, setSiteReady] = useState(false);

  useEffect(() => {
    // Check if device is mobile based on screen width and touch capability
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768 && 'ontouchstart' in window);
      setIsMobile(isMobileDevice);
      setIsLoaded(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSplineLoad = useCallback(() => {
    setSiteReady(true);
  }, []);

  // Fallback: if Spline never loads, dismiss after 3s
  useEffect(() => {
    if (!isLoaded || isMobile || siteReady) {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      setSiteReady(true);
    }, 3000);

    return () => window.clearTimeout(fallbackTimer);
  }, [isLoaded, isMobile, siteReady]);

  // Show nothing until we've determined mobile status to prevent flash
  if (!isLoaded) {
    return <div className="min-h-screen bg-black" />;
  }

  // Show README version for mobile users
  if (isMobile) {
    return <MobileReadme />;
  }

  // Show full desktop experience
  return (
    <>
      <LoadingScreen isLoading={!siteReady} />

      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        <NavBar />

        {/* Spline only visible in hero section viewport */}
        <div
          className="absolute top-0 left-0 w-full z-0"
          style={{
            height: '100vh',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div className="fixed top-0 left-0 w-screen h-screen">
            <SplineBackground onSplineLoad={handleSplineLoad} />
          </div>
        </div>

        <div className="page-root relative z-10 pointer-events-none">
          <main>
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <WorkSection />
            <ContactSection />
          </main>
        </div>
      </div>
    </>
  );
}
