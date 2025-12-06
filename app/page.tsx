'use client';

import SplineBackground from '@/components/layout/SplineBackground';
import NavBar from '@/components/ui/NavBar';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ExperienceSection from '@/sections/ExperienceSection';
import WorkSection from '@/sections/WorkSection';
import ContactSection from '@/sections/ContactSection';

export default function Home() {
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
