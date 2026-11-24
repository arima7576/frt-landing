import React from 'react';

interface HeroFallbackProps {
  reason?: 'fallback' | 'reduced-motion';
}

export const HeroFallback: React.FC<HeroFallbackProps> = () => {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <svg
        className="hero-fallback__svg"
        viewBox="0 0 1100 740"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="frtAttractorWash" cx="50%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#B7F059" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8CA098" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#050607" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="550" cy="360" rx="480" ry="290" fill="url(#frtAttractorWash)" />

        {/* Stylized nonlinear trajectory loops (Aizawa-inspired SVG fallback) */}
        <path
          d="M550 180 C680 180, 820 260, 780 390 C740 520, 580 560, 440 480 C300 400, 320 240, 480 210 C640 180, 720 310, 620 430 C520 550, 380 460, 420 320 C450 215, 550 220, 550 350 C550 470, 535 530, 550 565"
          stroke="rgba(241, 242, 238, 0.28)"
          strokeWidth="1.2"
        />
        <path
          d="M550 205 C655 205, 785 280, 745 395 C705 510, 560 535, 455 465 C350 395, 365 255, 500 230 C635 205, 685 330, 600 420"
          stroke="rgba(183, 240, 89, 0.45)"
          strokeWidth="1.3"
        />

        <circle cx="600" cy="420" r="4" fill="#B7F059" />
        <circle cx="780" cy="390" r="2.5" fill="#F1F2EE" fillOpacity="0.7" />
        <circle cx="320" cy="340" r="2.5" fill="#F1F2EE" fillOpacity="0.7" />
      </svg>
    </div>
  );
};
