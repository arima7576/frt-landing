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
            const isFounder = Boolean(member.role);
            return (
              <article
                key={member.name}
                className={`team-card arch-frame${
                  isFounder ? ' team-card--founder' : ''
                } reveal reveal--delay-${Math.min((idx % 3) + 1, 3)}${
                  isVisible ? ' reveal--visible' : ''
                }`}
              >
                <div>
                  <div className="team-card__meta">
                    <span className="team-card__index">{member.index}</span>
                    {member.role ? (
                      <span className="team-card__role">{member.role}</span>
                    ) : (
                      <span className="team-card__discipline">{member.discipline}</span>
                    )}
                  </div>

                  <h3 className="team-card__name">{member.name}</h3>
                  {member.role && (
                    <p className="team-card__discipline team-card__discipline--sub">
                      {member.discipline}
                    </p>
                  )}

                  <p className="team-card__summary">{member.summary}</p>
                </div>

                <div className="team-card__education-wrap">
                  <p className="team-card__education">{member.education}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
