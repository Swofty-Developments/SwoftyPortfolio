'use client';

import { useState } from 'react';

type Brand = {
  name: string;
  logo: string | 'lyra-circle';
  bg: string;
  period: string;
  role: string;
  about: string;
  url: string;
  logoBlend?: 'multiply' | 'screen';
};

const BRANDS: Brand[] = [
  {
    name: 'Lyra',
    logo: 'lyra-circle',
    bg: '#0f0f1d',
    period: '2026 — Now',
    role: 'Forward Deployed Engineer',
    about:
      "Lyra is an Australian engineering studio that pairs FDEs with Silicon-Valley founders. I'm embedded with product teams shipping production software end-to-end — in the room, in the codebase.",
    url: 'https://lyratechnologies.com.au',
  },
  {
    name: 'Hypixel',
    logo: '/img/brands/hypixel.png',
    bg: 'linear-gradient(135deg, #fff4d1 0%, #ffe9a3 100%)',
    period: '2023 — 2024',
    role: 'Software Engineer',
    about:
      'Hypixel runs the largest Minecraft network in the world (200k+ concurrent players). I joined the DevOps team and tuned CI/CD, observability, and deployment pipelines across Kubernetes, Prometheus, and Grafana.',
    url: 'https://hypixel.net',
  },
  {
    name: 'Ceebs',
    logo: '/img/brands/ceebs.png',
    bg: 'linear-gradient(135deg, #ffe2c8 0%, #ffd0a8 100%)',
    period: '2025',
    role: 'Software Engineer',
    about:
      'Ceebs is a food-delivery platform for Monash University students. I refactored the monolith into microservices with an event-sourced CQRS architecture — Kafka as event store, Postgres for read projections, Redis for geospatial.',
    url: 'https://ceebs.site',
  },
  {
    name: 'Bathroom Superstore',
    logo: '/img/brands/bathroom-superstore.png',
    // Soft pastel blue — light enough to read as a "bathroom tile" tint.
    bg: 'linear-gradient(135deg, #bedcef 0%, #d6e9f4 100%)',
    logoBlend: 'multiply',
    period: '2024 — Now',
    role: 'Software Engineer',
    about:
      'Bathroom Superstore is an Australian retailer with thousands of SKUs and tens of thousands of monthly requests. I designed and maintain their distributed inventory systems, orchestrated with Docker and observed via Datadog.',
    url: 'https://bathroomsuperstore.com.au',
  },
];

/**
 * Compact tile grid + detail strip. Exported as two pieces so the parent
 * layout can put the tiles in a narrow column and have the detail card span
 * the full width of the section below it. The `active` index is lifted to
 * the parent (or held locally if no props passed).
 */

export function LogoTileGrid({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h3 className="text-heading-sm">Where I&apos;ve shipped things</h3>
        <span className="text-[12px] uppercase tracking-[0.18em] text-graphite font-[540]">
          Four teams · since 2023
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {BRANDS.map((b, i) => (
          <li
            key={b.name}
            onMouseEnter={() => onChange(i)}
            onFocus={() => onChange(i)}
            tabIndex={0}
            className="outline-none"
          >
            <BrandTile brand={b} active={active === i} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoBrandDetail({ active }: { active: number }) {
  const brand = BRANDS[active] ?? BRANDS[0];
  return <BrandDetail brand={brand} />;
}

/** Convenience export for places that want the whole thing managed internally. */
export default function LogoBar() {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full">
      <LogoTileGrid active={active} onChange={setActive} />
      <div className="mt-4">
        <LogoBrandDetail active={active} />
      </div>
    </div>
  );
}

function BrandTile({ brand, active }: { brand: Brand; active: boolean }) {
  return (
    <div
      className={`relative h-[110px] rounded-[14px] overflow-hidden border transition-all duration-300 cursor-default ${
        active
          ? 'border-ink/40 -translate-y-[2px] shadow-[0_8px_20px_rgba(20,12,38,0.10)]'
          : 'border-driftwood/40 hover:border-driftwood'
      }`}
      style={{ background: brand.bg }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-5">
        {brand.logo === 'lyra-circle' ? (
          <LyraCircle size={68} active={active} />
        ) : (
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-[60%] max-w-[80%] object-contain transition-transform duration-300"
            style={{
              transform: active ? 'scale(1.04)' : 'scale(1)',
              filter: active ? 'none' : 'saturate(0.94)',
              mixBlendMode: brand.logoBlend,
            }}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-1 -right-1 w-10 h-10 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, rgba(115,113,109,0.30) 0, rgba(115,113,109,0.30) 1px, transparent 1px, transparent 6px)',
          maskImage: 'linear-gradient(225deg, #000 0%, #000 40%, transparent 80%)',
          WebkitMaskImage:
            'linear-gradient(225deg, #000 0%, #000 40%, transparent 80%)',
        }}
      />
    </div>
  );
}

function LyraCircle({ size, active }: { size: number; active: boolean }) {
  return (
    <div
      aria-label="Lyra"
      role="img"
      className="rounded-full transition-transform duration-300"
      style={{
        width: size,
        height: size,
        transform: active ? 'scale(1.06)' : 'scale(1)',
        background: `
          radial-gradient(circle at 28% 32%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 30%),
          radial-gradient(circle at 30% 50%, #8061ff 0%, #6F4AFF 22%, #4D56FF 55%, #2963FF 100%)
        `,
        boxShadow:
          'inset 0 -3px 8px rgba(0,0,0,0.35), 0 6px 18px rgba(111,74,255,0.35)',
      }}
    />
  );
}

function BrandDetail({ brand }: { brand: Brand }) {
  return (
    <div className="card relative overflow-hidden" key={brand.name}>
      <div className="anim-fade-up">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[18px] font-[600] tracking-[-0.014em] text-ink">
            {brand.role}
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-graphite font-[540]">
            · {brand.period}
          </span>
        </div>
        <p className="mt-3 text-[14.5px] leading-[1.55] text-graphite max-w-[68ch]">
          {brand.about}
        </p>
        <a
          href={brand.url}
          target="_blank"
          rel="noreferrer"
          className="link-iris mt-4 inline-flex items-center gap-1.5 text-[13px]"
        >
          Visit {brand.name}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </a>
      </div>
    </div>
  );
}
