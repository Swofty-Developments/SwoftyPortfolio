/**
 * Modeled after superhuman.com's announcement banner:
 *   • Floating rounded card (16px radius), 64px tall, 12px inner padding
 *   • Aubergine fill with a decorative gradient overlay
 *   • Icon + 22px headline + outlined ghost CTA
 *   • Wrapped in a content-wrapper with 8px top / 32px side padding
 */
export default function AnnouncementBanner() {
  return (
    <section data-banner="true" className="relative z-[200] w-full">
      <div className="mx-auto w-full max-w-[1440px] px-8 pt-2">
        <a
          href="https://calendly.com/jacob-lyratechnologies/30min"
          target="_blank"
          rel="noreferrer"
          data-color-scheme="dark"
          className="
            relative flex h-16 w-full items-center justify-center gap-4
            overflow-hidden rounded-[16px] px-3 text-white no-underline
            transition-transform duration-200 hover:scale-[1.005]
          "
          style={{
            backgroundColor: 'var(--color-aubergine)',
            // Real Superhuman banner-bg.webp — the actual asset they ship.
            backgroundImage: 'url(/img/sh/banner-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
            letterSpacing: '-0.315px',
            lineHeight: '16.8px',
          }}
        >
          {/* Calendar icon tile — signals "book a call" */}
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
            style={{
              background: 'var(--color-aubergine-deep)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4c7ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="3" />
              <path d="M3 9.5h18" />
              <path d="M8 3v3M16 3v3" />
              <circle cx="8" cy="14" r="1.1" fill="#d4c7ff" stroke="none" />
              <circle cx="12" cy="14" r="1.1" fill="#d4c7ff" stroke="none" />
              <circle cx="16" cy="14" r="1.1" fill="#d4c7ff" stroke="none" />
            </svg>
          </span>

          {/* Headline — 22px / 460 weight (matches Superhuman's banner_text styling) */}
          <span
            className="text-[18px] md:text-[22px] font-[460] leading-tight tracking-[-0.014em] text-white text-center"
          >
            <span className="hidden sm:inline">Always open for a chat, hit me up!</span>
            <span className="sm:hidden">Always open for a chat — hit me up</span>
          </span>

          {/* Outlined ghost CTA — fills with white + flips text to aubergine on hover */}
          <span
            className="
              banner-cta ml-1 hidden sm:inline-flex items-center gap-1 rounded-[8px]
              border border-white/85 px-2 py-2 text-[14px] font-[500] text-white whitespace-nowrap
              transition-colors duration-200
            "
          >
            Book a call
            <svg
              width="16"
              height="12"
              viewBox="0 0 24 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8h18M14 1l7 7-7 7" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
