import React, { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/content';

interface NavbarProps {
  activeSection: string | null;
  onStartConversation: () => void;
}

export const BrandLogoMark: React.FC<{ variant?: 'dark' | 'light' }> = ({ variant = 'dark' }) => {
  const stroke = variant === 'light' ? '#07090B' : '#F1F2EE';
  const frameStroke = variant === 'light' ? 'rgba(7, 9, 11, 0.26)' : 'rgba(241, 242, 238, 0.28)';
  const dotFill = variant === 'light' ? '#5E8A18' : '#B7F059';

  return (
    <svg
      className="brand-mark__glyph"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="21" height="21" stroke={frameStroke} strokeWidth="1" />
      <path d="M6.5 6.5H17.5M6.5 6.5V17.5M6.5 12H14" stroke={stroke} strokeWidth="1.6" />
      <rect x="15.5" y="15.5" width="2.5" height="2.5" fill={dotFill} />
    </svg>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onStartConversation }) => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(Math.max(y / maxScroll, 0), 1) : 0);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleMobileLinkClick = () => {
    setMobileOpen(false);
  };

  const handleMobileCta = () => {
    setMobileOpen(false);
    onStartConversation();
  };

  return (
    <header
      className={`site-header${scrolled ? ' site-header--scrolled' : ''}${
        mobileOpen ? ' site-header--menu-open' : ''
      }`}
    >
      <div className="floating-nav-wrap">
        <div className="floating-nav">
          <div
            className="scroll-progress"
            style={{ width: '100%', transform: `scaleX(${progress})` }}
            aria-hidden="true"
          />

          <a href="#top" className="brand-mark" aria-label="FRT Home">
            <BrandLogoMark />
            <span>FRT</span>
          </a>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`nav-link${isActive ? ' nav-link--active' : ''}`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={onStartConversation}
            >
              Start a Conversation
            </button>

            <button
              type="button"
              className="nav-mobile-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {mobileOpen ? (
                  <path
                    d="M3.5 3.5L14.5 14.5M14.5 3.5L3.5 14.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                ) : (
                  <path d="M2 5.5H16M2 12.5H16" stroke="currentColor" strokeWidth="1.4" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-drawer" className="mobile-drawer" role="dialog" aria-label="Navigation">
          <ul className="mobile-drawer__list">
            {NAV_ITEMS.map((item, idx) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="mobile-drawer__link"
                  onClick={handleMobileLinkClick}
                >
                  <span>{item.label}</span>
                  <span className="mobile-drawer__index">0{idx + 1}</span>
                </a>
              </li>
            ))}
          </ul>

          <button type="button" className="btn btn--primary" onClick={handleMobileCta}>
            Start a Conversation
          </button>
        </div>
      )}
    </header>
  );
};
