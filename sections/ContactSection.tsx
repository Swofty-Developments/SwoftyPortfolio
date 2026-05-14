'use client';

import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => {
        setStatus('idle');
        setError('');
      }, 6000);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="section-frame relative w-full bg-parchment text-ink"
      style={{ paddingBlock: '120px' }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className={`md:col-span-5 reveal ${visible ? 'is-visible' : ''}`}>
            <h2 className="text-heading-lg-fluid">Let&apos;s build something good.</h2>
            <p className="mt-5 text-[17px] leading-[1.55] text-graphite max-w-[44ch]">
              I&apos;m happily forward-deployed at Lyra, but always up for a conversation — open-source collaboration, infrastructure consulting, or just talking about distributed systems.
            </p>

            <dl className="mt-10 space-y-5 text-[15px]">
              <ContactRow
                label="Email"
                value="admin@swofty.net"
                href="mailto:admin@swofty.net"
              />
              <ContactRow
                label="GitHub"
                value="github.com/Swofty-Developments"
                href="https://github.com/Swofty-Developments"
                external
              />
              <ContactRow
                label="LinkedIn"
                value="linkedin.com/in/swofty"
                href="https://www.linkedin.com/in/swofty/"
                external
              />
              <ContactRow label="Based in" value="Melbourne, Australia" />
            </dl>
          </div>

          <form
            onSubmit={onSubmit}
            className={`md:col-span-7 card-lg reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-heading-sm">Send a message</h3>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-graphite">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-iris" />
                Usually replies in a day
              </span>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your name" name="name" value={form.name} onChange={onChange} disabled={status === 'sending'} placeholder="Jane Doe" />
              <Field label="Your email" name="email" type="email" value={form.email} onChange={onChange} disabled={status === 'sending'} placeholder="jane@example.com" />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="block text-[12px] uppercase tracking-[0.16em] text-graphite font-[540] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={onChange}
                disabled={status === 'sending'}
                placeholder="What are you building?"
                className="w-full rounded-[12px] border border-fog bg-bone px-4 py-3 text-[15px] text-ink placeholder:text-graphite/60 focus:outline-none focus:border-iris transition-colors resize-y"
              />
            </div>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 rounded-[8px] bg-ink text-bone px-5 py-3 text-[15px] font-[540] hover:opacity-90 disabled:opacity-50 transition"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
              <a href="mailto:admin@swofty.net" className="btn-ghost">
                Or email directly
              </a>
            </div>

            {status === 'success' && (
              <div className="mt-6 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
                Thanks — your message landed. I&apos;ll reply soon.
              </div>
            )}
            {status === 'error' && (
              <div className="mt-6 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
                {error || 'Something went wrong. Try emailing me directly.'}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] items-baseline gap-4 border-b border-fog pb-4">
      <dt className="text-[12px] uppercase tracking-[0.16em] text-graphite font-[540]">{label}</dt>
      <dd className="text-[15px] min-w-0 break-words">
        {href ? (
          <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="link-iris break-words"
          >
            {value}
          </a>
        ) : (
          <span className="text-ink">{value}</span>
        )}
      </dd>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[12px] uppercase tracking-[0.16em] text-graphite font-[540] mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-[12px] border border-fog bg-bone px-4 py-3 text-[15px] text-ink placeholder:text-graphite/60 focus:outline-none focus:border-iris transition-colors"
      />
    </div>
  );
}
