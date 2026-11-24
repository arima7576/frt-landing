import React, { useState } from 'react';
import { PROCESS_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { ProcessCanvas } from './ProcessCanvas';

export const ResearchProcess: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);

  const stages = PROCESS_CONTENT.stages;
  const activeStage = stages[activeIndex];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((idx + 1) % stages.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((idx - 1 + stages.length) % stages.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(stages.length - 1);
    }
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section section--elevated"
      aria-labelledby="process-heading"
    >
      <div className="container">
        <div className={`process-intro reveal${isVisible ? ' reveal--visible' : ''}`}>
          <p className="eyebrow">
            <span className="eyebrow__marker" aria-hidden="true" />
            <span>{PROCESS_CONTENT.eyebrow}</span>
          </p>
          <h2
            id="process-heading"
            className="editorial-heading editorial-heading--centered process-intro__title"
          >
            {PROCESS_CONTENT.headline}
          </h2>
          <p className="section-lead process-intro__subhead">{PROCESS_CONTENT.subhead}</p>
        </div>

        {/* Optiver-inspired Geometric Capsule Mosaic + Live Simulation */}
        <div
          className={`process-shell arch-frame reveal reveal--delay-2${
            isVisible ? ' reveal--visible' : ''
          }`}
        >
          <div className="process-mosaic-bar">
            <div
              className="process-mosaic"
              role="tablist"
              aria-label="Five-stage research process"
            >
              {stages.map((stage, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={stage.id}
                    id={`process-tab-${stage.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`process-panel-${stage.id}`}
                    tabIndex={selected ? 0 : -1}
                    className={`process-pill${selected ? ' process-pill--active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    onKeyDown={(event) => handleKeyDown(event, idx)}
                  >
                    <span className="process-pill__index">{stage.index}</span>
                    <span className="process-pill__title">{stage.title}</span>
                    <span className="process-pill__plus" aria-hidden="true">
                      {selected ? '—' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="process-carousel-arrows">
              <button
                type="button"
                className="circle-arrow-btn"
                aria-label="Previous research stage"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <button
                type="button"
                className="circle-arrow-btn"
                aria-label="Next research stage"
                disabled={activeIndex === stages.length - 1}
                onClick={() => setActiveIndex((prev) => Math.min(stages.length - 1, prev + 1))}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
          </div>

          <div
            id={`process-panel-${activeStage.id}`}
            role="tabpanel"
            aria-labelledby={`process-tab-${activeStage.id}`}
            className="process-stage-grid"
          >
            <div className="process-stage-copy">
              <div>
                <div className="process-stage-meta">
                  <span className="process-stage-meta__pill">
                    Stage {activeStage.index} of 0{stages.length}
                  </span>
                  <span>{activeStage.artifactLabel}</span>
                </div>

                <h3 className="process-stage-title">
                  {activeStage.index} — {activeStage.title}
                </h3>
                <p className="process-stage-summary">{activeStage.summary}</p>
                <p className="process-stage-detail">{activeStage.detail}</p>
              </div>

              <div className="process-stage-controls">
                <span className="eyebrow">Stage Progress</span>
                <div className="process-step-dots" aria-hidden="true">
                  {stages.map((s, idx) => (
                    <span
                      key={s.id}
                      className={`process-step-dot${
                        idx === activeIndex
                          ? ' process-step-dot--active'
                          : idx < activeIndex
                            ? ' process-step-dot--passed'
                            : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="process-diagram-panel">
              <div className="process-diagram-panel__hud">
                <span>TOPOLOGY STATE // {activeStage.title.toUpperCase()}</span>
                <span style={{ color: 'var(--accent)' }}>84 TRACKED NODES</span>
              </div>
              <ProcessCanvas activeStageIndex={activeIndex} />
              <div className="process-diagram-panel__foot">
                <span>{activeStage.artifactLabel}</span>
                <span>POINTER PERTURBATION ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
