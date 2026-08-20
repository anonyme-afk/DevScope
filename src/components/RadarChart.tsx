import React from 'react';
import { SkillsRadar } from '../types';

interface RadarChartProps {
  skills: SkillsRadar;
  size?: number;
}

const AXIS_CONFIG: { key: keyof SkillsRadar; label: string; shortLabel: string }[] = [
  { key: 'frontend', label: 'Frontend', shortLabel: 'Front' },
  { key: 'architectureDesign', label: 'Architecture', shortLabel: 'Archi' },
  { key: 'backend', label: 'Backend', shortLabel: 'Back' },
  { key: 'devopsCloud', label: 'DevOps & Cloud', shortLabel: 'Cloud' },
  { key: 'systemsAlgorithms', label: 'Systèmes & Algo', shortLabel: 'Système' },
  { key: 'aiDataEngineering', label: 'Data Engineering', shortLabel: 'Data' },
  { key: 'openSourceImpact', label: 'Impact Open Source', shortLabel: 'OSS' },
  { key: 'codeQualityDocs', label: 'Qualité & Docs', shortLabel: 'Docs' },
];

export const RadarChart: React.FC<RadarChartProps> = ({ skills, size = 340 }) => {
  const center = size / 2;
  const radius = (size - 90) / 2;
  const numAxes = AXIS_CONFIG.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to compute points on polygon
  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueNormalized;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for skill values
  const points = AXIS_CONFIG.map((axis, i) => {
    const rawVal = skills[axis.key] || 50;
    const normalized = Math.min(1, Math.max(0.1, rawVal / 100));
    return getCoordinates(normalized, i);
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Polygons */}
        {levels.map((level, lvlIndex) => {
          const levelPoints = AXIS_CONFIG.map((_, i) => getCoordinates(level, i));
          const levelPath = levelPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={`level-${lvlIndex}`}
              d={levelPath}
              fill="none"
              stroke="#334155"
              strokeWidth={lvlIndex === levels.length - 1 ? '1.5' : '1'}
              strokeDasharray={lvlIndex < levels.length - 1 ? '3 3' : undefined}
              className="opacity-40"
            />
          );
        })}

        {/* Axis Lines */}
        {AXIS_CONFIG.map((_, i) => {
          const outer = getCoordinates(1.0, i);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#334155"
              strokeWidth="1"
              className="opacity-50"
            />
          );
        })}

        {/* Data Polygon Fill & Stroke */}
        <path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="2.5"
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertices */}
        {points.map((p, i) => {
          const val = skills[AXIS_CONFIG[i].key];
          return (
            <g key={`vertex-${i}`} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#06b6d4"
                stroke="#0f172a"
                strokeWidth="2"
                className="transition-all duration-300 group-hover:r-6"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="#22d3ee"
                className="opacity-0 group-hover:opacity-25 transition-opacity"
              />
            </g>
          );
        })}

        {/* Axis Labels & Values */}
        {AXIS_CONFIG.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 28;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          const val = skills[axis.key] || 0;

          // Text anchors
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <g key={`label-${axis.key}`} transform={`translate(${x}, ${y})`}>
              <text
                textAnchor={textAnchor}
                dy="0.3em"
                className="fill-slate-300 font-sans text-[11px] font-medium tracking-tight"
              >
                {axis.label}
              </text>
              <text
                textAnchor={textAnchor}
                dy="1.5em"
                className="fill-cyan-400 font-mono text-[10px] font-bold"
              >
                {val}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
