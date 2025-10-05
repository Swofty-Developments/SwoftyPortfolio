import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Icon } from '@components/icons';

const StyledAwardsSection = styled.section`
  max-width: 900px;

  .awards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    margin-top: 50px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledAward = styled.div`
  position: relative;
  cursor: default;
  transition: var(--transition);
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: var(--border-radius);
  background-color: var(--light-navy);

  &:hover,
  &:focus-within {
    transform: translateY(-7px);
  }

  .award-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .award-icon {
    color: var(--green);
    width: 40px;
    height: 40px;
  }

  .award-date {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .award-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    font-weight: 600;

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .award-issuer {
    color: var(--slate);
    font-size: var(--fz-sm);
    margin-bottom: 15px;
  }

  .award-description {
    color: var(--light-slate);
    font-size: var(--fz-sm);
    line-height: 1.5;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const Awards = () => {
  const revealTitle = useRef(null);
  const revealAwards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealAwards.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const awards = [
    {
      title: '2nd Place Winner at Monash Collegiate Programming Competition',
      issuer: 'Monash Algorithms and Problem Solving',
      date: 'Oct 2025',
      description:
        'Pioneered a small team to win 2nd place in the yearly Monash Collegiate Programming Competition ran by the Monash Algorithms and Problem Solving student team. Various skills involved were algorithm design and implementation, and mathematical domains such as set theory and number theory.',
      association: 'Monash University',
    },
    {
      title: '1st Place Winner at Advent of MAPS 2025',
      issuer: 'Monash Algorithms and Problem Solving',
      date: 'Aug 2025',
      description:
        'Competed and won 1st place in the yearly month-long competitive programming competition ran by the Monash Algorithms and Problem Solving student team. Skills involved include various mathematical fields such as graph theory, number theory, and dynamic programming, as well as algorithm design and optimization techniques.',
      association: 'Monash University',
    },
    {
      title: '1st Place Winner at MACATHON 2025',
      issuer: 'Monash Association of Coding (MAC)',
      date: 'May 2025',
      description:
        'Led a team to win 1st place and $1,800 prize at Monash University\'s 48-hour hackathon with Catch N Go, a location-based app that gamifies making friends on campus through interactive challenges and leaderboards. Built using Python/FastAPI, MongoDB, Kotlin, and OpenAI to generate icebreakers.',
      association: 'Monash University',
    },
    {
      title: 'Future Innovators',
      issuer: 'Australian Defence Force',
      date: 'Nov 2024',
      description:
        'Recognized for exceptional innovation and technical excellence in developing advanced solutions.',
      association: 'Monash University',
    },
  ];

  return (
    <StyledAwardsSection id="awards">
      <h2 className="numbered-heading" ref={revealTitle}>
        Awards & Recognition
      </h2>

      <div className="awards-grid">
        {awards.map((award, i) => (
          <StyledAward key={i} ref={el => (revealAwards.current[i] = el)}>
            <div className="award-header">
              <div className="award-icon">
                <Icon name="Star" />
              </div>
            </div>

            <h3 className="award-title">{award.title}</h3>

            <div className="award-issuer">Issued by {award.issuer}</div>

            <div className="award-date">{award.date}</div>

            {award.association && (
              <div className="award-issuer" style={{ marginTop: '10px' }}>
                Associated with {award.association}
              </div>
            )}

            <p className="award-description">{award.description}</p>
          </StyledAward>
        ))}
      </div>
    </StyledAwardsSection>
  );
};

export default Awards;
