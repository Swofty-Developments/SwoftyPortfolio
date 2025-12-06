'use client';

import FooterSpline from '../layout/FooterSpline';

export default function Footer() {
  return (
    <footer className="relative z-0 h-[1080px] min-h-[1080px] px-6 md:px-16 border-t border-violet-500/10 pointer-events-auto overflow-hidden">
      <FooterSpline />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
    </footer>
  );
}
