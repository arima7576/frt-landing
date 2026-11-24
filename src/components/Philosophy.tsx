import React, { useState } from 'react';
import { PHILOSOPHY_CONTENT } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useReveal } from '../hooks/useReveal';

export const Philosophy: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const marqueePaused = paused || reducedMotion;

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="section"
      aria-labelledby="philosophy-heading"
    >
      <div className="container">
        <div className={`reveal${isVisible ? ' reveal--visible' : ''}`}>
          <p className="eyebrow">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{PHILOSOPHY_CONTENT.eyebrow}</span>
          </p>
          <h2 id="philosophy-heading" className="section-heading philosophy-heading">
            {PHILOSOPHY_CONTENT.headline}
          </h2>
        </div>

        <div className="philosophy-layout">
          <div
            className={`philosophy-narrative reveal reveal--delay-1${
              isVisible ? ' reveal--visible' : ''
            }`}
          >
            <p className="philosophy-narrative__lead">{PHILOSOPHY_CONTENT.lead}</p>
            <p className="philosophy-narrative__body">{PHILOSOPHY_CONTENT.body}</p>
            <blockquote className="philosophy-quote-block">
              “Signal only counts when it survives an honest attempt to break it.”
            </blockquote>
          </div>

          <div
            className={`principles-grid reveal reveal--delay-2${
              isVisible ? ' reveal--visible' : ''
            }`}
          >
            {PHILOSOPHY_CONTENT.principles.map((principle) => (
              <article key={principle.index} className="principle-cell">
                <div className="principle-cell__header">
                  <span className="principle-cell__index">{principle.index}</span>
                  <span className="principle-cell__dot" aria-hidden="true" />
                </div>
                <h3 className="principle-cell__title">{principle.title}</h3>
                <p className="principle-cell__body">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Continuous Research Axioms Marquee (Optiver-inspired rhythmic ticker + accessible pause control) */}
      <div
        className={`axioms-marquee-wrap reveal reveal--delay-3${
          isVisible ? ' reveal--visible' : ''
        }`}
        aria-label="Core research axioms"
      >
        <div className="axioms-marquee-viewport">
          <div
            className={`axioms-marquee-track${
              marqueePaused ? ' axioms-marquee-track--paused' : ''
            }`}
          >
            {[0, 1].map((dupIndex) => (
              <div
                key={dupIndex}
                className="axioms-marquee-group"
                aria-hidden={dupIndex === 1 ? 'true' : undefined}
              >
                {PHILOSOPHY_CONTENT.axioms.map((axiom) => (
                  <React.Fragment key={`${dupIndex}-${axiom}`}>
                    <div className="axiom-card">{axiom}</div>
                    <span className="axiom-ring" aria-hidden="true" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="container axioms-marquee-controls">
          <button
            type="button"
            className="process-nav-btn"
            aria-pressed={marqueePaused}
            onClick={() => setPaused((prev) => !prev)}
          >
            {marqueePaused ? 'Resume Axiom Stream' : 'Pause Axiom Stream'}
          </button>
        </div>
      </div>
    </section>
  );
};
