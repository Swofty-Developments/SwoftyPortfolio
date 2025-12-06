'use client';

import { useEffect, useState } from 'react';
import SplineBackground from '@/components/layout/SplineBackground';
import NavBar from '@/components/ui/NavBar';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ExperienceSection from '@/sections/ExperienceSection';
import WorkSection from '@/sections/WorkSection';
import ContactSection from '@/sections/ContactSection';
import MobileReadme from '@/components/ui/MobileReadme';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
          <SplineBackground />
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
  );
}
