'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ContribDay = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE';
};

type Contributor = {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
};

type Repo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
  topics: string[];
  contributors?: Contributor[];
};

type GitHubData = {
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    avatarUrl: string;
    htmlUrl: string;
    createdAt: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    totalContributions: number;
    latestPush: string | null;
    topLanguages: { lang: string; count: number }[];
  };
  topRepos: Repo[];
  contributions: ContribDay[][];
};

const LANG_COLORS: Record<string, string> = {
  Java: '#b07219',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Ruby: '#701516',
  Vue: '#41b883',
  Solidity: '#AA6746',
  Daml: '#714cb6',
};

function relTime(iso: string | null): string {
  if (!iso) return '—';
  const d = Date.now() - new Date(iso).getTime();
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  if (dd < 30) return `${dd}d ago`;
  const mo = Math.floor(dd / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export default function OpenSourceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<GitHubData | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/github', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as GitHubData;
        if (cancelled) return;
        setData(json);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = window.setInterval(load, 300_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const featured = data?.topRepos[0] ?? null;
  const rest = data?.topRepos.slice(1, 6) ?? [];

  // Curated language weights — by personal expertise / where I spend time,
  // not just repo count. Repo count over-indexes Java because that's where
  // the open-source surface is; this list reflects what I'd actually write.
  const curatedLanguages = [
    { lang: 'Java', weight: 28 },
    { lang: 'C++', weight: 20 },
    { lang: 'Rust', weight: 16 },
    { lang: 'TypeScript', weight: 14 },
    { lang: 'Python', weight: 12 },
    { lang: 'Go', weight: 10 },
  ];
  const totalLangWeight = curatedLanguages.reduce((s, l) => s + l.weight, 0);

  return (
    <section
      id="open-source"
      ref={sectionRef}
      className="section-frame relative w-full bg-parchment text-ink"
      style={{ paddingBlock: '140px' }}
    >
      <div className="container-page">
        {/* Asymmetric hero: title on the left, heatmap on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className={`lg:col-span-5 reveal ${visible ? 'is-visible' : ''}`}>
            <h2 className="text-heading-lg-fluid">
              Built in the open<br />since <NumberCounter target={2020} from={2008} duration={1100} visible={visible} />.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[18px] leading-[1.5] text-ink">
              I&apos;m an open source advocate, and love giving back to the community.
            </p>

            <dl className="mt-9 grid grid-cols-3 gap-2 max-w-[440px]">
              <Metric value={data?.profile.publicRepos} label="Repos" visible={visible} />
              <Metric value={data?.stats.totalStars} label="Stars" visible={visible} />
              <Metric value={data?.profile.followers} label="Followers" visible={visible} />
            </dl>

            <a
              href={data?.profile.htmlUrl ?? 'https://github.com/Swofty-Developments'}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.286-.011-1.231-.016-2.234-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.755-1.333-1.755-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.776.42-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.527.116-3.182 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.655.242 2.879.118 3.182.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576C20.565 21.795 24 17.299 24 12c0-6.627-5.373-12-12-12Z" />
              </svg>
              github.com/{data?.profile.login ?? 'Swofty-Developments'}
            </a>
          </div>

          <div
            className={`lg:col-span-7 reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '160ms' }}
          >
            <ContributionHeatmap
              weeks={data?.contributions ?? []}
              total={data?.stats.totalContributions ?? 0}
              visible={visible}
            />
          </div>
        </div>

        {/* Featured repo */}
        {featured && (
          <div className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h3 className={`text-heading-sm reveal ${visible ? 'is-visible' : ''}`}>
                Most-starred project
              </h3>
              <span className="text-[12px] text-graphite">
                across {data?.profile.publicRepos ?? '—'} repos
              </span>
            </div>
            <FeaturedRepoCard repo={featured} visible={visible} />
          </div>
        )}

        {/* Language breakdown bar */}
        {data && (
          <div
            className={`mt-12 reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '180ms' }}
          >
            <div className="flex items-center justify-between text-[13px] text-graphite mb-3">
              <span>What I write</span>
              <span className="text-[11px] uppercase tracking-[0.16em]">
                across owned repos
              </span>
            </div>
            <LanguageBar
              languages={curatedLanguages}
              total={totalLangWeight}
            />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {curatedLanguages.map(({ lang, weight }) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-2 text-[13px] text-ink"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: LANG_COLORS[lang] ?? 'var(--color-iris)' }}
                  />
                  {lang}
                  <span className="text-graphite">
                    · {Math.round((weight / totalLangWeight) * 100)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other repos */}
        {rest.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h3 className={`text-heading-sm reveal ${visible ? 'is-visible' : ''}`}>
                Other things I&apos;ve shipped
              </h3>
              <span className="text-[12px] text-graphite">Sorted by stars</span>
            </div>
            <ul
              className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              style={{ perspective: '1400px' }}
            >
              {rest.map((repo, idx) => (
                <li
                  key={repo.name}
                  className={visible ? 'anim-flip-in' : 'opacity-0'}
                  style={{
                    animationDelay: visible ? `${idx * 110 + 80}ms` : undefined,
                  }}
                >
                  <RepoCard repo={repo} />
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  );
}

/**
 * Animated number counter — counts from `from` to `target` when first visible.
 * Used for the year in the hero ("Built in the open since 2020").
 */
function NumberCounter({
  target,
  from,
  duration,
  visible,
}: {
  target: number;
  from: number;
  duration: number;
  visible: boolean;
}) {
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, from, duration]);
  return (
    <span className="inline-block text-iris tabular-nums">{n}</span>
  );
}

function Metric({
  value,
  label,
}: {
  value: number | undefined;
  label: string;
  visible?: boolean;
}) {
  const hasValue = typeof value === 'number';
  return (
    <div className="border-l-2 border-fog pl-3">
      <div
        className="text-[26px] font-[600] tracking-[-0.022em] tabular-nums transition-opacity duration-500"
        style={{ opacity: hasValue ? 1 : 0.45 }}
      >
        {hasValue ? value.toLocaleString() : <span className="text-graphite">—</span>}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-graphite font-[540]">
        {label}
      </div>
    </div>
  );
}

function FeaturedRepoCard({
  repo,
  visible,
}: {
  repo: Repo;
  visible: boolean;
}) {
  const langColor = repo.language
    ? LANG_COLORS[repo.language] ?? 'var(--color-iris)'
    : 'var(--color-driftwood)';
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className={`mt-5 block card-lg group transition-colors hover:border-driftwood reveal ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: '40ms' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="text-graphite">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.493 2.493 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
            </svg>
            <h3 className="text-heading tracking-[-0.022em] group-hover:text-iris transition-colors">
              {repo.name}
            </h3>
          </div>
          <p className="mt-4 max-w-[64ch] text-[16px] leading-[1.55] text-graphite">
            {repo.description}
          </p>
          {repo.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-fog bg-parchment px-3 py-1 text-[12.5px] text-ink/80 font-[460]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {repo.contributors && repo.contributors.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <ContributorStack contributors={repo.contributors} size={36} max={10} />
              <span className="text-[12px] text-graphite">
                {repo.contributors.length} contributor{repo.contributors.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>

        <div className="md:col-span-4 md:border-l md:border-fog md:pl-8 grid grid-cols-3 md:grid-cols-1 gap-4">
          <BigStat
            value={repo.stars}
            label="Stars"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
            }
          />
          <BigStat
            value={repo.forks}
            label="Forks"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
            }
          />
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-graphite font-[540]">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: langColor }}
              />
              {repo.language ?? '—'}
            </div>
            <div className="mt-1.5 text-[14px] text-ink">
              Updated {relTime(repo.pushedAt)}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function LanguageBar({
  languages,
  total,
}: {
  languages: { lang: string; weight: number }[];
  total: number;
}) {
  const [hover, setHover] = useState<{
    lang: string;
    pct: number;
    x: number;
  } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative">
      {/* Hover hitbox row — taller than the visible bar (py-3) so the user can
          hover a few pixels above or below the bar and still trigger the
          tooltip. Inside, the colored segments are full-width but only 12px
          tall, centred vertically by flexbox. */}
      <div
        className="flex w-full py-3 cursor-default"
        onMouseLeave={() => setHover(null)}
      >
        <div className="flex h-[12px] w-full overflow-hidden rounded-full bg-fog">
          {languages.map(({ lang, weight }) => {
            const pct = Math.round((weight / total) * 100);
            return (
              <span
                key={lang}
                className="relative h-full transition-[filter,transform] duration-200"
                style={{
                  width: `${(weight / total) * 100}%`,
                  background: LANG_COLORS[lang] ?? 'var(--color-iris)',
                  filter:
                    hover && hover.lang === lang
                      ? 'brightness(1.15) saturate(1.2)'
                      : hover
                        ? 'brightness(0.85) saturate(0.7)'
                        : 'none',
                }}
                onMouseEnter={(e) => {
                  const wrapRect = wrapRef.current?.getBoundingClientRect();
                  const rect = (e.currentTarget as HTMLSpanElement).getBoundingClientRect();
                  if (!wrapRect) return;
                  setHover({
                    lang,
                    pct,
                    x: rect.left + rect.width / 2 - wrapRect.left,
                  });
                }}
              >
                {/* Invisible expanded hitbox: 24px tall (12 above + 12 below
                    the visible bar). Inherits parent's onMouseEnter. */}
                <span
                  className="absolute inset-x-0 -inset-y-3 block"
                  aria-hidden="true"
                />
              </span>
            );
          })}
        </div>
      </div>
      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-[8px] bg-ink text-bone px-2.5 py-1.5 text-[12px] font-[500] whitespace-nowrap"
          style={{ left: hover.x, top: -8 }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: LANG_COLORS[hover.lang] ?? 'var(--color-iris)' }}
            />
            {hover.lang}
            <span className="opacity-70">· {hover.pct}%</span>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-ink" />
        </div>
      )}
    </div>
  );
}

/**
 * Tooltip for the contribution heatmap, rendered via React Portal into
 * document.body so it escapes any ancestor `will-change`/`transform`/`filter`
 * containing block. (My `.reveal` class on a parent has `will-change: transform`
 * which makes plain `position: fixed` positioned relative to that ancestor
 * instead of the viewport.)
 */
function HeatmapTooltip({
  hover,
}: {
  hover: { screenX: number; screenY: number; day: ContribDay } | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !hover) return null;

  const halfW = 90;
  const vw = window.innerWidth;
  const left = Math.max(halfW + 8, Math.min(vw - halfW - 8, hover.screenX));
  const flipBelow = hover.screenY < 64;

  return createPortal(
    <div
      className={`pointer-events-none fixed z-[10000] rounded-[8px] bg-ink text-bone px-2.5 py-1.5 text-[12px] font-[500] -translate-x-1/2 whitespace-nowrap shadow-[0_8px_20px_rgba(20,12,38,0.18)] ${flipBelow ? 'translate-y-2' : '-translate-y-full'}`}
      style={{ left, top: flipBelow ? hover.screenY + 18 : hover.screenY - 6 }}
    >
      <div className="font-[600] tabular-nums">
        {hover.day.contributionCount}{' '}
        {hover.day.contributionCount === 1 ? 'contribution' : 'contributions'}
      </div>
      <div className="opacity-70">{hover.day.date}</div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-ink ${flipBelow ? '-top-1' : '-bottom-1'}`}
      />
    </div>,
    document.body
  );
}

function ContributorStack({
  contributors,
  size = 32,
  max = 8,
}: {
  contributors: Contributor[] | undefined;
  size?: number;
  max?: number;
}) {
  if (!contributors?.length) return null;
  const shown = contributors.slice(0, max);
  const rest = Math.max(0, contributors.length - max);
  return (
    <div className="inline-flex items-center">
      <div className="flex items-center">
        {shown.map((c, i) => (
          <span
            key={c.login}
            title={`${c.login} · ${c.contributions} commits`}
            className="relative inline-block rounded-full overflow-hidden ring-2 ring-bone bg-fog transition-transform duration-200 hover:z-10 hover:scale-110"
            style={{
              width: size,
              height: size,
              marginLeft: i === 0 ? 0 : -size * 0.32,
              zIndex: shown.length - i,
            }}
          >
            <img
              src={c.avatarUrl}
              alt={c.login}
              width={size}
              height={size}
              loading="lazy"
              decoding="async"
              className="block w-full h-full object-cover"
            />
          </span>
        ))}
      </div>
      {rest > 0 && (
        <span
          className="ml-1.5 inline-flex items-center justify-center rounded-full bg-fog text-ink text-[11px] font-[600] ring-2 ring-bone tabular-nums"
          style={{
            width: size,
            height: size,
            marginLeft: -size * 0.32 + 6,
            zIndex: 0,
          }}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

function BigStat({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-graphite font-[540]">
        <span className="text-graphite">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-[28px] font-[600] tracking-[-0.022em] tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const langColor = repo.language
    ? LANG_COLORS[repo.language] ?? 'var(--color-iris)'
    : 'var(--color-driftwood)';
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="card block h-full transition-colors hover:border-driftwood group"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-[600] tracking-[-0.014em] text-ink truncate group-hover:text-iris transition-colors">
          {repo.name}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] text-graphite shrink-0 tabular-nums">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {repo.stars}
        </span>
      </div>
      <p className="mt-2 text-[13.5px] leading-[1.5] text-graphite line-clamp-2 min-h-[2.4em]">
        {repo.description ?? <span className="opacity-60">No description.</span>}
      </p>
      {repo.contributors && repo.contributors.length > 0 && (
        <div className="mt-3">
          <ContributorStack contributors={repo.contributors} size={22} max={6} />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between text-[12px] text-graphite">
        <span className="inline-flex items-center gap-2">
          {repo.language && (
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: langColor }}
            />
          )}
          {repo.language ?? '—'}
        </span>
        <span>{relTime(repo.pushedAt)}</span>
      </div>
    </a>
  );
}

const LEVEL_INDEX: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function heatColor(level: number, intensity = 1): string {
  const palette = [
    [238, 234, 230], // 0 — fog
    [228, 217, 255], // 1 — lavender pale
    [184, 156, 240], // 2
    [133, 104, 208], // 3
    [91, 58, 166], // 4 — deep iris
  ];
  const [r, g, b] = palette[Math.min(4, Math.max(0, level))];
  if (intensity >= 1) return `rgb(${r}, ${g}, ${b})`;
  // Blend toward the parchment background as intensity drops below 1
  const base = [242, 240, 235];
  const mr = Math.round(base[0] + (r - base[0]) * intensity);
  const mg = Math.round(base[1] + (g - base[1]) * intensity);
  const mb = Math.round(base[2] + (b - base[2]) * intensity);
  return `rgb(${mr}, ${mg}, ${mb})`;
}

/**
 * Canvas-rendered contribution graph in the iris palette.
 *
 * The "wow" interaction: when the cursor is over the heatmap, an iris-tinted
 * spotlight follows it — cells inside the spotlight gain extra saturation
 * and lift, cells outside it sit at their natural intensity. Combined with
 * the reveal-on-scroll animation (cells fade in week-by-week) and a hover
 * tooltip showing the exact date and contribution count.
 */
function ContributionHeatmap({
  weeks,
  total,
  visible,
}: {
  weeks: ContribDay[][];
  total: number;
  visible: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Screen-relative coords for the tooltip — using fixed positioning so it
   * escapes the heatmap's overflow-x-auto scroll container and never clips. */
  const [hover, setHover] = useState<{
    screenX: number;
    screenY: number;
    day: ContribDay;
  } | null>(null);

  const CELL = 14;
  const GUTTER = 4;
  const WEEKS = 53;
  const DAYS = 7;
  const W = WEEKS * (CELL + GUTTER) - GUTTER;
  const H = DAYS * (CELL + GUTTER) - GUTTER;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let running = true;
    const startTime = performance.now();
    const REVEAL_MS = 1300;
    const SPOTLIGHT_R = 110;
    let mouse: { x: number; y: number; on: boolean } = { x: -1000, y: -1000, on: false };

    const paint = (now: number) => {
      if (!running) return;
      const t = Math.min(1, (now - startTime) / REVEAL_MS);
      ctx.clearRect(0, 0, W, H);

      const data = weeks.length ? weeks : Array.from({ length: WEEKS }, () =>
        Array.from({ length: DAYS }, () => null)
      );

      for (let w = 0; w < data.length; w++) {
        const weekT = Math.min(1, Math.max(0, (t - w / WEEKS) * 4));
        if (weekT <= 0) continue;
        const ease = 1 - Math.pow(1 - weekT, 3);

        const days = data[w];
        for (let d = 0; d < days.length; d++) {
          const day = days[d];
          const level = day ? LEVEL_INDEX[day.contributionLevel] ?? 0 : 0;
          const cx = w * (CELL + GUTTER);
          const cy = d * (CELL + GUTTER);

          // Cursor spotlight: cells near the cursor get a boost — only when
          // the reveal is mostly done so we don't fight the entrance.
          let boost = 0;
          if (mouse.on && t > 0.85) {
            const dx = mouse.x - (cx + CELL / 2);
            const dy = mouse.y - (cy + CELL / 2);
            const r = Math.sqrt(dx * dx + dy * dy);
            if (r < SPOTLIGHT_R) {
              const k = 1 - r / SPOTLIGHT_R;
              boost = k * k * 0.4;
            }
          }

          ctx.globalAlpha = ease;
          ctx.fillStyle = heatColor(level, 1);
          roundRect(ctx, cx, cy, CELL, CELL, 3);
          ctx.fill();

          // Iris bloom for active cells in the spotlight
          if (boost > 0 && level > 0) {
            ctx.globalAlpha = ease * boost;
            ctx.fillStyle = '#714cb6';
            roundRect(ctx, cx, cy, CELL, CELL, 3);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        on: true,
      };
    };
    const onLeave = () => {
      mouse = { ...mouse, on: false };
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(paint);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [weeks, W, H, visible]);

  // Once the data lands, snap the horizontal scroller to the most recent
  // week (right edge) so the default view is "now", not "12 months ago".
  useEffect(() => {
    const s = scrollerRef.current;
    if (!s || !weeks.length) return;
    // Defer to next paint so layout has settled and scrollWidth is correct.
    requestAnimationFrame(() => {
      s.scrollTo({ left: s.scrollWidth, behavior: 'instant' as ScrollBehavior });
    });
  }, [weeks.length]);

  // Native (non-React) tooltip listener — bypasses any synthetic-event
  // weirdness that browser extensions or hydration mismatches can introduce.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      if (!weeks.length) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = Math.floor(x / (CELL + GUTTER));
      const d = Math.floor(y / (CELL + GUTTER));
      if (w < 0 || w >= weeks.length || d < 0 || d >= 7) {
        setHover(null);
        return;
      }
      const day = weeks[w]?.[d];
      if (!day) {
        setHover(null);
        return;
      }
      setHover({
        screenX: e.clientX,
        screenY: rect.top + d * (CELL + GUTTER),
        day,
      });
    };
    const onLeave = () => setHover(null);

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [weeks, CELL, GUTTER]);

  return (
    <div ref={wrapRef} className="card-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] text-graphite uppercase tracking-[0.18em] font-[540]">
            Last 12 months
          </div>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span className="text-[40px] font-[600] tracking-[-0.022em] tabular-nums">
              {total.toLocaleString()}
            </span>
            <span className="text-[14px] text-graphite">contributions</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.18em] text-graphite font-[540]">
            Streak hint
          </div>
          <div className="mt-1 text-[14px] text-ink">Hover the grid</div>
        </div>
      </div>

      <div ref={scrollerRef} className="heatmap-scroll mt-6 -mx-1 overflow-x-auto px-1 pb-2">
        <div className="relative inline-block" style={{ minWidth: W }}>
          <canvas
            ref={canvasRef}
            className="block"
            style={{ cursor: 'crosshair' }}
            aria-label="GitHub contribution heatmap"
          />
          {/* Tooltip lives at the section's top-level layer using fixed
              positioning so it never clips against the scroller's overflow. */}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-[11px] text-graphite tracking-[-0.005em]">
        <span>Less</span>
        <span className="inline-flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="inline-block w-[10px] h-[10px] rounded-[2px]"
              style={{ background: heatColor(i, 1) }}
            />
          ))}
        </span>
        <span>More</span>
      </div>

      <HeatmapTooltip hover={hover} />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
