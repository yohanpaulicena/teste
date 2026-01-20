import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

export default function KpiCard({
  label,
  value,
  delta,
  trend = "up",
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  trend?: "up" | "down";
  icon?: ReactNode;
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-neonCyan" : "text-neonPink";

  return (
    <div className="border-neon-gradient glow-hover">
      <div className="card-glass rounded-[1.15rem] p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
          {icon && <span className="text-neonCyan">{icon}</span>}
        </div>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        <p className={`mt-2 flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          {delta}
          <span className="text-slate-400">vs período anterior</span>
        </p>
      </div>
    </div>
  );
}
