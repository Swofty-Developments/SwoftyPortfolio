'use client';

import { useEffect, useRef, useState } from 'react';
import type { Award } from '@/types/experience';

const awards: Award[] = [
  {
    id: 'mcpc-2025',
    title: '2nd Place · MCPC 2025',
    issuer: 'Monash Algorithms and Problem Solving',
    date: 'Oct 2025',
    description:
      'Led a small team to second place in the yearly Monash Collegiate Programming Competition. Algorithm design, set theory, and number theory.',
    type: 'award',
  },
  {
    id: 'advent-2025',
    title: '1st Place · Advent of MAPS 2025',
    issuer: 'Monash Algorithms and Problem Solving',
    date: 'Aug 2025',
    description:
      'Won first place in the month-long competitive programming competition. Graph theory, number theory, dynamic programming, and algorithm optimisation.',
    type: 'award',
  },
  {
    id: 'macathon-2025',
    title: '1st Place · MACATHON 2025',
    issuer: 'Monash Association of Coding',
    date: 'May 2025',
    description:
      "Led a team to first place and an A$1,800 prize at Monash's 48-hour hackathon with Catch N Go — a location-based app that gamifies making friends on campus. Built with FastAPI, MongoDB, Kotlin, and OpenAI for icebreaker generation.",
    type: 'award',
  },
  {
    id: 'future-innovators',
    title: 'Future Innovators',
    issuer: 'Australian Defence Force',
    date: 'Nov 2024',
    description:
      'Recognised for innovative thinking and technical excellence in software development and system design.',
    type: 'award',
  },
  {
    id: 'vce-algorithmics',
    title: 'VCE Algorithmics Dux',
    issuer: 'Suzanne Cory High School',
    date: 'Oct 2024',
    description:
      "Awarded to the 2024 highest-scoring Algorithmics student.",
    type: 'award',
  },
  {
    id: 'vce-sd',
    title: 'VCE Software Development Dux',
    issuer: 'Suzanne Cory High School',
    date: 'Oct 2024',
    description:
      'Awarded to the 2024 highest-scoring Software Development student.',
    type: 'award',
  },
  {
    id: 'vce-academic-excellence',
    title: 'Year 12 Academic Excellence',
    issuer: 'Suzanne Cory High School',
    date: 'Oct 2024',
    description:
      'Awarded to the top 10% of students per year level based on grades across all subjects.',
    type: 'award',
  },
];

export default function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={ref}
      className="section-frame relative w-full bg-parchment text-ink"
      style={{ paddingBlock: '120px' }}
    >
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className={`reveal ${visible ? 'is-visible' : ''}`}>
            <h2 className="text-heading-lg-fluid max-w-[22ch]">
              Awards, trophies, and weekend wins.
            </h2>
            <p className="mt-4 text-[16px] leading-[1.55] text-graphite max-w-[58ch]">
              Competitive programming placings and a few academic accolades — most of these came from late nights at hackathons or weekend contests.
            </p>
          </div>

          <span
            className={`text-[12px] uppercase tracking-[0.18em] text-graphite font-[540] reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            {awards.length} accolades
          </span>
        </div>

        <ol className="mt-12 relative grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((item, idx) => (
            <li
              key={item.id}
              className={`reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${idx * 60 + 80}ms` }}
            >
              <ItemCard item={item} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemCard({ item }: { item: Award }) {
  return (
    <article className="card hover:border-driftwood transition-colors group">
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-12 md:col-span-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] tracking-[0.14em] uppercase font-[540] bg-lavender-chip/40 text-iris">
              Award
            </span>
          </div>
          <div className="mt-3 text-[14px] text-graphite">{item.date}</div>
        </div>

        <div className="col-span-12 md:col-span-9">
          <h3 className="text-heading-sm tracking-[-0.014em]">{item.title}</h3>
          <div className="mt-1 text-[15px] text-ink/80 font-[540]">{item.issuer}</div>
          <p className="mt-3 text-[15px] leading-[1.55] text-graphite max-w-[68ch]">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}
