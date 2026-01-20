import { ReactNode } from "react";

export default function KpiCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon?: ReactNode;
}) {
  return (
    <div className="glow-border card-hover">
      <div className="rounded-[1.15rem] bg-night-800/80 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
          {icon && <span className="text-neon-cyan">{icon}</span>}
        </div>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-2 text-xs text-slate-400">
          <span className="text-neon-cyan font-semibold">{delta}</span> vs período anterior
        </p>
      </div>
    </div>
  );
}
