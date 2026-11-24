import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface DisciplineVisualProps {
  id: string;
}

const META_LABELS: Record<string, { left: string; right: string }> = {
  'quantitative-research': {
    left: 'REGIME ENVELOPE',
    right: 'STATISTICAL ASYMMETRY',
  },
  'applied-ai-intelligence': {
    left: 'INFERENCE GRAPH',
    right: 'SIGNAL ROUTING',
  },
  'business-analytics': {
    left: 'FACTOR MATRIX',
    right: 'DRIVER DECOMPOSITION',
  },
};

export const DisciplineVisual: React.FC<DisciplineVisualProps> = ({ id }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const labels = META_LABELS[id] ?? META_LABELS['quantitative-research'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let rafId = 0;
    let isVisible = true;
    let elapsed = 0;
    let lastTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(Math.floor(rect.width * dpr), 1);
      canvas.height = Math.max(Math.floor(rect.height * dpr), 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawQuantitative = (t: number, w: number, h: number) => {
      // Subtle coordinate axis lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r += 1) {
        const y = (h / 4) * r;
        ctx.beginPath();
        ctx.moveTo(12, y);
        ctx.lineTo(w - 12, y);
        ctx.stroke();
      }

      // Multi-horizon regime waveforms
      for (let layer = 0; layer < 4; layer += 1) {
        ctx.beginPath();
        for (let x = 14; x <= w - 14; x += 6) {
          const norm = (x - 14) / (w - 28);
          const env = Math.sin(norm * Math.PI);
          const y =
            h * 0.52 +
            Math.sin(norm * 6.5 - t * (0.95 + layer * 0.18) + layer * 0.9) * (24 * env) +
            Math.cos(norm * 13 + t * 0.6) * (8 * env);
          if (x === 14) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle =
          layer === 0 ? 'rgba(183, 240, 89, 0.85)' : `rgba(241, 242, 238, ${0.42 - layer * 0.09})`;
        ctx.lineWidth = layer === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      // Highlighted inflection cursor scanning horizontally
      const scanNorm = (Math.sin(t * 0.55) + 1) * 0.5;
      const sx = 24 + scanNorm * (w - 48);
      const env = Math.sin(((sx - 14) / (w - 28)) * Math.PI);
      const sy =
        h * 0.52 +
        Math.sin(((sx - 14) / (w - 28)) * 6.5 - t * 0.95) * (24 * env) +
        Math.cos(((sx - 14) / (w - 28)) * 13 + t * 0.6) * (8 * env);

      ctx.strokeStyle = 'rgba(183, 240, 89, 0.25)';
      ctx.beginPath();
      ctx.moveTo(sx, 14);
      ctx.lineTo(sx, h - 14);
      ctx.stroke();

      ctx.fillStyle = '#B7F059';
      ctx.beginPath();
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawAppliedAi = (t: number, w: number, h: number) => {
      const cols = [0.16, 0.42, 0.68, 0.88];
      const rowsByCol = [
        [0.24, 0.5, 0.76],
        [0.18, 0.4, 0.62, 0.84],
        [0.3, 0.54, 0.78],
        [0.5],
      ];

      const pointsByCol = cols.map((cx, cIdx) =>
        rowsByCol[cIdx].map((ry) => ({ x: cx * w, y: ry * h })),
      );

      // Draw edges and flowing signal pulses
      let edgeIdx = 0;
      for (let c = 0; c < pointsByCol.length - 1; c += 1) {
        const left = pointsByCol[c];
        const right = pointsByCol[c + 1];
        for (const a of left) {
          for (const b of right) {
            edgeIdx += 1;
            const isActivePath = edgeIdx % 3 === 0;
            ctx.strokeStyle = isActivePath
              ? 'rgba(183, 240, 89, 0.34)'
              : 'rgba(255, 255, 255, 0.11)';
            ctx.lineWidth = isActivePath ? 1.15 : 0.85;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (isActivePath) {
              const progress = (t * 0.65 + edgeIdx * 0.27) % 1;
              const px = a.x + (b.x - a.x) * progress;
              const py = a.y + (b.y - a.y) * progress;
              ctx.fillStyle = '#B7F059';
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      pointsByCol.forEach((col, cIdx) => {
        for (const pt of col) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, cIdx === 3 ? 4.5 : 3.2, 0, Math.PI * 2);
          ctx.fillStyle = cIdx === 3 ? '#B7F059' : '#050607';
          ctx.fill();
          ctx.strokeStyle = cIdx === 3 ? '#B7F059' : 'rgba(241, 242, 238, 0.72)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
    };

    const drawBusinessAnalytics = (t: number, w: number, h: number) => {
      const cols = 7;
      const rows = 4;
      const padX = 24;
      const padY = 20;
      const cellW = (w - padX * 2) / cols;
      const cellH = (h - padY * 2) / rows;
      const scanX = padX + ((t * 58) % (w - padX * 2));

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = padX + c * cellW;
          const y = padY + r * cellH;
          const isDriver = (r === 1 && c === 3) || (r === 2 && c === 4) || (r === 1 && c === 5);
          const distScan = Math.abs(x + cellW * 0.5 - scanX);
          const pulse = Math.max(0, 1 - distScan / 65);

          if (isDriver) {
            ctx.fillStyle = `rgba(183, 240, 89, ${0.14 + pulse * 0.24})`;
            ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
            ctx.strokeStyle = `rgba(183, 240, 89, ${0.48 + pulse * 0.45})`;
          } else {
            ctx.fillStyle = `rgba(241, 242, 238, ${0.02 + pulse * 0.06})`;
            ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          }
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);

          if (isDriver) {
            ctx.fillStyle = '#B7F059';
            ctx.beginPath();
            ctx.arc(x + cellW * 0.5, y + cellH * 0.5, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Sweeping diagnostic scan line
      ctx.strokeStyle = 'rgba(183, 240, 89, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, padY - 6);
      ctx.lineTo(scanX, h - padY + 6);
      ctx.stroke();
    };

    const drawFrame = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) {
        return;
      }
      ctx.clearRect(0, 0, w, h);

      if (id === 'quantitative-research') {
        drawQuantitative(t, w, h);
      } else if (id === 'applied-ai-intelligence') {
        drawAppliedAi(t, w, h);
      } else {
        drawBusinessAnalytics(t, w, h);
      }
    };

    if (reducedMotion) {
      drawFrame(1.2);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    const loop = (now: number) => {
      rafId = 0;
      if (!isVisible || document.visibilityState !== 'visible') {
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
      drawFrame(elapsed);
      rafId = window.requestAnimationFrame(loop);
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisible = Boolean(entries[0]?.isIntersecting);
              if (isVisible && rafId === 0) {
                lastTime = performance.now();
                rafId = window.requestAnimationFrame(loop);
              } else if (!isVisible && rafId !== 0) {
                window.cancelAnimationFrame(rafId);
                rafId = 0;
              }
            },
            { threshold: 0.02 },
          )
        : null;

    observer?.observe(canvas);
    rafId = window.requestAnimationFrame(loop);

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [id, reducedMotion]);

  return (
    <div className="discipline-visual-box arch-frame">
      <div className="discipline-visual-box__bar">
        <span>{labels.left}</span>
        <span className="discipline-visual-box__bar-accent">{labels.right}</span>
      </div>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
};
