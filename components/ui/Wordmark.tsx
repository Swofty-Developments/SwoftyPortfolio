/**
 * Clean Swofty wordmark — a tight, custom-set typographic mark.
 * Used in NavBar, Footer, AnnouncementBanner. No bitmap, no busted glyph tile.
 */
export default function Wordmark({
  size = 18,
  color = 'currentColor',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-baseline gap-[1px] select-none"
      style={{
        color,
        fontSize: `${size}px`,
        fontWeight: 700,
        letterSpacing: '-0.045em',
        lineHeight: 1,
      }}
      aria-label="Swofty"
    >
      <span>swofty</span>
      <span style={{ color: '#714cb6', fontWeight: 700 }}>.</span>
    </span>
  );
}
