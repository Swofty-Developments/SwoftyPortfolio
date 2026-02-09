'use client';

import { useEffect, useState } from 'react';

type SectionKey = 'hero' | 'about' | 'journey' | 'work' | 'contact' | 'footer';

const techStack = [
  'Kubernetes',
  'Docker',
  'Java',
  'Python',
  'TypeScript',
  'React',
  'Next.js',
  'PostgreSQL',
  'Redis',
  'AWS',
  'CI/CD',
  'Minecraft Development',
];

const journeyEntries = [
  {
    title: 'HyperLands',
    period: '2019 - 2022',
    description: 'Web development and proxy development for a large MCPE server ecosystem.',
  },
  {
    title: 'SkyBlock Recreation',
    period: '2021 - Present',
    description:
      'Open source Hypixel SkyBlock recreation with hundreds of GitHub stars and a large contributor/user community.',
  },
  {
    title: 'University',
    period: '2023 - Present',
    description: 'Advanced Computer Science with Honours while majoring in Mathematics.',
  },
];

const projects = [
  {
    title: 'SkyBlock Recreation',
    description:
      'The best commercial Hypixel SkyBlock sandbox/recreation currently available, including gemstones, auction house, bazaar, guilds, quests, islands, and more.',
    tags: ['Spigot Library', 'Advanced NMS', 'Java', 'Cloudflare (Anti-DDOS)'],
  },
  {
    title: '2nd Biggest MCMarket Setup',
    description:
      'Hosted and co-developed the former 2nd highest rated setup on BuiltByBit (formerly MCMarket), combining ~30 plugins and hardening the full deployment lifecycle.',
    tags: ['Server Setup', 'Spigot Library', 'Java'],
  },
  {
    title: 'HyperLands',
    description:
      'Former second biggest non-featured MCPE server project, including web development, testing, and systems support for a community that reached 30,000 Discord members.',
    tags: ['React', 'Express', 'Styled Components', 'Proxy Development', 'Game Design'],
  },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-[1px] w-16 bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500" />
      <span className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase">{label}</span>
    </div>
  );
}

export default function MobileReadme() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<Record<SectionKey, boolean>>({
    hero: false,
    about: false,
    journey: false,
    work: false,
    contact: false,
    footer: false,
  });

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setMounted(true);
      setVisible((prev) => ({ ...prev, hero: true }));
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const key = entry.target.getAttribute('data-mobile-section') as SectionKey | null;
          if (!key) {
            return;
          }
          setVisible((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-mobile-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const revealClass = (key: SectionKey) =>
    mounted && visible[key]
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-4';

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-20 w-[22rem] h-[22rem] rounded-full bg-violet-600/10 blur-[110px] mobile-blob-a" />
        <div className="absolute top-[26%] -right-20 w-[20rem] h-[20rem] rounded-full bg-purple-600/10 blur-[105px] mobile-blob-b" />
        <div className="absolute bottom-[-5rem] left-[20%] w-[18rem] h-[18rem] rounded-full bg-fuchsia-600/10 blur-[100px] mobile-blob-c" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(167,139,250,0.08),transparent_48%),radial-gradient(circle_at_80%_70%,rgba(232,121,249,0.07),transparent_42%)]" />
      </div>

      <div className="sticky top-0 z-30 border-b border-violet-500/10 bg-black/55 backdrop-blur-xl">
        <nav className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-white/50">
          <a href="#home" className="hover:text-violet-300 transition-colors">Home</a>
          <a href="#about" className="hover:text-violet-300 transition-colors">About</a>
          <a href="#journey" className="hover:text-violet-300 transition-colors">Journey</a>
          <a href="#work" className="hover:text-violet-300 transition-colors">Work</a>
          <a href="#contact" className="hover:text-violet-300 transition-colors">Contact</a>
        </nav>
      </div>

      <main className="relative z-10">
        <section
          id="home"
          data-mobile-section="hero"
          className="min-h-[100svh] px-6 pt-24 pb-14 flex flex-col justify-center"
        >
          <div className="max-w-lg mx-auto w-full">
            <p
              className={`text-sm text-violet-300/70 tracking-wide transition-all duration-700 ${revealClass('hero')}`}
              style={{ transitionDelay: '80ms' }}
            >
              Hi, my name is
            </p>
            <h1
              className={`mt-3 text-[clamp(3.4rem,17vw,5rem)] leading-[0.9] transition-all duration-700 ${revealClass('hero')}`}
              style={{
                transitionDelay: '200ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(180deg, #c4b5fd 0%, #a855f7 50%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SWOFTY.
              </span>
            </h1>
            <p
              className={`mt-5 text-3xl text-white/90 transition-all duration-700 ${revealClass('hero')}`}
              style={{
                transitionDelay: '320ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              I&apos;m a <span className="text-violet-400">DevOps Engineer</span>
            </p>
          </div>
        </section>

        <section id="about" data-mobile-section="about" className="px-6 py-14">
          <div className="max-w-lg mx-auto">
            <div className={`transition-all duration-700 ${revealClass('about')}`} style={{ transitionDelay: '40ms' }}>
              <SectionLabel label="About Me" />
            </div>

            <h2
              className={`text-3xl leading-[1.3] text-white transition-all duration-700 ${revealClass('about')}`}
              style={{
                transitionDelay: '120ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Hello! My name is{' '}
              <span
                style={{
                  background: 'linear-gradient(180deg, #c4b5fd 0%, #a855f7 50%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Swofty
              </span>{' '}
              and I enjoy creating things that live on the internet.
            </h2>

            <div className={`mt-7 space-y-5 transition-all duration-700 ${revealClass('about')}`} style={{ transitionDelay: '220ms' }}>
              <p className="text-white/70 leading-relaxed">
                I&apos;m a computer science student and competitive programmer, currently studying Advanced Computer Science
                with Honours at university.
              </p>
              <p className="text-white/70 leading-relaxed">
                Majoring in <span className="text-violet-300/90">Mathematics</span> and specializing in{' '}
                <span className="text-violet-300/90">Data Science</span> and{' '}
                <span className="text-violet-300/90">Artificial Intelligence</span>.
              </p>
              <p className="text-white/70 leading-relaxed">
                I have extensive experience with <span className="text-violet-300/90">Minecraft development</span> and
                building large-scale multiplayer systems, including an open source Hypixel SkyBlock recreation with
                hundreds of stars on GitHub.
              </p>
            </div>

            <div
              className={`mt-8 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 transition-all duration-700 ${revealClass('about')}`}
              style={{ transitionDelay: '300ms' }}
            >
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/5 text-violet-300/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="journey" data-mobile-section="journey" className="px-6 py-14">
          <div className="max-w-lg mx-auto">
            <div className={`transition-all duration-700 ${revealClass('journey')}`} style={{ transitionDelay: '50ms' }}>
              <SectionLabel label="My Journey" />
            </div>

            <h2
              className={`text-4xl text-white transition-all duration-700 ${revealClass('journey')}`}
              style={{
                transitionDelay: '130ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              MY <span className="text-violet-400">JOURNEY</span>
            </h2>

            <div className="relative mt-8 pl-6">
              <div className="absolute left-2.5 top-1 bottom-1 w-px bg-gradient-to-b from-violet-400/80 via-violet-500/40 to-transparent" />
              {journeyEntries.map((entry, index) => (
                <article
                  key={entry.title}
                  className={`relative mb-5 last:mb-0 rounded-2xl p-4 border border-violet-500/15 transition-all duration-700 ${revealClass('journey')}`}
                  style={{
                    transitionDelay: `${210 + index * 90}ms`,
                    background: 'linear-gradient(145deg, rgba(20, 12, 35, 0.92) 0%, rgba(12, 8, 24, 0.95) 100%)',
                    boxShadow:
                      '0 8px 36px rgba(139, 92, 246, 0.14), 0 0 0 1px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <span className="absolute -left-[1.03rem] top-5 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.65)]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-violet-300/70">{entry.period}</p>
                  <h3 className="mt-2 text-xl text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{entry.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" data-mobile-section="work" className="px-6 py-14">
          <div className="max-w-lg mx-auto">
            <div className={`transition-all duration-700 ${revealClass('work')}`} style={{ transitionDelay: '50ms' }}>
              <SectionLabel label="Selected Work" />
            </div>

            <h2
              className={`text-4xl text-white transition-all duration-700 ${revealClass('work')}`}
              style={{
                transitionDelay: '130ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Featured <span className="text-violet-400">Projects</span>
            </h2>

            <div className="mt-8 space-y-4">
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  className={`rounded-2xl p-5 border border-violet-500/15 transition-all duration-700 ${revealClass('work')}`}
                  style={{
                    transitionDelay: `${220 + index * 90}ms`,
                    background: 'linear-gradient(145deg, rgba(20, 12, 35, 0.92) 0%, rgba(12, 8, 24, 0.95) 100%)',
                    boxShadow:
                      '0 10px 48px rgba(139, 92, 246, 0.14), 0 0 0 1px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <p className="text-[10px] tracking-[0.3em] text-violet-400/70 uppercase">Featured Project</p>
                  <h3 className="mt-2 text-2xl text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-full border border-violet-500/15 bg-violet-500/5 text-violet-300/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" data-mobile-section="contact" className="px-6 py-14">
          <div className="max-w-lg mx-auto">
            <div className={`transition-all duration-700 ${revealClass('contact')}`} style={{ transitionDelay: '50ms' }}>
              <SectionLabel label="Get In Touch" />
            </div>

            <h2
              className={`text-4xl text-white transition-all duration-700 ${revealClass('contact')}`}
              style={{
                transitionDelay: '130ms',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Let&apos;s Build Something Great
            </h2>

            <div className={`mt-5 space-y-3 transition-all duration-700 ${revealClass('contact')}`} style={{ transitionDelay: '220ms' }}>
              <p className="text-white/70 leading-relaxed">
                I&apos;m always open to interesting projects, engineering challenges, and collaborations.
              </p>
              <p className="text-white/75">
                Email:{' '}
                <a href="mailto:contact@swofty.dev" className="text-violet-300 hover:text-fuchsia-300 transition-colors">
                  contact@swofty.dev
                </a>
              </p>
              <p className="text-white/75">
                GitHub:{' '}
                <a
                  href="https://github.com/Swofty-Developments"
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-300 hover:text-fuchsia-300 transition-colors"
                >
                  github.com/Swofty-Developments
                </a>
              </p>
              <p className="text-white/65">Discord: Available upon request</p>
            </div>

            <a
              href="mailto:contact@swofty.dev"
              className={`inline-flex mt-8 items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white border border-violet-400/35 bg-violet-500/10 hover:bg-violet-500/20 transition-all duration-500 shadow-[0_0_28px_rgba(139,92,246,0.2)] ${revealClass('contact')}`}
              style={{ transitionDelay: '300ms' }}
            >
              Say Hello
            </a>
          </div>
        </section>

        <footer id="footer" data-mobile-section="footer" className="px-6 pt-8 pb-10 border-t border-violet-500/10">
          <div className={`max-w-lg mx-auto text-center transition-all duration-700 ${revealClass('footer')}`}>
            <p className="text-xs text-white/45">© {new Date().getFullYear()} Swofty Developments</p>
            <p className="text-[11px] mt-2 text-violet-300/45">Built with Next.js, React, TypeScript, and Tailwind CSS</p>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .mobile-blob-a {
          animation: mobileBlobA 14s ease-in-out infinite;
        }
        .mobile-blob-b {
          animation: mobileBlobB 18s ease-in-out infinite;
        }
        .mobile-blob-c {
          animation: mobileBlobC 16s ease-in-out infinite;
        }
        @keyframes mobileBlobA {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(24px, 30px, 0) scale(1.08); }
        }
        @keyframes mobileBlobB {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-20px, -26px, 0) scale(1.07); }
        }
        @keyframes mobileBlobC {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(10px, -18px, 0) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
