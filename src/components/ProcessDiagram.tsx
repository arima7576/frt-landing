import React from 'react';

interface ProcessDiagramProps {
  activeStageIndex: number;
}

const NODE_COORDS = [
  { x: 96, y: 112 },
  { x: 170, y: 74 },
  { x: 244, y: 118 },
  { x: 232, y: 214 },
  { x: 170, y: 264 },
  { x: 108, y: 214 },
] as const;

export const ProcessDiagram: React.FC<ProcessDiagramProps> = ({ activeStageIndex }) => {
  const showHypothesisLinks = activeStageIndex >= 1;
  const showModelPolygon = activeStageIndex >= 2;
  const showTestEnvelope = activeStageIndex >= 3;
  const showValidatedCore = activeStageIndex >= 4;

  return (
    <svg
      className="process-diagram-svg"
      viewBox="0 0 340 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Coordinate grid reference */}
      <line x1="170" y1="22" x2="170" y2="318" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <line x1="22" y1="170" x2="318" y2="170" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Outer perimeter ring */}
      <circle
        cx="170"
        cy="170"
        r="128"
        stroke={showValidatedCore ? 'rgba(183, 240, 89, 0.45)' : 'rgba(255, 255, 255, 0.12)'}
        strokeWidth="1"
        strokeDasharray={activeStageIndex === 0 ? '4 6' : undefined}
      />

      {/* Stage 01: Observation reticle & dispersed field points */}
      <circle cx="64" cy="96" r="1.5" fill="rgba(241,242,238,0.28)" />
      <circle cx="276" cy="88" r="1.5" fill="rgba(241,242,238,0.28)" />
      <circle cx="72" cy="248" r="1.5" fill="rgba(241,242,238,0.28)" />
      <circle cx="268" cy="242" r="1.5" fill="rgba(241,242,238,0.28)" />
      <circle
        cx="170"
        cy="170"
        r="46"
        stroke="rgba(241,242,238,0.18)"
        strokeWidth="0.9"
        strokeDasharray="2 4"
      />

      {/* Stage 02: Hypothesis candidate links */}
      <g opacity={showHypothesisLinks ? 1 : 0.15} style={{ transition: 'opacity 320ms ease' }}>
        <line
          x1={NODE_COORDS[0].x}
          y1={NODE_COORDS[0].y}
          x2={NODE_COORDS[2].x}
          y2={NODE_COORDS[2].y}
          stroke="rgba(241,242,238,0.28)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1={NODE_COORDS[1].x}
          y1={NODE_COORDS[1].y}
          x2={NODE_COORDS[4].x}
          y2={NODE_COORDS[4].y}
          stroke="rgba(183,240,89,0.42)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1={NODE_COORDS[5].x}
          y1={NODE_COORDS[5].y}
          x2={NODE_COORDS[3].x}
          y2={NODE_COORDS[3].y}
          stroke="rgba(241,242,238,0.28)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      </g>

      {/* Stage 03: Mathematical Model Hull */}
      <polygon
        points={NODE_COORDS.map((p) => `${p.x},${p.y}`).join(' ')}
        stroke="#F1F2EE"
        strokeOpacity={showModelPolygon ? 0.72 : 0.12}
        strokeWidth="1.15"
        fill={showModelPolygon ? 'rgba(241, 242, 238, 0.03)' : 'none'}
        style={{ transition: 'all 340ms ease' }}
      />

      {/* Stage 04: Out-of-Sample Stress Envelope */}
      <circle
        cx="170"
        cy="170"
        r="96"
        stroke="#B7F059"
        strokeOpacity={showTestEnvelope ? 0.48 : 0}
        strokeWidth="1"
        strokeDasharray="6 3"
        style={{ transition: 'stroke-opacity 340ms ease' }}
      />

      {/* Stage 05: Validated Invariant Core */}
      <polygon
        points="170,118 222,170 170,222 118,170"
        stroke="#B7F059"
        strokeOpacity={showValidatedCore ? 0.95 : 0.14}
        strokeWidth={showValidatedCore ? 1.5 : 0.9}
        fill={showValidatedCore ? 'rgba(183, 240, 89, 0.10)' : 'none'}
        style={{ transition: 'all 360ms ease' }}
      />

      {/* Primary manifold vertices */}
      {NODE_COORDS.map((pt, idx) => (
        <circle
          key={`${pt.x}-${pt.y}`}
          cx={pt.x}
          cy={pt.y}
          r={activeStageIndex >= 2 ? 3.5 : 2.8}
          fill={idx % 2 === 0 && activeStageIndex >= 1 ? '#B7F059' : '#F1F2EE'}
          fillOpacity={activeStageIndex === 0 && idx > 2 ? 0.45 : 0.9}
        />
      ))}

      {/* Origin center marker */}
      <circle
        cx="170"
        cy="170"
        r={showValidatedCore ? 4.5 : 3}
        fill={showValidatedCore ? '#B7F059' : '#F1F2EE'}
      />
    </svg>
  );
};
