'use client';

import { useEffect, useState } from 'react';

type SectionKey = 'hero' | 'about' | 'experience' | 'work' | 'contact';

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  type: 'experience';
}

interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
  type: 'award';
}

const experiences: Experience[] = [
  {
    title: 'Projects Officer',
    company: 'Monash Association of Coding',
    period: 'Oct 2025 - Present',
    location: 'Hybrid',
    description:
      "Designed, coordinated and delivered a range of hands-on coding projects and technical workshops for MAC's student community.",
    type: 'experience',
  },
  {
    title: 'Technical Project Manager',
    company: 'Ceebs',
    period: 'Aug 2025 - Present',
    location: 'Melbourne, VIC',
    description:
      'Designed and orchestrated a large refactor from monolithic to microservices-based food delivery platform with event-sourced CQRS architecture.',
    type: 'experience',
  },
  {
    title: 'Systems Administrator',
    company: 'Bathroom Superstore',
    period: 'Nov 2024 - Present',
    location: 'Melbourne, VIC',
    description:
      'Designed, developed and maintained infrastructure serving over a thousand catalogue items and tens of thousands of monthly requests.',
    type: 'experience',
  },
  {
    title: 'Software Engineer',
    company: 'Hypixel Inc',
    period: 'Sep 2023 - Nov 2024',
    location: 'Remote',
    description:
      "Managed large-scale infrastructure for one of the world's biggest gaming networks, supporting 200,000+ concurrent players.",
    type: 'experience',
  },
];

const awards: Award[] = [
  {
    title: '2nd Place MCPC 2025',
    issuer: 'Monash Algorithms and Problem Solving',
    date: 'Oct 2025',
    description:
      'Pioneered a small team to win 2nd place in the yearly Monash Collegiate Programming Competition.',
    type: 'award',
  },
  {
    title: '1st Place Advent of MAPS',
    issuer: 'Monash Algorithms and Problem Solving',
    date: 'Aug 2025',
    description:
      'Won 1st place in the yearly month-long competitive programming competition.',
    type: 'award',
  },
  {
    title: '1st Place MACATHON 2025',
    issuer: 'Monash Association of Coding',
    date: 'May 2025',
    description:
      "Led a team to win 1st place and $1,800 prize at Monash University's 48-hour hackathon.",
    type: 'award',
  },
];

const projects = [
  {
    title: 'SkyBlock Recreation',
    description:
      'The best commercial Hypixel SkyBlock Sandbox / Recreation currently available. Contains Gemstones, 70% of Hypixels Items, Dwarven Mines, Guilds, Auction House, NPC shops, Quests, Islands, Bazaar and just about everything else!',
    tags: ['Spigot Library', 'Advanced NMS', 'Java', 'Cloudflare (Anti-DDOS)'],
  },
  {
    title: '2nd Biggest MCMarket Setup',
    description:
      'I both hosted and helped develop the former 2nd highest rated setup on BuiltByBit (formerly MCMarket). It was a detailed SkyBlock setup utilizing a combination of 30 different plugins.',
    tags: ['Server Setup', 'Spigot Library', 'Java'],
  },
  {
    title: 'HyperLands',
    description:
      'Hyperlands is the former second biggest non-featured MCPE server, with it hitting peaks of over 2k players. The server boasts an active discord community of 30,000 people.',
    tags: ['React', 'Express', 'Styled Components', 'Proxy Development'],
  },
];

const techStack = [
  'Kubernetes', 'Docker', 'Java', 'Python', 'TypeScript',
  'React', 'Next.js', 'PostgreSQL', 'Redis', 'AWS',
  'Kafka', 'CI/CD', 'Terraform', 'GraphQL',
];

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="h-[1px] w-16 bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500" />
      <span className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase">{label}</span>
    </div>
  );
}

export default function MobileReadme() {
  const [visible, setVisible] = useState<Record<SectionKey, boolean>>({
    hero: false,
    about: false,
    experience: false,
    work: false,
    contact: false,
  });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    setVisible((prev) => ({ ...prev, hero: true }));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = entry.target.getAttribute('data-section') as SectionKey | null;
          if (key) {
            setVisible((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
          }
        }
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const reveal = (key: SectionKey) =>
    visible[key] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => { setFormStatus('idle'); setErrorMessage(''); }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Static background — no animated blobs, no blur */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/15 via-black to-black" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 15%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 85%, rgba(168,85,247,0.04) 0%, transparent 45%)',
          }}
        />
      </div>

      {/* Nav — solid bg, no blur */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/95">
        <div className="px-8 py-4 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-white/40">
          <a href="#home" className="active:text-violet-300 transition-colors">Home</a>
          <a href="#about" className="active:text-violet-300 transition-colors">About</a>
          <a href="#experience" className="active:text-violet-300 transition-colors">Journey</a>
          <a href="#work" className="active:text-violet-300 transition-colors">Work</a>
          <a href="#contact" className="active:text-violet-300 transition-colors">Contact</a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ─── Hero ─── */}
        <section
          id="home"
          data-section="hero"
          className="min-h-[92svh] px-8 flex flex-col justify-center"
        >
          <p
            className={`text-sm text-violet-300/60 tracking-wide transition-all duration-700 ${reveal('hero')}`}
            style={{ transitionDelay: '100ms' }}
          >
            Hi, my name is
          </p>

          <h1
            className={`mt-4 leading-[0.92] transition-all duration-700 ${reveal('hero')}`}
            style={{
              fontSize: 'clamp(3.2rem, 16vw, 5.5rem)',
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '220ms',
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
            className={`mt-6 text-[clamp(1.4rem,6vw,2rem)] text-white/85 transition-all duration-700 ${reveal('hero')}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '360ms',
            }}
          >
            I&apos;m a <span className="text-violet-400">DevOps Engineer</span>
          </p>
        </section>

        {/* ─── About ─── */}
        <section id="about" data-section="about" className="px-8 py-24">
          <div
            className={`transition-all duration-700 ${reveal('about')}`}
            style={{ transitionDelay: '40ms' }}
          >
            <SectionLabel label="About Me" />
          </div>

          <h2
            className={`text-[1.75rem] leading-[1.4] text-white transition-all duration-700 ${reveal('about')}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '120ms',
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

          <div
            className={`mt-8 space-y-5 transition-all duration-700 ${reveal('about')}`}
            style={{ transitionDelay: '220ms' }}
          >
            <p className="text-white/60 text-[15px] leading-[1.75]">
              I&apos;m a <span className="text-violet-300/80">computer science student</span> and competitive programmer,
              currently studying Advanced Computer Science with Honours at university.
            </p>
            <p className="text-white/60 text-[15px] leading-[1.75]">
              Majoring in <span className="text-violet-300/80">Mathematics</span> and specializing in{' '}
              <span className="text-violet-300/80">Data Science</span> and{' '}
              <span className="text-violet-300/80">Artificial Intelligence</span>.
            </p>
            <p className="text-white/60 text-[15px] leading-[1.75]">
              I have extensive experience with <span className="text-violet-300/80">Minecraft development</span> and
              building large-scale multiplayer experiences, including an open source Hypixel SkyBlock
              recreation that has gained hundreds of stars on GitHub.
            </p>
          </div>

          <div
            className={`mt-10 flex flex-wrap gap-2.5 transition-all duration-700 ${reveal('about')}`}
            style={{ transitionDelay: '340ms' }}
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-3.5 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/[0.04] text-violet-300/55"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Experience & Awards ─── */}
        <section id="experience" data-section="experience" className="px-8 py-24">
          <div
            className={`transition-all duration-700 ${reveal('experience')}`}
            style={{ transitionDelay: '40ms' }}
          >
            <SectionLabel label="Experience & Awards" />
          </div>

          <h2
            className={`text-[2rem] text-white transition-all duration-700 ${reveal('experience')}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '120ms',
            }}
          >
            MY{' '}
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              JOURNEY
            </span>
          </h2>

          {/* Experiences */}
          <div className="mt-10 space-y-5">
            {experiences.map((entry, i) => (
              <article
                key={entry.company}
                className={`rounded-2xl p-6 border border-violet-500/10 transition-all duration-700 ${reveal('experience')}`}
                style={{
                  transitionDelay: `${200 + i * 80}ms`,
                  background: 'linear-gradient(145deg, rgba(20,12,35,0.85) 0%, rgba(10,6,20,0.9) 100%)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.25em] text-violet-400/50 uppercase">{entry.period}</p>
                    <h3
                      className="mt-2 text-lg text-white"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {entry.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-violet-300/60">{entry.company}</p>
                  </div>
                  <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-violet-400/60" />
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/50">{entry.description}</p>
              </article>
            ))}
          </div>

          {/* Awards */}
          <h3
            className={`mt-14 text-xs tracking-[0.25em] text-fuchsia-400/50 uppercase transition-all duration-700 ${reveal('experience')}`}
            style={{ transitionDelay: '600ms' }}
          >
            Awards
          </h3>

          <div className="mt-5 space-y-4">
            {awards.map((award, i) => (
              <article
                key={award.title}
                className={`rounded-2xl p-6 border border-fuchsia-500/10 transition-all duration-700 ${reveal('experience')}`}
                style={{
                  transitionDelay: `${660 + i * 80}ms`,
                  background: 'linear-gradient(145deg, rgba(30,12,35,0.85) 0%, rgba(15,6,20,0.9) 100%)',
                }}
              >
                <p className="text-[10px] tracking-[0.25em] text-fuchsia-400/40 uppercase">{award.date}</p>
                <h3
                  className="mt-2 text-lg text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {award.title}
                </h3>
                <p className="mt-0.5 text-sm text-fuchsia-300/50">{award.issuer}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/50">{award.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── Projects ─── */}
        <section id="work" data-section="work" className="px-8 py-24">
          <div
            className={`transition-all duration-700 ${reveal('work')}`}
            style={{ transitionDelay: '40ms' }}
          >
            <SectionLabel label="Selected Work" />
          </div>

          <h2
            className={`text-[2rem] text-white transition-all duration-700 ${reveal('work')}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '120ms',
            }}
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <div className="mt-10 space-y-6">
            {projects.map((project, i) => (
              <article
                key={project.title}
                className={`rounded-2xl p-6 border border-violet-500/10 transition-all duration-700 ${reveal('work')}`}
                style={{
                  transitionDelay: `${200 + i * 90}ms`,
                  background: 'linear-gradient(145deg, rgba(20,12,35,0.85) 0%, rgba(10,6,20,0.9) 100%)',
                }}
              >
                <p className="text-[10px] tracking-[0.25em] text-violet-400/50 uppercase">Featured Project</p>
                <h3
                  className="mt-2.5 text-xl text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {project.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/50">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-violet-500/12 bg-violet-500/[0.04] text-violet-300/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section id="contact" data-section="contact" className="px-8 py-24">
          <div
            className={`transition-all duration-700 ${reveal('contact')}`}
            style={{ transitionDelay: '40ms' }}
          >
            <SectionLabel label="Get In Touch" />
          </div>

          <h2
            className={`text-[2rem] leading-[1.2] text-white transition-all duration-700 ${reveal('contact')}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              transitionDelay: '120ms',
            }}
          >
            Let&apos;s Create Something{' '}
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Amazing
            </span>
          </h2>

          <p
            className={`mt-5 text-white/50 text-[15px] leading-relaxed transition-all duration-700 ${reveal('contact')}`}
            style={{ transitionDelay: '200ms' }}
          >
            Have a project in mind? Drop me a message and let&apos;s discuss how we can work together.
          </p>

          <form
            onSubmit={handleSubmit}
            className={`mt-10 space-y-6 transition-all duration-700 ${reveal('contact')}`}
            style={{ transitionDelay: '280ms' }}
          >
            <div>
              <label htmlFor="m-name" className="block text-xs font-semibold text-white/70 tracking-wide uppercase mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="m-name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={formStatus === 'sending'}
                className="w-full bg-white/[0.04] border border-violet-500/15 rounded-xl px-5 py-4 text-white text-[15px] placeholder-white/20 focus:border-violet-500/40 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="m-email" className="block text-xs font-semibold text-white/70 tracking-wide uppercase mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="m-email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={formStatus === 'sending'}
                className="w-full bg-white/[0.04] border border-violet-500/15 rounded-xl px-5 py-4 text-white text-[15px] placeholder-white/20 focus:border-violet-500/40 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="m-message" className="block text-xs font-semibold text-white/70 tracking-wide uppercase mb-2">
                Your Message
              </label>
              <textarea
                id="m-message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                disabled={formStatus === 'sending'}
                className="w-full bg-white/[0.04] border border-violet-500/15 rounded-xl px-5 py-4 text-white text-[15px] placeholder-white/20 focus:border-violet-500/40 focus:outline-none transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full py-4 rounded-xl text-white text-[15px] font-semibold tracking-wider transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                boxShadow: '0 8px 32px rgba(168,85,247,0.25)',
              }}
            >
              {formStatus === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            {formStatus === 'success' && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-green-400 text-sm">Message sent! I&apos;ll get back to you soon.</p>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{errorMessage || 'Failed to send. Please try again.'}</p>
              </div>
            )}
          </form>

          <p
            className={`mt-8 text-white/40 text-sm transition-all duration-700 ${reveal('contact')}`}
            style={{ transitionDelay: '360ms' }}
          >
            Or reach me directly at{' '}
            <a href="mailto:admin@swofty.net" className="text-violet-400">
              admin@swofty.net
            </a>
          </p>
        </section>

        {/* ─── Footer ─── */}
        <footer className="px-8 pt-8 pb-12 border-t border-white/[0.04]">
          <p className="text-center text-[11px] text-white/30">
            Made with love by{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Swofty
            </span>
          </p>
          <p className="text-center text-[10px] mt-2 text-white/20">
            Built with Next.js, React, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
