import React, { useEffect, useRef, useState } from 'react';
import { COMPANY_INFO, CONTACT_CONTENT } from '../data/content';
import { useReveal } from '../hooks/useReveal';

interface ContactProps {
  isOpen: boolean;
  onOpen: () => void;
}

interface EnquiryState {
  name: string;
  organisation: string;
  scope: string;
  context: string;
}

const INITIAL_FORM: EnquiryState = {
  name: '',
  organisation: '',
  scope: CONTACT_CONTENT.enquiryTopics[0],
  context: '',
};

export const Contact: React.FC<ContactProps> = ({ isOpen, onOpen }) => {
  const [sectionRef, isVisible] = useReveal<HTMLElement>();
  const [formState, setFormState] = useState<EnquiryState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && !submitted) {
      const timer = window.setTimeout(() => {
        nameInputRef.current?.focus({ preventScroll: true });
      }, 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, submitted]);

  const formattedBrief = [
    `${COMPANY_INFO.legalName.toUpperCase()} (${COMPANY_INFO.shortName}) — ENQUIRY BRIEF`,
    `From: ${formState.name.trim()}${
      formState.organisation.trim() ? ` (${formState.organisation.trim()})` : ''
    }`,
    `Enquiry Area: ${formState.scope}`,
    `Context:\n${formState.context.trim()}`,
  ].join('\n');

  const handleSelectTopic = (topic: string) => {
    setFormState((prev) => ({ ...prev, scope: topic }));
    setSubmitted(false);
    setError(null);
    if (!isOpen) {
      onOpen();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setError('Please enter your name so we know who is making the enquiry.');
      return;
    }
    if (formState.context.trim().length < 16) {
      setError(
        'Please share a concise summary of the project, question, or collaboration you wish to discuss.',
      );
      return;
    }
    setError(null);
    setSubmitted(true);
    setCopied(false);
  };

  const handleCopyBrief = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedBrief);
        setCopied(true);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setFormState(INITIAL_FORM);
    setSubmitted(false);
    setError(null);
    setCopied(false);
  };

  return (
    <section id="contact" ref={sectionRef} className="section" aria-labelledby="contact-heading">
      <div className="container">
        <div
          className={`contact-monolith arch-frame reveal${isVisible ? ' reveal--visible' : ''}`}
        >
          <div className="contact-monolith__header">
            <p className="eyebrow">
              <span className="eyebrow__marker" aria-hidden="true" />
              <span>{CONTACT_CONTENT.eyebrow}</span>
            </p>

            <h2
              id="contact-heading"
              className="editorial-heading editorial-heading--centered contact-monolith__title"
            >
              {CONTACT_CONTENT.headline}
            </h2>

            <p className="section-lead contact-monolith__supporting">
              {CONTACT_CONTENT.supporting}
            </p>

            <div className="contact-topics" role="group" aria-label="Commercial enquiry areas">
              {CONTACT_CONTENT.enquiryTopics.map((topic) => {
                const selected = formState.scope === topic && isOpen;
                return (
                  <button
                    key={topic}
                    type="button"
                    className={`contact-topic-pill${
                      selected ? ' contact-topic-pill--active' : ''
                    }`}
                    onClick={() => handleSelectTopic(topic)}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {!isOpen && (
              <div className="contact-monolith__cta">
                <button type="button" className="btn btn--primary" onClick={onOpen}>
                  <span>{CONTACT_CONTENT.ctaLabel}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {isOpen && (
            <div className="contact-console">
              {submitted ? (
                <div className="contact-confirmation" role="status" aria-live="polite">
                  <p className="eyebrow">
                    <span className="eyebrow__marker" aria-hidden="true" />
                    <span>Enquiry Brief Prepared</span>
                  </p>
                  <h3 className="contact-confirmation__title">
                    Thank you, {formState.name.trim()}.
                  </h3>
                  <p className="contact-panel__prompt">
                    Your structured enquiry summary is ready below. Copy it to share through your
                    preferred direct channel, or revise any details.
                  </p>
                  <pre className="contact-confirmation__summary">{formattedBrief}</pre>
                  <div className="contact-form__actions">
                    <button type="button" className="btn btn--primary" onClick={handleCopyBrief}>
                      {copied ? 'Copied Brief' : 'Copy Enquiry Brief'}
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => setSubmitted(false)}
                    >
                      Edit Details
                    </button>
                    <button type="button" className="process-nav-btn" onClick={handleReset}>
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form__row">
                    <div className="form-field">
                      <label htmlFor="contact-name" className="form-label">
                        Name *
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-input"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-org" className="form-label">
                        Organisation
                      </label>
                      <input
                        id="contact-org"
                        name="organisation"
                        type="text"
                        className="form-input"
                        placeholder="Optional"
                        value={formState.organisation}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, organisation: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-scope" className="form-label">
                      Area of Enquiry
                    </label>
                    <select
                      id="contact-scope"
                      name="scope"
                      className="form-select"
                      value={formState.scope}
                      onChange={(e) => setFormState((prev) => ({ ...prev, scope: e.target.value }))}
                    >
                      {CONTACT_CONTENT.enquiryTopics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-context" className="form-label">
                      Project / Enquiry Context *
                    </label>
                    <textarea
                      id="contact-context"
                      name="context"
                      className="form-textarea"
                      placeholder="Outline your objectives, analytical problem, or proposed collaboration."
                      value={formState.context}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, context: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="contact-form__actions">
                    <button type="submit" className="btn btn--primary">
                      Prepare Enquiry Brief
                    </button>
                    <span className="eyebrow">
                      {COMPANY_INFO.jurisdiction} · No. {COMPANY_INFO.companyNumber}
                    </span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
