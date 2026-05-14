'use client';

import { useEffect, useRef } from 'react';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;       // 0 → 1 over total
  ttl: number;        // total lifetime in ms
  born: number;       // performance.now() at spawn
  // pull strength toward cursor: small = barely follows, big = magnetic
  pull: number;
};

export default function CursorDots({
  className,
  /** Probability of spawning a dot per qualifying mousemove (0–1). */
  density = 0.55,
  /** Minimum pixels between dot spawns. Prevents floods at high mouse speed. */
  spacing = 24,
}: {
  className?: string;
  density?: number;
  spacing?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dots: Dot[] = [];
    const cursor = { x: -9999, y: -9999, inside: false };
    let lastSpawn = { x: -9999, y: -9999 };
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      cursor.x = x;
      cursor.y = y;
      cursor.inside = inside;

      if (!inside) return;
      const dx = x - lastSpawn.x;
      const dy = y - lastSpawn.y;
      if (dx * dx + dy * dy < spacing * spacing) return;
      lastSpawn = { x, y };

      if (Math.random() > density) return;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.45;
      const ttl = 1100 + Math.random() * 1400;
      dots.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.05,
        r: 0.8 + Math.random() * 2.2,
        life: 0,
        ttl,
        born: performance.now(),
        pull: 0.0008 + Math.random() * 0.0022,
      });
    };

    const onLeave = () => {
      cursor.inside = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        const elapsed = now - d.born;
        d.life = elapsed / d.ttl;
        if (d.life >= 1) {
          dots.splice(i, 1);
          continue;
        }

        // gentle attraction to cursor (the "follows you a bit" feel)
        if (cursor.inside) {
          const dx = cursor.x - d.x;
          const dy = cursor.y - d.y;
          d.vx += dx * d.pull;
          d.vy += dy * d.pull;
        }

        // float upward + drag
        d.vy -= 0.0035;
        d.vx *= 0.985;
        d.vy *= 0.985;

        d.x += d.vx;
        d.y += d.vy;

        // fade out: ramp up quickly, hold, soft tail
        const a = d.life < 0.18
          ? d.life / 0.18
          : 1 - Math.pow((d.life - 0.18) / 0.82, 1.6);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * a})`;
        ctx.fill();

        // subtle halo
        if (d.r > 1.4) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.06 * a})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [density, spacing]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
