import React, { useCallback, useState } from 'react';
import { HERO_CONTENT } from '../data/content';
import { HeroCanvas } from './HeroCanvas';

const DOMAIN_HREFS: Record<string, string> = {
  '01': '#quantitative-research',
  '02': '#applied-ai-data-science',
  '03': '#business-intelligence-solutions',
};

export const Hero: React.FC = () => {
  const [solverPercent, setSolverPercent] = useState(14);
  const [solverPhase, setSolverPhase] = useState<'integrating' | 'converged'>('integrating');
  const [replayToken, setReplayToken] = useState(0);

  const handleProgressUpdate = useCallback(
    (percent: number, phase: 'integrating' | 'converged') => {
      setSolverPercent(percent);
      setSolverPhase(phase);
    },
    [],
  );

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <HeroCanvas replayToken={replayToken} onProgressUpdate={handleProgressUpdate} />
      <div className="hero__scrim" aria-hidden="true" />

      {/* Mathematical ODE System Telemetry Flanks (reflecting the live RK4 solver behind the hero) */}
      <div className="hero-flanks">
        <div className="hero-flank hero-flank--left" aria-hidden="true">
          <span className="hero-flank__index">01 / COUPLED SYSTEM (RK4)</span>
          <code className="hero-flank__equation">
            dx/dt = (z − b)x − dy{'\n'}
            dy/dt = dx + (z − b)y{'\n'}
            dz/dt = c + az − z³/3 − r²(1 + ez) + fzx³
          </code>
        </div>

        <div className="hero-flank hero-flank--right">
          <div className="hero-flank__top">
            <span className="hero-flank__index">
              {solverPhase === 'converged' ? 'MANIFOLD CONVERGED' : 'SOLVING PHASE SPACE'}
            </span>
            <span className="hero-flank__pct">{solverPercent}%</span>
          </div>
          <div className="hero-flank__bar" aria-hidden="true">
            <span
              className="hero-flank__bar-fill"
              style={{ transform: `scaleX(${solverPercent / 100})` }}
            />
          </div>
          <button
            type="button"
            className="hero-flank__replay"
            onClick={() => setReplayToken((prev) => prev + 1)}
          >
            Replay Integration ↺
          </button>
        </div>
      </div>

      <div className="container hero__stage">
        <div className="hero__content hero__content--centered">
          <p className="eyebrow hero__eyebrow-pill">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{HERO_CONTENT.eyebrow}</span>
          </p>

          <h1 className="hero__headline hero__headline--editorial">{HERO_CONTENT.headline}</h1>

          <p className="hero__supporting">{HERO_CONTENT.supporting}</p>

          <div className="hero__cta-row hero__cta-row--centered">
            <a href={HERO_CONTENT.primaryCta.href} className="btn btn--primary">
              <span>{HERO_CONTENT.primaryCta.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero__footer-bar">
          <ul className="hero__domains" aria-label="Core capabilities">
            {HERO_CONTENT.domains.map((domain) => (
              <li key={domain.index}>
                <a
                  href={DOMAIN_HREFS[domain.index] ?? '#what-we-do'}
                  className="hero__domain-link"
                >
                  <span className="hero__domain-index">{domain.index}</span>
                  <span>{domain.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <a href="#manifesto" className="hero__scroll-cue">
            <span>Scroll</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2V10M2.5 6.5L6 10L9.5 6.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
