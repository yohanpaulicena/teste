"use client";

type FunnelStep = {
  label: string;
  value: string;
  color: string;
};

type FunnelRate = {
  label: string;
  value: string;
  formula: string;
};

export default function Funnel({
  steps,
  rates,
}: {
  steps: FunnelStep[];
  rates: FunnelRate[];
}) {
  return (
    <div className="relative">
      <svg viewBox="0 0 360 260" className="w-full h-[260px]">
        <defs>
          {steps.map((step, index) => (
            <linearGradient key={step.label} id={`funnel-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={step.color} stopOpacity={0.85} />
              <stop offset="100%" stopColor="#0b1020" stopOpacity={0.9} />
            </linearGradient>
          ))}
        </defs>
        <polygon points="40,30 320,30 280,95 80,95" fill="url(#funnel-0)" stroke="rgba(79,209,255,0.5)" strokeWidth="1.5" />
        <polygon points="70,105 290,105 250,170 110,170" fill="url(#funnel-1)" stroke="rgba(255,79,216,0.5)" strokeWidth="1.5" />
        <polygon points="100,180 260,180 220,235 140,235" fill="url(#funnel-2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />

        {steps.map((step, index) => {
          const y = index === 0 ? 60 : index === 1 ? 135 : 205;
          return (
            <g key={step.label}>
              <text x="180" y={y} textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="600">
                {step.label}
              </text>
              <text x="180" y={y + 18} textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700">
                {step.value}
              </text>
            </g>
          );
        })}

        {rates.map((rate, index) => {
          const y = index === 0 ? 92 : 167;
          return (
            <g key={rate.label}>
              <text x="330" y={y} textAnchor="end" fill="#94a3b8" fontSize="10">
                {rate.label}
                <title>{`${rate.formula} = ${rate.value}`}</title>
              </text>
              <text x="330" y={y + 14} textAnchor="end" fill="#4fd1ff" fontSize="14" fontWeight="600">
                {rate.value}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-400">Passe o mouse nas taxas para ver a fórmula.</p>
    </div>
  );
}
