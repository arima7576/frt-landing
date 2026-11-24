import React from 'react';
import { PERSPECTIVE_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { PerspectiveCanvas } from './PerspectiveCanvas';

export const Perspective: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();

  return (
    <section
      id="perspective"
      ref={sectionRef}
      className="section section--surface"
      aria-labelledby="perspective-heading"
    >
      <div className="container">
        <div className={`reveal${isVisible ? ' reveal--visible' : ''}`}>
          <p className="eyebrow">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{PERSPECTIVE_CONTENT.eyebrow}</span>
          </p>
        </div>

        <div className="perspective-grid">
          <h2
            id="perspective-heading"
            className={`section-heading perspective-heading reveal reveal--delay-1${
              isVisible ? ' reveal--visible' : ''
            }`}
          >
            {PERSPECTIVE_CONTENT.headline}
          </h2>

          <div
            className={`perspective-prose reveal reveal--delay-2${
              isVisible ? ' reveal--visible' : ''
            }`}
          >
            <p className="perspective-prose__lead">{PERSPECTIVE_CONTENT.lead}</p>
            {PERSPECTIVE_CONTENT.paragraphs.map((paragraph) => (
              <p key={paragraph} className="perspective-prose__body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className={`perspective-visual-frame arch-frame reveal reveal--delay-2${
            isVisible ? ' reveal--visible' : ''
          }`}
        >
          <div className="perspective-visual-frame__header">
            <span>Phase Transition // Stochastic Dispersion to Harmonic Structure</span>
            <span className="perspective-visual-frame__status">
              <span className="eyebrow__marker" aria-hidden="true" />
              <span>Interactive Inquiry Lens</span>
            </span>
          </div>

          <PerspectiveCanvas />

          <div className="perspective-visual-frame__labels">
            <span>Unfiltered Complexity</span>
            <span>Coherent Signal Extraction</span>
          </div>

          <div className="tenets-grid">
            {PERSPECTIVE_CONTENT.tenets.map((tenet) => (
              <article key={tenet.index} className="tenet-item">
                <div className="tenet-item__header">
                  <span className="tenet-item__index">{tenet.index} /</span>
                  <h3 className="tenet-item__title">{tenet.title}</h3>
                </div>
                <p className="tenet-item__body">{tenet.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
