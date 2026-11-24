import React from 'react';
import { HORIZON_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';

export const Horizon: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();

  return (
    <section
      id="horizon"
      ref={sectionRef}
      className="section section--elevated"
      aria-labelledby="horizon-heading"
    >
      <div className="container">
        <div className={`horizon-intro reveal${isVisible ? ' reveal--visible' : ''}`}>
          <p className="eyebrow">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{HORIZON_CONTENT.eyebrow}</span>
          </p>
          <h2
            id="horizon-heading"
            className="editorial-heading editorial-heading--centered horizon-intro__title"
          >
            {HORIZON_CONTENT.headline}
          </h2>
          <p className="section-lead horizon-intro__subhead">{HORIZON_CONTENT.intro}</p>
        </div>

        <div
          className={`horizon-trajectory reveal reveal--delay-1${
            isVisible ? ' reveal--visible' : ''
          }`}
          aria-hidden="true"
        >
          <span className="horizon-trajectory__node">
            <span className="eyebrow__marker" />
            <span>01 / Active Research &amp; Intelligence</span>
          </span>
          <span className="horizon-trajectory__line" />
          <span className="horizon-trajectory__node">Empirical Validation Gate</span>
          <span className="horizon-trajectory__line" />
          <span className="horizon-trajectory__node" style={{ color: 'var(--accent)' }}>
            02 / Proprietary Live-Market Testing
          </span>
        </div>

        <div className="horizon-grid">
          {HORIZON_CONTENT.columns.map((column, idx) => {
            const isFuture = column.status === 'Long-Term';
            return (
              <article
                key={column.tag}
                className={`horizon-panel arch-frame${
                  isFuture ? ' horizon-panel--future' : ''
                } reveal reveal--delay-${idx + 1}${isVisible ? ' reveal--visible' : ''}`}
              >
                <div>
                  <div className="horizon-panel__header">
                    <span className="horizon-panel__tag">{column.tag}</span>
                    <span className="horizon-panel__badge">{column.status}</span>
                  </div>

                  <h3 className="horizon-panel__title">{column.title}</h3>
                  <p className="horizon-panel__description">{column.description}</p>
                </div>

                <ul className="horizon-panel__list">
                  {column.items.map((item) => (
                    <li key={item} className="horizon-panel__list-item">
                      <span className="horizon-panel__bullet" aria-hidden="true">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
