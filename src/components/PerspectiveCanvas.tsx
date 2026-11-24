import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NodeSeed {
  xNorm: number;
  yNoise: number;
  harmonicIndex: number;
  phase: number;
  isSignal: boolean;
}

export const PerspectiveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const count = 170;
    const seeds: NodeSeed[] = Array.from({ length: count }, (_, i) => ({
      xNorm: ((i * 73) % 1000) / 1000,
      yNoise: Math.sin(i * 12.9898) * 0.42,
      harmonicIndex: i % 3,
      phase: (i * 0.6180339) % (Math.PI * 2),
      isSignal: i % 6 === 0,
    }));

    const pointer = { x: -999, y: -999, active: false };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

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

    const drawFrame = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle vertical measurement rails inside the phase transition box
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;
      for (let g = 1; g < 6; g += 1) {
        const gx = (width / 6) * g;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // Draw harmonic reference bands emerging toward the right
      for (let band = 0; band < 3; band += 1) {
        ctx.beginPath();
        for (let px = 0; px <= width; px += 12) {
          const t = px / width;
          const coherence = Math.pow(t, 1.5);
          const freq = 0.012 + band * 0.004;
          const amp = (18 + band * 12) * coherence;
          const y =
            height * 0.5 +
            (band - 1) * 28 * coherence +
            Math.sin(px * freq - time * (0.9 + band * 0.25) + band) * amp;
          if (px === 0) {
            ctx.moveTo(px, y);
          } else {
            ctx.lineTo(px, y);
          }
        }
        ctx.strokeStyle =
          band === 1 ? 'rgba(183, 240, 89, 0.34)' : 'rgba(241, 242, 238, 0.14)';
        ctx.lineWidth = band === 1 ? 1.3 : 1;
        ctx.stroke();
      }

      // Compute node coordinates interpolating from stochastic scatter (left) to harmonic orbits (right)
      const computedNodes: Array<{ x: number; y: number; isSignal: boolean; coherence: number }> = [];

      for (const seed of seeds) {
        const x = ((seed.xNorm + time * 0.025) % 1) * width;
        const t = x / width;
        const coherence = Math.pow(t, 1.35);

        const freq = 0.012 + seed.harmonicIndex * 0.004;
        const amp = 18 + seed.harmonicIndex * 12;
        const targetY =
          height * 0.5 +
          (seed.harmonicIndex - 1) * 28 +
          Math.sin(x * freq - time * (0.9 + seed.harmonicIndex * 0.25) + seed.harmonicIndex) * amp;

        const driftY =
          height * 0.5 +
          seed.yNoise * height * 0.78 +
          Math.sin(time * 0.8 + seed.phase) * 14 * (1 - coherence);

        let y = driftY * (1 - coherence) + targetY * coherence;

        // Interactive cursor inquiry lens
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const pull = (1 - dist / 110) * 0.55;
            y = y * (1 - pull) + targetY * pull;
          }
        }

        computedNodes.push({ x, y, isSignal: seed.isSignal, coherence });
      }

      // Draw inquiry lens reticle if pointer is hovering
      if (pointer.active) {
        ctx.strokeStyle = 'rgba(183, 240, 89, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 76, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Link correlated signal nodes
      for (let i = 0; i < computedNodes.length; i += 1) {
        const a = computedNodes[i];
        if (!a.isSignal) {
          continue;
        }
        for (let j = i + 1; j < computedNodes.length; j += 1) {
          const b = computedNodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 64 && (a.coherence > 0.35 || pointer.active)) {
            ctx.strokeStyle = `rgba(183, 240, 89, ${(1 - dist / 64) * 0.28})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Render particles
      for (const node of computedNodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.isSignal ? 2.2 : 1.3, 0, Math.PI * 2);
        if (node.isSignal) {
          ctx.fillStyle = `rgba(183, 240, 89, ${0.42 + node.coherence * 0.52})`;
        } else {
          ctx.fillStyle = `rgba(241, 242, 238, ${0.22 + node.coherence * 0.45})`;
        }
        ctx.fill();
      }
    };

    if (reducedMotion) {
      drawFrame(1.4);
      return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerleave', handlePointerLeave);
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
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reducedMotion]);

  return (
    <div className="perspective-canvas-wrap">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
};
