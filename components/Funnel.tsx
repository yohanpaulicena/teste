import { ArrowDown } from "lucide-react";

export default function Funnel({
  steps,
}: {
  steps: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-4">
          <div className="flex-1 rounded-2xl border border-neon-cyan/40 bg-night-700/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{step.label}</p>
            <p className="text-xl font-semibold text-white">{step.value}</p>
          </div>
          {index < steps.length - 1 && <ArrowDown className="text-neon-pink" />}
        </div>
      ))}
    </div>
  );
}
