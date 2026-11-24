import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HERO_CONTENT } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const ManifestoBand: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0.14);

  const words = useMemo(() => HERO_CONTENT.manifesto.split(' '), []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    const updateProgress = () => {
      const el = sectionRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 900;
      // Reveal words smoothly from the bottom edge through upper-middle of viewport
      const raw = (viewH * 0.88 - rect.top) / (viewH * 0.65);
      setProgress(Math.min(Math.max(raw, 0.08), 1));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [reducedMotion]);

  const activeWordLimit = Math.ceil(progress * words.length);

  return (
    <section id="manifesto" ref={sectionRef} className="manifesto-band" aria-label="Research statement">
      <div className="container">
        <p className="manifesto-statement">
          {words.map((word, idx) => (
            <React.Fragment key={`${word}-${idx}`}>
              <span
                className={`manifesto-word${idx < activeWordLimit ? ' manifesto-word--lit' : ''}`}
              >
                {word}
              </span>{' '}
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
};
