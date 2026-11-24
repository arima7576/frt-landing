import React from 'react';
import { DISCIPLINES_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { DisciplineVisual } from './DisciplineVisual';

export const Disciplines: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="section"
      aria-labelledby="disciplines-heading"
    >
      <div className="container">
        <div className={`disciplines-intro reveal${isVisible ? ' reveal--visible' : ''}`}>
          <p className="eyebrow">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{DISCIPLINES_CONTENT.eyebrow}</span>
          </p>
          <h2
            id="disciplines-heading"
            className="editorial-heading editorial-heading--centered disciplines-intro__title"
          >
            {DISCIPLINES_CONTENT.headline}
          </h2>
          <p className="section-lead disciplines-intro__subhead">{DISCIPLINES_CONTENT.subhead}</p>
        </div>

        <div className="disciplines-stack">
          {DISCIPLINES_CONTENT.areas.map((area, idx) => (
            <article
              key={area.id}
              id={area.id}
              className={`discipline-card arch-frame reveal reveal--delay-${Math.min(idx + 1, 3)}${
                isVisible ? ' reveal--visible' : ''
              }`}
              style={{ '--stack-index': idx } as React.CSSProperties}
            >
              <div className="discipline-card__content">
                <div className="discipline-card__top">
                  <span className="discipline-card__index">{area.index}</span>
                  <span className="discipline-card__tag">{area.domainTag}</span>
                </div>

                <div>
                  <h3 className="discipline-card__title">{area.title}</h3>
                  <p className="discipline-card__summary">{area.summary}</p>
                </div>

                <div className="discipline-card__meta">
                  <p className="discipline-card__note">{area.methodologyNote}</p>
                  <ul className="discipline-card__focus-list">
                    {area.focusAreas.map((focus) => (
                      <li key={focus} className="discipline-card__focus-item">
                        <span className="discipline-card__focus-dash" aria-hidden="true">
                          —
                        </span>
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="discipline-card__visual">
                <DisciplineVisual id={area.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
