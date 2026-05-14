import { NextResponse } from 'next/server';

/**
 * Single batched GitHub endpoint — returns profile + top repos + 1y of
 * contribution counts. We cache each upstream fetch for 5 min via Next's
 * fetch cache so the section feels "live" but we don't get rate-limited.
 *
 * The contribution data is sourced from github-contributions-api.deno.dev
 * which scrapes GitHub's public contribution SVG (no auth needed).
 */

const USER = 'Swofty-Developments';
const REVALIDATE_SECONDS = 300;
const CACHE_TTL_MS = REVALIDATE_SECONDS * 1000;

export const revalidate = 300;

/** Module-level in-memory cache so dev/HMR reloads don't re-hit GitHub. */
type CachedPayload = {
  payload: Record<string, unknown>;
  expiresAt: number;
};
let memCache: CachedPayload | null = null;

/** Known-good fallback values used when GitHub rate-limits the
 *  unauthenticated endpoint. Updated periodically by hand. */
const FALLBACK = {
  profile: {
    login: USER,
    name: 'Jacob Nardella (Swofty)',
    bio: 'FDE @ Lyra',
    publicRepos: 57,
    followers: 110,
    following: 9,
    avatarUrl: `https://github.com/${USER}.png`,
    htmlUrl: `https://github.com/${USER}`,
    createdAt: '2020-12-12T06:33:05Z',
  },
  stats: {
    totalStars: 450,
    totalForks: 103,
    totalContributions: 0,
    latestPush: null as string | null,
    topLanguages: [] as { lang: string; count: number }[],
  },
  // Real contributor lists baked in — these are the actual people from each
  // repo as of the last refresh. Hardcoded so they're available even when
  // GitHub rate-limits the unauthenticated /contributors endpoint.
  topRepos: [
    {
      name: 'HypixelSkyBlock',
      url: `https://github.com/${USER}/HypixelSkyBlock`,
      description:
        'Minecraft 1.21.11 (no Spigot) recreation of Hypixel SkyBlock with a goal of a properly abstracted and scalable codebase.',
      language: 'Java',
      stars: 255,
      forks: 78,
      pushedAt: new Date().toISOString(),
      topics: ['hypixel', 'hypixel-skyblock', 'minestom', 'minestom-server'],
      contributors: [
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 1085 },
        { login: 'ArikSquad', avatarUrl: 'https://avatars.githubusercontent.com/u/75741608?v=4', htmlUrl: 'https://github.com/ArikSquad', contributions: 441 },
        { login: 'ItzKatze', avatarUrl: 'https://avatars.githubusercontent.com/u/136186750?v=4', htmlUrl: 'https://github.com/ItzKatze', contributions: 329 },
        { login: 'KingGamerXd', avatarUrl: 'https://avatars.githubusercontent.com/u/122584180?v=4', htmlUrl: 'https://github.com/KingGamerXd', contributions: 132 },
        { login: 'aunncodes', avatarUrl: 'https://avatars.githubusercontent.com/u/63682429?v=4', htmlUrl: 'https://github.com/aunncodes', contributions: 48 },
        { login: 'Epicportal14', avatarUrl: 'https://avatars.githubusercontent.com/u/94915090?v=4', htmlUrl: 'https://github.com/Epicportal14', contributions: 46 },
        { login: 'TreesOnTop', avatarUrl: 'https://avatars.githubusercontent.com/u/85085371?v=4', htmlUrl: 'https://github.com/TreesOnTop', contributions: 40 },
        { login: 'Maploop', avatarUrl: 'https://avatars.githubusercontent.com/u/76199586?v=4', htmlUrl: 'https://github.com/Maploop', contributions: 26 },
        { login: 'FreakyFreakyNerd', avatarUrl: 'https://avatars.githubusercontent.com/u/20784037?v=4', htmlUrl: 'https://github.com/FreakyFreakyNerd', contributions: 24 },
        { login: 'CodeSyntaxCreator', avatarUrl: 'https://avatars.githubusercontent.com/u/140944489?v=4', htmlUrl: 'https://github.com/CodeSyntaxCreator', contributions: 20 },
        { login: 'petethepossum', avatarUrl: 'https://avatars.githubusercontent.com/u/47347759?v=4', htmlUrl: 'https://github.com/petethepossum', contributions: 18 },
        { login: 'Arisamiga', avatarUrl: 'https://avatars.githubusercontent.com/u/64918822?v=4', htmlUrl: 'https://github.com/Arisamiga', contributions: 15 },
        { login: 'Ghosty920', avatarUrl: 'https://avatars.githubusercontent.com/u/37075355?v=4', htmlUrl: 'https://github.com/Ghosty920', contributions: 10 },
      ],
    },
    {
      name: 'Continued-Slime-World-Manager',
      url: `https://github.com/${USER}/Continued-Slime-World-Manager`,
      description:
        'Maintained and updated 1.8 variant of SlimeWorldManager utilizing the Slime format made by @HypixelDev.',
      language: 'Java',
      stars: 38,
      forks: 12,
      pushedAt: new Date(Date.now() - 365 * 86400000).toISOString(),
      topics: [],
      contributors: [
        { login: 'cijaaimee', avatarUrl: 'https://avatars.githubusercontent.com/u/8948346?v=4', htmlUrl: 'https://github.com/cijaaimee', contributions: 334 },
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 47 },
        { login: 'TehNeon', avatarUrl: 'https://avatars.githubusercontent.com/u/3179302?v=4', htmlUrl: 'https://github.com/TehNeon', contributions: 3 },
        { login: 'HeyZeer0', avatarUrl: 'https://avatars.githubusercontent.com/u/21368488?v=4', htmlUrl: 'https://github.com/HeyZeer0', contributions: 3 },
        { login: 'Gerolmed', avatarUrl: 'https://avatars.githubusercontent.com/u/19486712?v=4', htmlUrl: 'https://github.com/Gerolmed', contributions: 2 },
        { login: 'Andre601', avatarUrl: 'https://avatars.githubusercontent.com/u/11576465?v=4', htmlUrl: 'https://github.com/Andre601', contributions: 1 },
        { login: 'brandonwamboldt', avatarUrl: 'https://avatars.githubusercontent.com/u/629141?v=4', htmlUrl: 'https://github.com/brandonwamboldt', contributions: 1 },
        { login: 'Hugome', avatarUrl: 'https://avatars.githubusercontent.com/u/1301995?v=4', htmlUrl: 'https://github.com/Hugome', contributions: 1 },
        { login: 'Brikster', avatarUrl: 'https://avatars.githubusercontent.com/u/11031798?v=4', htmlUrl: 'https://github.com/Brikster', contributions: 1 },
        { login: 'yannicklamprecht', avatarUrl: 'https://avatars.githubusercontent.com/u/1420893?v=4', htmlUrl: 'https://github.com/yannicklamprecht', contributions: 1 },
        { login: 'iamceph', avatarUrl: 'https://avatars.githubusercontent.com/u/4377405?v=4', htmlUrl: 'https://github.com/iamceph', contributions: 1 },
        { login: 'riku6460', avatarUrl: 'https://avatars.githubusercontent.com/u/17585784?v=4', htmlUrl: 'https://github.com/riku6460', contributions: 1 },
      ],
    },
    {
      name: 'AtlasRedisAPI',
      url: `https://github.com/${USER}/AtlasRedisAPI`,
      description:
        'Blazingly fast multi-purpose Redis API based on Jedis. Used and maintained by Atlas Network.',
      language: 'Java',
      stars: 17,
      forks: 4,
      pushedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      topics: [],
      contributors: [
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 29 },
        { login: 'sinender', avatarUrl: 'https://avatars.githubusercontent.com/u/65603613?v=4', htmlUrl: 'https://github.com/sinender', contributions: 5 },
        { login: 'ArikSquad', avatarUrl: 'https://avatars.githubusercontent.com/u/75741608?v=4', htmlUrl: 'https://github.com/ArikSquad', contributions: 4 },
        { login: 'Maploop', avatarUrl: 'https://avatars.githubusercontent.com/u/76199586?v=4', htmlUrl: 'https://github.com/Maploop', contributions: 2 },
        { login: 'Neruxov', avatarUrl: 'https://avatars.githubusercontent.com/u/74096901?v=4', htmlUrl: 'https://github.com/Neruxov', contributions: 1 },
      ],
    },
    {
      name: 'SwoftLang',
      url: `https://github.com/${USER}/SwoftLang`,
      description:
        'A blazingly fast scripting language written in C++ for creating Minecraft servers without Spigot.',
      language: 'C++',
      stars: 11,
      forks: 1,
      pushedAt: new Date(Date.now() - 330 * 86400000).toISOString(),
      topics: [],
      contributors: [
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 6 },
      ],
    },
    {
      name: 'SwoftyPortfolio',
      url: `https://github.com/${USER}/SwoftyPortfolio`,
      description: 'My personal portfolio website as found on https://swofty.net — Made with React.',
      language: 'TypeScript',
      stars: 10,
      forks: 2,
      pushedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      topics: [],
      contributors: [
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 17 },
      ],
    },
    {
      name: 'CodeForge',
      url: `https://github.com/${USER}/CodeForge`,
      description:
        'An AI code editor that wraps Claude Code and Codex into a native desktop app with multi-thread sessions, an embedded browser, and a sleek dark UI.',
      language: 'Rust',
      stars: 9,
      forks: 1,
      pushedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      topics: [],
      contributors: [
        { login: 'Swofty-Developments', avatarUrl: 'https://avatars.githubusercontent.com/u/75875764?v=4', htmlUrl: 'https://github.com/Swofty-Developments', contributions: 84 },
      ],
    },
  ],
};

/** Cache that ONLY ever holds a healthy response. Once filled, it stays
 *  filled across rate-limit failures so we never regress to empty data. */
let lastGood: CachedPayload | null = null;

type Profile = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  created_at: string;
};

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
};

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

export async function GET() {
  // Serve from in-memory cache if still fresh — never hits GitHub more than
  // once per CACHE_TTL_MS regardless of how many tabs / dev reloads happen.
  if (memCache && memCache.expiresAt > Date.now()) {
    return NextResponse.json(memCache.payload, {
      headers: {
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600`,
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const [profile, repos, contribJson] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: REVALIDATE_SECONDS },
      }).then((r) => r.json() as Promise<Profile>),

      fetch(
        `https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          next: { revalidate: REVALIDATE_SECONDS },
        }
      ).then((r) => r.json() as Promise<Repo[]>),

      fetch(`https://github-contributions-api.deno.dev/${USER}.json`, {
        next: { revalidate: 3600 },
      }).then((r) => r.json()),
    ]);

    // Top repos: filter out forks/archived, sort by stars desc, take 6.
    const topReposBase = (Array.isArray(repos) ? repos : [])
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Fetch up to 16 contributors per top repo in parallel. Skip any failures.
    type Contributor = {
      login: string;
      avatar_url: string;
      html_url: string;
      contributions: number;
      type: string;
    };
    const contributorLists = await Promise.all(
      topReposBase.map((r) =>
        fetch(
          `https://api.github.com/repos/${r.full_name}/contributors?per_page=16`,
          {
            headers: { Accept: 'application/vnd.github+json' },
            next: { revalidate: REVALIDATE_SECONDS },
          }
        )
          .then((r) => r.json() as Promise<Contributor[]>)
          .then((arr) => (Array.isArray(arr) ? arr : []))
          .catch(() => [])
      )
    );

    const topRepos = topReposBase.map((r, i) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
      topics: r.topics?.slice(0, 4) ?? [],
      contributors: contributorLists[i]
        .filter((c) => c.type === 'User')
        .map((c) => ({
          login: c.login,
          avatarUrl: c.avatar_url,
          htmlUrl: c.html_url,
          contributions: c.contributions,
        })),
    }));

    // Aggregate stats across all repos
    const ownedRepos = (Array.isArray(repos) ? repos : []).filter(
      (r) => !r.fork
    );
    const totalStars = ownedRepos.reduce(
      (sum, r) => sum + r.stargazers_count,
      0
    );
    const totalForks = ownedRepos.reduce((sum, r) => sum + r.forks_count, 0);
    const langCounts: Record<string, number> = {};
    for (const r of ownedRepos) {
      if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1;
    }
    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    // Flatten contribution weeks (53 weeks × 7 days each)
    const weeks: ContribDay[][] = contribJson?.contributions ?? [];
    const totalContributions: number = contribJson?.totalContributions ?? 0;

    const latestPush = ownedRepos
      .map((r) => r.pushed_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

    // If GitHub rate-limited the profile endpoint, profile will be a
    // {message: 'API rate limit exceeded', ...} object with no
    // `public_repos`. Fall back to known-good values in that case so the
    // page never shows blanks/zeros.
    const profileOk = typeof profile?.public_repos === 'number';
    const reposOk = Array.isArray(repos) && repos.length > 0;

    // Bad upstream — DON'T cache. Serve lastGood (any prior healthy response)
    // or the hardcoded FALLBACK so the page never regresses.
    if (!profileOk || !reposOk) {
      if (lastGood) {
        return NextResponse.json(lastGood.payload, {
          headers: {
            'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600`,
            'X-Cache': 'LAST-GOOD',
            'X-Reason': !profileOk ? 'profile-rate-limited' : 'repos-rate-limited',
          },
        });
      }
      const fallbackPayload = {
        profile: FALLBACK.profile,
        stats: { ...FALLBACK.stats, totalContributions },
        topRepos: FALLBACK.topRepos,
        contributions: weeks,
      };
      return NextResponse.json(fallbackPayload, {
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600`,
          'X-Cache': 'FALLBACK',
        },
      });
    }

    // If individual repo contributor lists are empty (rate-limited per-repo),
    // backfill them from FALLBACK by repo name so avatars still appear.
    const fallbackByName = new Map(FALLBACK.topRepos.map((r) => [r.name, r]));
    const topReposPatched = topRepos.map((r) => {
      if (r.contributors && r.contributors.length > 0) return r;
      const fb = fallbackByName.get(r.name);
      return fb ? { ...r, contributors: fb.contributors } : r;
    });

    const payload = {
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        avatarUrl: profile.avatar_url,
        htmlUrl: profile.html_url,
        createdAt: profile.created_at,
      },
      stats: {
        totalStars,
        totalForks,
        totalContributions,
        latestPush,
        topLanguages,
      },
      topRepos: topReposPatched,
      contributions: weeks,
    };

    // Healthy response — update BOTH caches. memCache for short revalidate,
    // lastGood for permanent fallback once we've ever seen good data.
    const now = Date.now();
    memCache = { payload, expiresAt: now + CACHE_TTL_MS };
    lastGood = { payload, expiresAt: Number.MAX_SAFE_INTEGER };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600`,
        'X-Cache': 'MISS',
      },
    });
  } catch (err) {
    // Exception: lastGood → memCache → hardcoded fallback
    if (lastGood) {
      return NextResponse.json(lastGood.payload, {
        headers: { 'X-Cache': 'EXCEPTION-GOOD', 'X-Error': String(err) },
      });
    }
    if (memCache) {
      return NextResponse.json(memCache.payload, {
        headers: { 'X-Cache': 'EXCEPTION-STALE', 'X-Error': String(err) },
      });
    }
    return NextResponse.json(
      {
        profile: FALLBACK.profile,
        stats: FALLBACK.stats,
        topRepos: FALLBACK.topRepos,
        contributions: [],
      },
      { status: 200, headers: { 'X-Cache': 'FALLBACK', 'X-Error': String(err) } }
    );
  }
}
