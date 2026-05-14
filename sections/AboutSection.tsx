'use client';

import { useEffect, useRef, useState } from 'react';
import { LogoTileGrid, LogoBrandDetail } from '@/components/ui/LogoBar';

type Tech = { name: string; slug: string; color: string };

/**
 * Curated tech list with simple-icons slugs + brand colors.
 * Icons fetched from cdn.simpleicons.org/{slug}/{color}.
 */
const TECH: Tech[] = [
  { name: 'Kubernetes', slug: 'kubernetes', color: '326CE5' },
  { name: 'Docker', slug: 'docker', color: '2496ED' },
  { name: 'Terraform', slug: 'terraform', color: '844FBA' },
  // AWS and Azure aren't on simple-icons (brand licensing). Served locally
  // from devicons SVGs instead — see TechTile for the override.
  { name: 'AWS', slug: '__local:aws', color: 'FF9900' },
  { name: 'GCP', slug: 'googlecloud', color: '4285F4' },
  { name: 'Azure', slug: '__local:azure', color: '0078D4' },
  { name: 'Postgres', slug: 'postgresql', color: '4169E1' },
  { name: 'Redis', slug: 'redis', color: 'DC382D' },
  { name: 'Kafka', slug: 'apachekafka', color: '231F20' },
  { name: 'gRPC', slug: 'trpc', color: '2596BE' },
  { name: 'GraphQL', slug: 'graphql', color: 'E10098' },
  { name: 'Nginx', slug: 'nginx', color: '009639' },
  { name: 'Java', slug: 'openjdk', color: 'ED8B00' },
  { name: 'Go', slug: 'go', color: '00ADD8' },
  { name: 'Python', slug: 'python', color: '3776AB' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'Rust', slug: 'rust', color: 'CE412B' },
  { name: 'FastAPI', slug: 'fastapi', color: '009688' },
  { name: 'Next.js', slug: 'nextdotjs', color: '000000' },
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'Node.js', slug: 'nodedotjs', color: '5FA04E' },
  { name: 'Spring Boot', slug: 'springboot', color: '6DB33F' },
  { name: 'Datadog', slug: 'datadog', color: '632CA6' },
  { name: 'CI/CD', slug: 'githubactions', color: '2088FF' },
];

type Interest = {
  name: string;
  caption: string;
};

const INTERESTS: Interest[] = [
  { name: 'Competitive programming', caption: 'algorithm gymnastics on the weekend' },
  { name: 'Distributed systems', caption: 'event sourcing, CQRS, Kafka topologies' },
  { name: 'Graph theory', caption: 'shortest paths, max flows, MSTs' },
  { name: 'Number theory', caption: 'modular arithmetic, primality, lattices' },
  { name: 'Game infrastructure', caption: '200k CCU at Hypixel taught me a lot' },
  { name: 'Performance tuning', caption: 'p99 latency is where the truth lives' },
  { name: 'Compilers & languages', caption: 'i wrote a scripting language in C++' },
  { name: 'Open source', caption: '57 repos, 450+ stars, still going' },
  { name: 'Hackathons', caption: '48 hours, no sleep, a working product' },
];

/** Brand → tile index mapping for inline mentions in the bio paragraph. */
const BRAND_INDEX: Record<string, number> = {
  Lyra: 0,
  Hypixel: 1,
  Ceebs: 2,
  'Bathroom Superstore': 3,
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  /** Sticky-selected brand. Tiles, inline mentions, and the detail card all
   *  share this state. */
  const [activeBrand, setActiveBrand] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Mention = ({ name }: { name: string }) => {
    const idx = BRAND_INDEX[name];
    const isActive = activeBrand === idx;
    return (
      <span
        onMouseEnter={() => setActiveBrand(idx)}
        onFocus={() => setActiveBrand(idx)}
        tabIndex={0}
        className={`brand-mention ${isActive ? 'brand-mention--active' : ''}`}
      >
        {name}
      </span>
    );
  };

  return (
    <section
      id="about"
      ref={ref}
      className="section-frame relative w-full bg-parchment text-ink"
      style={{ paddingBlock: '120px' }}
    >
      <div className="container-page">
        <h2
          className={`reveal text-heading-lg-fluid max-w-[26ch] ${visible ? 'is-visible' : ''}`}
          style={{ transitionDelay: '60ms' }}
        >
          I&apos;m the engineer founders want in the room when the product has to actually work.
        </h2>

        {/* Side-by-side: bio paragraph on the left, logo tile grid on the
            right. The detail card sits below at full width so the company
            description has room to breathe. */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div
            className={`reveal lg:col-span-5 space-y-5 text-[16px] leading-[1.6] text-graphite ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            <p>
              I&apos;m a Forward Deployed Engineer at <Mention name="Lyra" />, embedded with founders and shipping product where it actually meets users. Outside of Lyra I&apos;m studying Advanced Computer Science (Honours) at Monash, specialising in algorithms and software.
            </p>
            <p>
              Before Lyra I was scaling Minecraft infrastructure at <Mention name="Hypixel" /> for 200k+ concurrent players, designing an event-sourced food-delivery platform at <Mention name="Ceebs" />, and running distributed inventory systems at <Mention name="Bathroom Superstore" />.
            </p>
          </div>

          <div
            className={`reveal lg:col-span-7 ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <LogoTileGrid active={activeBrand} onChange={setActiveBrand} />
          </div>
        </div>

        {/* Full-width detail card — describes the currently-active brand. */}
        <div
          className={`mt-6 reveal ${visible ? 'is-visible' : ''}`}
          style={{ transitionDelay: '260ms' }}
        >
          <LogoBrandDetail active={activeBrand} />
        </div>

        {/* Stack — bento icon grid */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h3 className={`text-heading-sm reveal ${visible ? 'is-visible' : ''}`}>
              Day-to-day toolbox
            </h3>
            <span className="text-[12px] uppercase tracking-[0.18em] text-graphite font-[540]">
              {TECH.length} tools
            </span>
          </div>
          <p
            className={`max-w-[64ch] text-[15px] text-graphite leading-[1.55] mb-6 reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '60ms' }}
          >
            The technologies I reach for first when designing, deploying, or breaking something.
          </p>
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {TECH.map((t, idx) => (
              <li
                key={t.name}
                className={`reveal ${visible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${100 + idx * 25}ms` }}
              >
                <TechTile tech={t} />
              </li>
            ))}
          </ul>
        </div>

        {/* Interests — typewriter cycler */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h3 className={`text-heading-sm reveal ${visible ? 'is-visible' : ''}`}>
              What I think about
            </h3>
            <span className="text-[12px] uppercase tracking-[0.18em] text-graphite font-[540]">
              Always learning
            </span>
          </div>
          <InterestCycler interests={INTERESTS} active={visible} />
        </div>
      </div>
    </section>
  );
}

function TechTile({ tech }: { tech: Tech }) {
  return (
    <div
      className="group relative bg-bone border border-fog rounded-[14px] aspect-square flex flex-col items-center justify-center gap-2 px-2 transition-all duration-200 hover:border-driftwood hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(20,12,38,0.06)] cursor-default overflow-hidden"
      title={tech.name}
    >
      {/* Subtle brand-color halo at the corner */}
      <div
        aria-hidden="true"
        className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-2xl"
        style={{ background: `#${tech.color}` }}
      />

      <div className="relative w-7 h-7 grayscale-[0.18] group-hover:grayscale-0 transition-all duration-200">
        <img
          src={
            tech.slug.startsWith('__local:')
              ? `/img/tech/${tech.slug.slice(8)}.svg`
              : `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`
          }
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
          loading="lazy"
          decoding="async"
          className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110"
        />
      </div>
      <span className="relative text-[11px] font-[540] tracking-[-0.005em] text-ink/80 text-center leading-tight">
        {tech.name}
      </span>
    </div>
  );
}

/**
 * Typewriter-style interest cycler. One interest is featured at a time,
 * with the name typing in letter-by-letter and the caption fading. Cycles
 * every ~3.5s. List of all interests sits to the side as muted text — the
 * current one lights up.
 */
function InterestCycler({
  interests,
  active,
}: {
  interests: Interest[];
  active: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing');
  const indexRef = useRef(index);
  const userPickedRef = useRef(false);

  // Sync ref so setInterval callbacks see latest
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Typewriter effect
  useEffect(() => {
    if (!active) return;
    const target = interests[index].name;
    let t: number;
    if (phase === 'typing') {
      if (typed.length < target.length) {
        t = window.setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 36);
      } else {
        t = window.setTimeout(() => setPhase('hold'), 1600);
      }
    } else if (phase === 'hold') {
      t = window.setTimeout(() => setPhase('erasing'), 0);
    } else {
      if (typed.length > 0) {
        t = window.setTimeout(() => setTyped(typed.slice(0, -1)), 18);
      } else {
        t = window.setTimeout(() => {
          setIndex((i) => (i + 1) % interests.length);
          setPhase('typing');
        }, 200);
      }
    }
    return () => window.clearTimeout(t);
  }, [typed, phase, index, interests, active]);

  // When user clicks an interest, jump to it (and pause auto-cycle briefly)
  const handlePick = (i: number) => {
    userPickedRef.current = true;
    setIndex(i);
    setTyped('');
    setPhase('typing');
  };

  const current = interests[index];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
      {/* Featured card — typewriter headline + caption */}
      <div className="md:col-span-7 card-lg min-h-[220px] relative overflow-hidden">
        <div className="text-[11px] uppercase tracking-[0.18em] text-iris font-[540]">
          Currently on my mind
        </div>
        <h4
          className="mt-4 text-heading tracking-[-0.022em] text-ink"
          style={{ minHeight: '1.2em' }}
        >
          {typed}
          <span
            className="inline-block w-[3px] h-[0.9em] align-text-bottom ml-0.5 bg-iris animate-pulse"
            aria-hidden="true"
          />
        </h4>
        <p
          className="mt-3 text-[15px] leading-[1.55] text-graphite max-w-[44ch] transition-opacity duration-300"
          style={{ opacity: phase === 'erasing' ? 0.4 : 1 }}
        >
          {current.caption}
        </p>

        {/* Decorative iris gradient */}
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(113,76,182,0.16), rgba(113,76,182,0) 70%)',
          }}
        />
      </div>

      {/* Compact list — click to jump */}
      <ul className="md:col-span-5 space-y-1">
        {interests.map((i, idx) => {
          const isActive = idx === index;
          return (
            <li key={i.name}>
              <button
                type="button"
                onClick={() => handlePick(idx)}
                className={`group flex items-center justify-between w-full text-left px-3 py-2 rounded-[8px] transition-colors duration-200 ${
                  isActive ? 'bg-bone' : 'hover:bg-bone/60'
                }`}
              >
                <span
                  className={`text-[14px] tracking-[-0.005em] transition-colors ${
                    isActive ? 'text-ink font-[540]' : 'text-graphite group-hover:text-ink'
                  }`}
                >
                  {i.name}
                </span>
                <span
                  className={`inline-block h-1.5 transition-all duration-200 rounded-full ${
                    isActive ? 'w-6 bg-iris' : 'w-1.5 bg-driftwood'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
