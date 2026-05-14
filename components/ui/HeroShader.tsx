'use client';

import { useEffect, useRef } from 'react';

/**
 * WebGL2 fragment-shader background for the hero. Renders an animated
 * curl-noise flow field tinted in the Superhuman palette (iris, lavender,
 * pink-magenta, deep aubergine night).
 *
 * Mouse coordinates are passed in as a uniform; the shader warps the field
 * around the cursor for a soft "aurora bending around you" feel.
 *
 * Falls back silently to nothing (the underlying <video> still plays) if
 * WebGL2 is unavailable, or if the user has prefers-reduced-motion.
 */
export default function HeroShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mql.matches) return;
    }

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    }) as WebGL2RenderingContext | null;
    if (!gl) return;

    const vert = /* glsl */ `#version 300 es
      in vec2 a_pos;
      out vec2 v_uv;
      void main() {
        v_uv = (a_pos + 1.0) * 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    // Curl-noise auroral flow field. The output is alpha-premultiplied; the
    // canvas sits over the video with mix-blend-mode: screen.
    const frag = /* glsl */ `#version 300 es
      precision highp float;

      in vec2 v_uv;
      out vec4 outColor;

      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;        // 0..1 (or <0 when outside)
      uniform float u_mouseStrength; // 0..1 — interpolates toward mouse pos

      // Simplex noise (Ashima Arts). Compact, fast, public domain.
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x  = 2.0 * fract(p * C.www) - 1.0;
        vec3 h  = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * snoise(p);
          p *= 2.07;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_res.x / u_res.y;

        float t = u_time * 0.06;

        // Cursor warp — pull the field gently toward the cursor when present.
        vec2 mouse = u_mouse * 2.0 - 1.0;
        mouse.x *= u_res.x / u_res.y;
        vec2 toMouse = mouse - p;
        float md = length(toMouse) + 0.001;
        vec2 warp = (toMouse / md) * exp(-md * 1.4) * 0.42 * u_mouseStrength;
        p += warp;

        // Two layered flow octaves
        vec2 q;
        q.x = fbm(p * 1.1 + vec2(t, -t * 0.7));
        q.y = fbm(p * 1.1 + vec2(-t * 0.5, t * 0.9) + 5.2);

        float n = fbm(p * 1.6 + q * 1.4 + vec2(t * 0.8, t));

        // Palette stops — Superhuman colours, baked in.
        vec3 deepNight  = vec3(0.115, 0.075, 0.150);  // aubergine night
        vec3 iris       = vec3(0.443, 0.298, 0.713);  // #714cb6
        vec3 lavender   = vec3(0.831, 0.780, 1.000);  // #d4c7ff
        vec3 magenta    = vec3(0.690, 0.439, 0.752);  // soft magenta
        vec3 cyan       = vec3(0.408, 0.871, 1.000);  // hint of dawn cyan

        float m = smoothstep(-0.6, 1.0, n);
        vec3 col = mix(deepNight, iris, smoothstep(0.05, 0.55, m));
        col = mix(col, magenta, smoothstep(0.45, 0.85, m));
        col = mix(col, lavender, smoothstep(0.7, 1.0, m));
        col += cyan * smoothstep(0.92, 1.0, m) * 0.4;

        // Soft halo around the cursor — feels like the aurora collects there.
        float halo = exp(-md * 2.6) * 0.55 * u_mouseStrength;
        col += halo * lavender;

        // Vignette toward edges + bottom (so it composites nicely with the
        // parchment fade and the floating panels).
        float vig = smoothstep(1.45, 0.25, length(p * vec2(0.78, 1.05)));
        float bottomFade = smoothstep(1.05, 0.55, uv.y);
        float a = vig * mix(0.42, 0.85, m) * bottomFade;

        // Premultiplied alpha output (screen blend in CSS).
        outColor = vec4(col * a, a);
      }
    `;

    const compile = (src: string, type: number) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('hero-shader compile failed:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(vert, gl.VERTEX_SHADER);
    const fs = compile(frag, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('hero-shader link failed:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle pair
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uMouseStrength = gl.getUniformLocation(prog, 'u_mouseStrength');

    let dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: 0.5, y: 0.45, strength: 0, target: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        mouse.target = 0;
        return;
      }
      mouse.x = x;
      mouse.y = 1.0 - y; // shader y is flipped
      mouse.target = 1.0;
    };
    const onLeave = () => {
      mouse.target = 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    let raf = 0;
    let running = true;
    let lastT = performance.now();
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(33, now - lastT) / 1000;
      lastT = now;
      mouse.strength += (mouse.target - mouse.strength) * Math.min(1, dt * 4);

      if (visible && !document.hidden) {
        gl.uniform1f(uTime, now * 0.001);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uMouseStrength, mouse.strength);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
