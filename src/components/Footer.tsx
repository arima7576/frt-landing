import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/content';
import { LegalDocType, LegalModal } from './LegalModal';
import { BrandLogoMark } from './Navbar';

export const Footer: React.FC = () => {
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(null);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-panels">
          <div className="footer-card">
            <h3 className="footer-card__title">Research</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#quantitative-research" className="footer-card__link">
                  Quantitative Research
                </a>
              </li>
              <li>
                <a href="#applied-ai-intelligence" className="footer-card__link">
                  Applied AI &amp; Intelligence
                </a>
              </li>
              <li>
                <a href="#business-analytics" className="footer-card__link">
                  Business Analytics
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-card">
            <h3 className="footer-card__title">Methodology</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#perspective" className="footer-card__link">
                  Our Perspective
                </a>
              </li>
              <li>
                <a href="#process" className="footer-card__link">
                  Research Process
                </a>
              </li>
              <li>
                <a href="#horizon" className="footer-card__link">
                  Future Direction
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-card">
            <h3 className="footer-card__title">Fluid Research &amp; Technologies</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#philosophy" className="footer-card__link">
                  Thinking Behind FRT
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-card__link">
                  Start a Conversation
                </a>
              </li>
              <li>
                <a href="#top" className="footer-card__link">
                  Back to Top ↑
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* High-Contrast Alabaster Brand Plate (Optiver-inspired editorial finale) */}
        <div className="footer-brand-plate">
          <div className="footer-brand-plate__top">
            <a href="#top" className="brand-mark brand-mark--light" aria-label="FRT back to top">
              <BrandLogoMark variant="light" />
              <span>FRT</span>
            </a>

            <span className="footer-brand-plate__tag">
              {COMPANY_INFO.legalName.toUpperCase()}
            </span>
          </div>

          <p className="footer-brand-plate__copy">
            <strong>{COMPANY_INFO.legalName}</strong> ({COMPANY_INFO.shortName}) operates at the
            intersection of quantitative market research, mathematical modelling, software systems,
            and applied artificial intelligence—investigating complexity to uncover durable
            structure and build clear analytical tools. Not FCA-regulated; does not provide
            investment advice or manage third-party capital.
          </p>

          <div className="footer-brand-plate__bottom">
            <a href="#perspective" className="footer-brand-plate__link">
              Explore our perspective →
            </a>
            <span className="footer-brand-plate__meta">
              {COMPANY_INFO.jurisdiction} · Company No. {COMPANY_INFO.companyNumber}
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 {COMPANY_INFO.legalName}. All rights reserved. Company No.{' '}
            {COMPANY_INFO.companyNumber}.
          </span>

          <div className="footer-legal-links">
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveLegalDoc('disclosures')}
            >
              Regulatory &amp; Legal Notice
            </button>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveLegalDoc('privacy')}
            >
              Privacy &amp; Data Notice
            </button>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveLegalDoc('terms')}
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      <LegalModal activeDoc={activeLegalDoc} onClose={() => setActiveLegalDoc(null)} />
    </footer>
  );
};
