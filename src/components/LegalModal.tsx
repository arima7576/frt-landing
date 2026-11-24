import React, { useEffect, useRef } from 'react';
import { COMPANY_INFO } from '../data/content';

export type LegalDocType = 'disclosures' | 'privacy' | 'terms';

interface LegalModalProps {
  activeDoc: LegalDocType | null;
  onClose: () => void;
}

const LEGAL_DOCUMENTS: Record<
  LegalDocType,
  {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  }
> = {
  disclosures: {
    eyebrow: 'Regulatory & Legal Notice',
    title: 'Important Disclosures',
    paragraphs: [
      `${COMPANY_INFO.legalName} (${COMPANY_INFO.shortName}) is a private limited company registered in England and Wales (Company No. ${COMPANY_INFO.companyNumber}).`,
      `${COMPANY_INFO.legalName} is not authorised or regulated by the UK Financial Conduct Authority (FCA) or any other financial supervisory authority. Nothing on this website constitutes investment advice, financial advice, legal advice, tax advice, trading signals, or an offer, invitation, or financial promotion (including within the meaning of section 21 of the Financial Services and Markets Act 2000) to buy, sell, or hold any financial instrument or participate in any investment strategy.`,
      `Commercial services described on this site relate strictly to software development, mathematical modelling, data analysis, and analytical decision-support systems. Any future live-market evaluation of internally developed quantitative strategies is intended solely as proprietary testing using the company’s own internal capital and is not open to third-party investors or outside capital.`,
      `All content on this website is provided for general informational purposes only, without representation or warranty of any kind as to accuracy, completeness, or fitness for a particular purpose.`,
    ],
  },
  privacy: {
    eyebrow: 'Data & Cookie Notice',
    title: 'Privacy & Data Practices',
    paragraphs: [
      `Data Controller: ${COMPANY_INFO.legalName} (Company No. ${COMPANY_INFO.companyNumber}, ${COMPANY_INFO.jurisdiction}).`,
      `No Tracking Cookies: This website does not set advertising, analytics, or tracking cookies, and does not store personal tracking identifiers in browser storage.`,
      `Local Inquiry Brief Builder: Information entered into the Contact inquiry brief generator is formatted locally within your browser session so you can copy and transmit it via your chosen communication channel. This static site does not transmit or store form submissions on a remote server.`,
      `Third-Party Font Delivery: Typeface stylesheets are loaded from Google Fonts (fonts.googleapis.com / fonts.gstatic.com), which involves a standard HTTP request from your browser that exposes your IP address and user-agent headers to Google’s font delivery servers.`,
    ],
  },
  terms: {
    eyebrow: 'Site Terms',
    title: 'Terms of Use',
    paragraphs: [
      `By accessing this website, you acknowledge that all copy, architectural graphics, software code, and branding belong to ${COMPANY_INFO.legalName} unless otherwise noted.`,
      `You may not copy, scrape, redistribute, or represent materials from this website as endorsements, performance claims, or regulated investment communications.`,
      `These terms and any non-contractual obligations arising out of your use of this website are governed by the laws of England and Wales.`,
    ],
  },
};

export const LegalModal: React.FC<LegalModalProps> = ({ activeDoc, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeDoc) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDoc, onClose]);

  if (!activeDoc) {
    return null;
  }

  const doc = LEGAL_DOCUMENTS[activeDoc];

  return (
    <div
      className="legal-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div className="legal-modal arch-frame" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal__header">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__marker" aria-hidden="true" />
              <span>{doc.eyebrow}</span>
            </p>
            <h2 id="legal-modal-title" className="legal-modal__title">
              {doc.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="circle-arrow-btn"
            aria-label="Close legal notice"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>

        <div className="legal-modal__body">
          {doc.paragraphs.map((paragraph) => (
            <p key={paragraph} className="legal-modal__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
