import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
// import { email } from '@config';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }

  .subtitle-container {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
`;

const StyledGitHubProject = styled.a`
  ${({ theme }) => theme.mixins.bigButton};
  margin-top: 50px;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 25px;
  text-align: left;
  min-width: 300px;

  .project-title {
    font-size: var(--fz-lg);
    font-weight: 600;
    margin-bottom: 10px;
  }

  .project-description {
    font-family: var(--font-sans);
    font-size: var(--fz-sm);
    color: var(--slate);
    margin-bottom: 15px;
    line-height: 1.4;
  }

  .project-stats {
    display: flex;
    gap: 15px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    .stat {
      display: flex;
      align-items: center;
      gap: 5px;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }

  &:hover {
    .project-title {
      color: var(--green);
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Swofty.</h2>;
  const three = <h3 className="big-heading">I'm a DevOps Engineer</h3>;
  const four = (
    <>
      <p>
        I'm a computer science student and competitive programmer, currently studying Advanced
        Computer Science with Honours at university, majoring in Mathematics and specializing in
        Data Science and Artificial Intelligence. I specialize in algorithm design, machine
        learning, and system architecture. In the past, I've gained extensive experience with
        Minecraft NMS development and building large-scale multiplayer experiences.{' '}
        <strong>
          Please note that my Discord username is only &quot;swofty&quot; - any other accounts are
          impersonators.
        </strong>
      </p>
    </>
  );
  const five = (
    <StyledGitHubProject
      href="https://github.com/Swofty-Developments/HypixelSkyBlock"
      target="_blank"
      rel="noreferrer">
      <div className="project-title">Visit my Open Source Hypixel SkyBlock</div>
      <div className="project-description">
        Minecraft 1.21.8 (no Spigot) recreation of Hypixel SkyBlock with a goal of a properly
        abstracted and scalable codebase.
      </div>
      <div className="project-stats">
        <div className="stat">
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          <span>189 stars</span>
        </div>
        <div className="stat">
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm1-17h-2v2h-2v2h2v6h2v-6h2v-2h-2v-2z" />
          </svg>
          <span>61 forks</span>
        </div>
      </div>
    </StyledGitHubProject>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
