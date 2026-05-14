/**
 * Decorative section divider using Superhuman's "tonal-flower" graphic.
 * Full-bleed inside the parchment card, used as a visual break between
 * content sections. The image is a soft pink-violet gradient flower on
 * parchment, so it blends seamlessly with the surrounding canvas.
 */
export default function SectionDivider({
  flip = false,
  className = '',
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      style={{ height: 'clamp(120px, 22vw, 320px)' }}
    >
      <img
        src="/img/sh/tonal-flower.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: flip ? 'scaleX(-1)' : undefined,
          // Blend the edges into parchment so the image doesn't sit on the
          // page like a sticker. The webp itself is parchment-toned at the
          // edges; this mask softens any remaining seam.
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 18%, #000 82%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 18%, #000 82%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  );
}
