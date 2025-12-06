'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { Application } from '@splinetool/runtime';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-violet-950/30 via-black to-black" />
  ),
});

type ParticleConfig = {
  uX: number;
  uY: number;
  ampX: number;
  ampY: number;
  speed: number;
  size: number;
};

const PARTICLE_LINK_DISTANCE = 180;

const createSeededRandom = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const createParticleConfig = (): ParticleConfig[] => {
  const rand = createSeededRandom(20250302);
  return Array.from({ length: 50 }, () => ({
    uX: rand(),
    uY: rand(),
    ampX: 40 + rand() * 40,
    ampY: 40 + rand() * 40,
    speed: 0.08 + rand() * 0.16,
    size: 1.5 + rand() * 2,
  }));
};

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<Application | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [time, setTime] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const particleConfigRef = useRef<ParticleConfig[]>(createParticleConfig());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min(0.05, (timestamp - lastTime) / 1000 || 0.016);
      lastTime = timestamp;
      setTime((t) => t + dt);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  const handleSplineLoad = useCallback((spline: Application) => {
    splineRef.current = spline;
    setSplineLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');

      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const particleLayout = (() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 1200;
    const height = rect?.height ?? 1200;
    const centerX = width / 2;
    const centerY = height / 2;

    return particleConfigRef.current.map((p, idx) => {
      const baseX = (p.uX - 0.5) * width;
      const baseY = (p.uY - 0.5) * height;
      const x = centerX + baseX + Math.sin(time * p.speed + idx) * p.ampX;
      const y = centerY + baseY + Math.cos(time * p.speed + idx) * p.ampY;
      return { x, y, size: p.size };
    });
  })();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Layer 1: Spline Background - receives all mouse events */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {/* Gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black pointer-events-none">
          <div className="absolute inset-0">
            <div
              className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"
              style={{ animation: 'pulse 4s ease-in-out infinite' }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"
              style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}
            />
            <div
              className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[80px]"
              style={{ animation: 'pulse 4s ease-in-out infinite 2s' }}
            />
          </div>
        </div>

        {/* Spline 3D Scene - this needs pointer events */}
        {mounted && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              splineLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Spline
              scene="https://prod.spline.design/MZq7kXo79Cm3jRXM/scene.splinecode"
              onLoad={handleSplineLoad}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              renderOnDemand={false}
            />
          </div>
        )}
      </div>

      {/* Layer 2: Heavy blur overlay - NO pointer events */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      {/* Layer 3: Particles - NO pointer events */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pointer-events-none" 
        style={{ zIndex: 3 }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'blur(0.5px)' }}>
          <defs>
            <linearGradient id="particle-line-contact" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
            <filter id="particle-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {(() => {
            const lines: Array<{
              x1: number;
              y1: number;
              x2: number;
              y2: number;
              opacity: number;
            }> = [];

            for (let i = 0; i < particleLayout.length; i++) {
              for (let j = i + 1; j < particleLayout.length; j++) {
                const a = particleLayout[i];
                const b = particleLayout[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist > PARTICLE_LINK_DISTANCE) continue;
                const t = 1 - dist / PARTICLE_LINK_DISTANCE;
                lines.push({
                  x1: a.x,
                  y1: a.y,
                  x2: b.x,
                  y2: b.y,
                  opacity: Math.pow(t, 1.5) * 0.5,
                });
              }
            }

            return (
              <>
                {lines.map((line, idx) => (
                  <line
                    key={`line-${idx}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#particle-line-contact)"
                    strokeWidth={1.5}
                    opacity={line.opacity}
                    filter="url(#particle-glow)"
                  />
                ))}
                {particleLayout.map((p, idx) => (
                  <circle
                    key={`particle-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={p.size}
                    fill="#a855f7"
                    fillOpacity={0.7}
                    filter="url(#particle-glow)"
                  />
                ))}
              </>
            );
          })()}
        </svg>
      </div>

      {/* Layer 4: Content - NO pointer events on wrapper, YES on interactive children */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="min-h-screen flex flex-col">
          {/* GET IN TOUCH - Top of section with proper padding */}
          <div 
            className="pt-32"
            style={{ marginLeft: '10vw' }}
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500 transition-all duration-1000 ${
                  isVisible ? 'w-24' : 'w-0'
                }`}
              />
              <span
                className={`text-xs tracking-[0.3em] text-violet-400/60 whitespace-nowrap transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                GET IN TOUCH
              </span>
            </div>
          </div>

          {/* Main Content - Vertically centered with proper padding */}
          <div 
            className="flex-1 flex items-center py-16"
            style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
          >
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Left Side - Header Content */}
                <div className="pointer-events-auto">
                  <h2
                    className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] mb-10 transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <span className="text-white font-bold">LET&apos;S CREATE</span>
                    <br />
                    <span className="text-white font-bold">SOMETHING</span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent font-bold">
                      AMAZING
                    </span>
                  </h2>

                  <p
                    className={`text-white/70 text-xl md:text-2xl max-w-xl font-light transition-all duration-1000 delay-200 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <span className="text-white font-semibold">Have a project in mind?</span>{' '}
                    Drop me a message and let&apos;s discuss how we can work together.
                  </p>

                  {/* Contact Info */}
                  <div
                    className={`mt-12 transition-all duration-1000 delay-600 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <p className="text-white/50 text-lg">
                      You can also reach me directly at{' '}
                      <a
                        href="mailto:admin@swofty.net"
                        className="text-violet-400 hover:text-violet-300 transition-colors font-semibold"
                      >
                        admin@swofty.net
                      </a>
                    </p>
                  </div>
                </div>

                {/* Right Side - Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className={`pointer-events-auto transition-all duration-1000 delay-400 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="space-y-8">
                    {/* Name Input */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-white text-lg font-bold mb-4 tracking-wide"
                      >
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/60 border-2 border-violet-500/30 rounded-xl px-6 py-5 text-white text-lg placeholder-white/30 focus:border-violet-500 focus:outline-none transition-all duration-300 backdrop-blur-md hover:border-violet-500/50"
                        placeholder="John Doe"
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-white text-lg font-bold mb-4 tracking-wide"
                      >
                        YOUR EMAIL
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/60 border-2 border-violet-500/30 rounded-xl px-6 py-5 text-white text-lg placeholder-white/30 focus:border-violet-500 focus:outline-none transition-all duration-300 backdrop-blur-md hover:border-violet-500/50"
                        placeholder="john@example.com"
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Message Input */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-white text-lg font-bold mb-4 tracking-wide"
                      >
                        YOUR MESSAGE
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full bg-black/60 border-2 border-violet-500/30 rounded-xl px-6 py-5 text-white text-lg placeholder-white/30 focus:border-violet-500 focus:outline-none transition-all duration-300 resize-none backdrop-blur-md hover:border-violet-500/50"
                        placeholder="Tell me about your project..."
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={status === 'sending'}
                        whileHover={{ scale: status === 'sending' ? 1 : 1.03 }}
                        whileTap={{ scale: status === 'sending' ? 1 : 0.97 }}
                        className={`
                          relative overflow-hidden w-full py-7 rounded-xl text-white text-xl font-bold tracking-wider
                          transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                          ${status === 'sending' ? 'cursor-wait' : ''}
                        `}
                        style={{
                          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                          boxShadow: '0 12px 40px rgba(168, 85, 247, 0.4)',
                        }}
                      >
                        <span className="relative z-10">
                          {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                        </span>
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                          style={{ mixBlendMode: 'overlay' }}
                        />
                      </motion.button>
                    </div>

                    {/* Status Messages */}
                    {status === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm"
                      >
                        <p className="text-green-400 font-semibold text-lg">
                          Message sent successfully! I&apos;ll get back to you soon.
                        </p>
                      </motion.div>
                    )}

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
                      >
                        <p className="text-red-400 font-semibold text-lg">
                          {errorMessage || 'Failed to send message. Please try again.'}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.form>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="pb-8">
            <p
              className={`text-center text-white/40 text-base tracking-wider transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Made with love by{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-semibold">
                Swofty
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}