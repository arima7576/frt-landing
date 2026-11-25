import React from 'react';
import { TEAM_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';

export const Team: React.FC = () => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();

  return (
    <section id="team" ref={sectionRef} className="section" aria-labelledby="team-heading">
      <div className="container">
        <div className={`section-header-split reveal${isVisible ? ' reveal--visible' : ''}`}>
          <div>
            <p className="eyebrow">
              <span className="eyebrow__marker" aria-hidden="true" />
              <span>{TEAM_CONTENT.eyebrow}</span>
            </p>
            <h2 id="team-heading" className="section-heading team-intro__title">
              {TEAM_CONTENT.headline}
            </h2>
          </div>

          <p className="section-lead">{TEAM_CONTENT.subhead}</p>
        </div>

        <div className="team-grid">
          {TEAM_CONTENT.members.map((member, idx) => {
            const isCoFounder = Boolean(member.isCoFounder);
            return (
              <article
                key={member.name}
                className={`team-card arch-frame${
                  isCoFounder ? ' team-card--founder' : ''
                } reveal reveal--delay-${Math.min((idx % 3) + 1, 3)}${
                  isVisible ? ' reveal--visible' : ''
                }`}
              >
                <div className="team-card__header">
                  <div className="team-card__meta">
                    <span className="team-card__index">{member.index}</span>
                    {isCoFounder && <span className="team-card__role">Co-Founder</span>}
                  </div>

                  <h3 className="team-card__name">{member.name}</h3>
                  <p className={`team-card__title${isCoFounder ? ' team-card__title--founder' : ''}`}>
                    {member.title}
                  </p>
                </div>

                <p className="team-card__summary team-card__bio">{member.biography}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
