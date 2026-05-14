import AnnouncementBanner from '@/components/ui/AnnouncementBanner';
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ExperienceSection from '@/sections/ExperienceSection';
import OpenSourceSection from '@/sections/OpenSourceSection';
import ContactSection from '@/sections/ContactSection';
import SectionDivider from '@/components/ui/SectionDivider';
import HatchedRule from '@/components/ui/HatchedRule';

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <NavBar />
      <main className="text-ink">
        <HeroSection />
        {/* Framed parchment card — the wrapper has horizontal padding so the
            darker body (driftwood) shows through as ~32px rails on either
            side, regardless of viewport width. */}
        <div className="px-4 sm:px-6 md:px-8">
          <div
            className="parchment-card mx-auto relative z-[5]"
            style={{ width: '100%', maxWidth: '1440px' }}
          >
            <OpenSourceSection />
            <HatchedRule />
            <AboutSection />
            <HatchedRule />
            <ExperienceSection />
            <ContactSection />
            <SectionDivider />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
