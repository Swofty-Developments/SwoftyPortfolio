/**
 * Horizontal hatched rule — matches the page-rails diagonal stripe pattern
 * but used as a slim accent between sections. Same -45deg pattern at 1px /
 * 7px spacing, ink @ 34% alpha.
 */
export default function HatchedRule({
  height = 22,
  className = '',
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${className}`}
      style={{
        height,
        backgroundImage:
          'repeating-linear-gradient(-45deg, rgba(115, 113, 109, 0.34) 0px, rgba(115, 113, 109, 0.34) 1px, transparent 1px, transparent 7px)',
        borderTop: '1px solid rgba(115, 113, 109, 0.22)',
        borderBottom: '1px solid rgba(115, 113, 109, 0.22)',
      }}
    />
  );
}
