import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProcessCanvasProps {
  activeStageIndex: number;
}

interface SimNode {
  x: number;
  y: number;
  scatterX: number;
  scatterY: number;
  angle: number;
  ringIdx: number;
  isSignal: boolean;
}

const NODE_COUNT = 84;

export const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ activeStageIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef(activeStageIndex);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    stageRef.current = activeStageIndex;
  }, [activeStageIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const nodes: SimNode[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const a = (i / NODE_COUNT) * Math.PI * 2;
      return {
        x: 0,
        y: 0,
        scatterX: Math.sin(i * 19.31) * 0.86,
        scatterY: Math.cos(i * 41.17) * 0.78,
        angle: a,
        ringIdx: i % 3,
        isSignal: i % 4 === 0,
      };
    });

    const pointer = { x: 0, y: 0, active: false };
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
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
    let initialized = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(Math.floor(rect.width * dpr), 1);
      canvas.height = Math.max(Math.floor(rect.height * dpr), 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawStage = (t: number, dt: number, snapImmediately: boolean) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) {
        return;
      }

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.34;
      const stage = stageRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background crosshairs & concentric instrument rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 18);
      ctx.lineTo(cx, h - 18);
      ctx.moveTo(24, cy);
      ctx.lineTo(w - 24, cy);
      ctx.stroke();

      ctx.strokeStyle =
        stage >= 4 ? 'rgba(183, 240, 89, 0.34)' : 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.stroke();

      // Stage 01 radar sweep
      if (stage === 0) {
        const sweep = t * 1.1;
        ctx.strokeStyle = 'rgba(183, 240, 89, 0.35)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweep) * radius * 1.15, cy + Math.sin(sweep) * radius * 1.15);
        ctx.stroke();
      }

      // Compute target positions per stage & smoothly interpolate nodes
      const lerpFactor = snapImmediately ? 1 : 1 - Math.exp(-dt * 5.2);

      nodes.forEach((node, idx) => {
        let tx = cx + node.scatterX * radius * 1.18;
        let ty = cy + node.scatterY * radius * 1.05;

        if (stage === 0) {
          tx += Math.sin(t * 0.8 + idx) * 8;
          ty += Math.cos(t * 0.7 + idx * 0.5) * 8;
        } else if (stage === 1) {
          // Hypothesize: coalesce into 3 candidate orbital clusters
          const clusterAngle = (node.ringIdx / 3) * Math.PI * 2 + t * 0.25;
          const clusterX = cx + Math.cos(clusterAngle) * radius * 0.58;
          const clusterY = cy + Math.sin(clusterAngle) * radius * 0.58;
          tx = clusterX + node.scatterX * radius * 0.35;
          ty = clusterY + node.scatterY * radius * 0.35;
        } else if (stage === 2) {
          // Model: snap onto precision dual hexagonal polygon manifolds
          const sides = 6;
          const stepAngle = Math.floor((idx / NODE_COUNT) * sides) * ((Math.PI * 2) / sides);
          const nextAngle = stepAngle + (Math.PI * 2) / sides;
          const localFrac = ((idx / NODE_COUNT) * sides) % 1;
          const polyR = node.ringIdx === 0 ? radius * 0.58 : radius * 0.96;
          const rot = t * 0.16;
          const ax = Math.cos(stepAngle + rot) * polyR;
          const ay = Math.sin(stepAngle + rot) * polyR;
          const bx = Math.cos(nextAngle + rot) * polyR;
          const by = Math.sin(nextAngle + rot) * polyR;
          tx = cx + ax + (bx - ax) * localFrac;
          ty = cy + ay + (by - ay) * localFrac;
        } else if (stage === 3) {
          // Test: stress-test envelope & out-of-sample wave band
          const bandOffset = Math.sin(node.angle * 3 - t * 1.9) * (radius * 0.18);
          const r = (node.ringIdx === 0 ? radius * 0.52 : radius * 0.9) + bandOffset;
          tx = cx + Math.cos(node.angle + t * 0.22) * r;
          ty = cy + Math.sin(node.angle + t * 0.22) * r;
        } else {
          // Validate: lock into concentric diamond & invariant inner star
          const sides = 4;
          const stepAngle = Math.floor((idx / NODE_COUNT) * sides) * ((Math.PI * 2) / sides);
          const nextAngle = stepAngle + (Math.PI * 2) / sides;
          const localFrac = ((idx / NODE_COUNT) * sides) % 1;
          const polyR = node.ringIdx === 0 ? radius * 0.45 : radius * 0.88;
          const rot = Math.PI * 0.25 + t * 0.08;
          const ax = Math.cos(stepAngle + rot) * polyR;
          const ay = Math.sin(stepAngle + rot) * polyR;
          const bx = Math.cos(nextAngle + rot) * polyR;
          const by = Math.sin(nextAngle + rot) * polyR;
          tx = cx + ax + (bx - ax) * localFrac;
          ty = cy + ay + (by - ay) * localFrac;
        }

        if (!initialized) {
          node.x = tx;
          node.y = ty;
        } else {
          node.x += (tx - node.x) * lerpFactor;
          node.y += (ty - node.y) * lerpFactor;
        }

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 75 && dist > 0.1) {
            const push = ((75 - dist) / 75) * 8;
            node.x += (dx / dist) * push;
            node.y += (dy / dist) * push;
          }
        }
      });
      initialized = true;

      // Draw structural edges for stages >= 1
      if (stage >= 1) {
        const maxDist = stage >= 2 ? 56 : 70;
        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j += 1) {
            const b = nodes[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * (stage === 4 ? 0.36 : 0.2);
              ctx.strokeStyle =
                a.isSignal && b.isSignal
                  ? `rgba(183, 240, 89, ${Math.min(alpha * 1.6, 0.58)})`
                  : `rgba(241, 242, 238, ${alpha})`;
              ctx.lineWidth = a.isSignal && b.isSignal ? 1.15 : 0.8;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Stage 04 stress envelope rings or Stage 05 invariant highlight
      if (stage === 3) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(183, 240, 89, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * (0.9 + Math.sin(t * 2.2) * 0.06), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (stage >= 4) {
        ctx.strokeStyle = 'rgba(183, 240, 89, 0.85)';
        ctx.fillStyle = 'rgba(183, 240, 89, 0.08)';
        ctx.lineWidth = 1.5;
        const rot = Math.PI * 0.25 + t * 0.08;
        ctx.beginPath();
        for (let k = 0; k < 4; k += 1) {
          const a = rot + (k * Math.PI) / 2;
          const px = cx + Math.cos(a) * radius * 0.45;
          const py = cy + Math.sin(a) * radius * 0.45;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.isSignal ? 2.8 : 1.7, 0, Math.PI * 2);
        ctx.fillStyle = node.isSignal ? '#B7F059' : 'rgba(241, 242, 238, 0.82)';
        ctx.fill();
      }

      // Origin anchor
      ctx.fillStyle = stage >= 4 ? '#B7F059' : '#F1F2EE';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    if (reducedMotion) {
      drawStage(1.2, 1, true);
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
      drawStage(elapsed, dt, false);
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
    <div className="process-diagram-panel__canvas-wrap">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
};
