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
            <h3 className="footer-card__title">Capabilities</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#quantitative-research" className="footer-card__link">
                  Quantitative Research
                </a>
              </li>
              <li>
                <a href="#applied-ai-data-science" className="footer-card__link">
                  Applied AI &amp; Data Science
                </a>
              </li>
              <li>
                <a href="#business-intelligence-solutions" className="footer-card__link">
                  Business Intelligence &amp; Solutions
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-card">
            <h3 className="footer-card__title">Practice</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#perspective" className="footer-card__link">
                  About FRT
                </a>
              </li>
              <li>
                <a href="#process" className="footer-card__link">
                  Research Process
                </a>
              </li>
              <li>
                <a href="#team" className="footer-card__link">
                  Team
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-card">
            <h3 className="footer-card__title">Fluid Research &amp; Technologies</h3>
            <ul className="footer-card__links">
              <li>
                <a href="#horizon" className="footer-card__link">
                  Future Direction
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-card__link">
                  Discuss a Project
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

        {/* High-Contrast Alabaster Brand Plate */}
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
            <strong>{COMPANY_INFO.legalName}</strong> ({COMPANY_INFO.shortName}) is an independent
            quantitative research and applied AI company—combining mathematics, statistics,
            financial research, data science, and AI to deliver practical tools, rigorous insights,
            and analytical solutions.
          </p>

          <div className="footer-brand-plate__bottom">
            <a href="#perspective" className="footer-brand-plate__link">
              About FRT →
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
