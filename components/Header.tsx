"use client";

import { ReactNode } from "react";
import { Download, RefreshCw, Settings } from "lucide-react";
import type { Role } from "@/lib/auth";

const periodLabels: Record<string, string> = {
  hoje: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  mes: "Mês atual",
  custom: "Custom",
};

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  hidden?: boolean;
};

type ContextChipProps = {
  label: string;
  value: string;
  accent?: "cyan" | "pink" | "green";
};

function ActionButton({ icon, label, hidden }: ActionButtonProps) {
  if (hidden) return null;
  return (
    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-neonCyan/60 hover:text-white">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}

function ContextChip({ label, value, accent = "cyan" }: ContextChipProps) {
  const accentClasses = {
    cyan: "border-neonCyan/40 text-neonCyan",
    pink: "border-neonPink/40 text-neonPink",
    green: "border-emerald-400/40 text-emerald-300",
  };

  return (
    <div className={`rounded-full border px-3 py-1 text-xs ${accentClasses[accent]} bg-white/5`}
    >
      <span className="text-slate-400 mr-1">{label}:</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

export default function Header({
  role,
  clientName,
  period,
  lastUpdate,
  status,
  summary,
}: {
  role: Role;
  clientName: string;
  period: string;
  lastUpdate: string;
  status: string;
  summary: Array<{ label: string; value: string }>;
}) {
  const periodLabel = periodLabels[period] ?? period;

  return (
    <header className="sticky top-4 z-20">
      <div className="card-glass rounded-3xl border border-white/10 bg-gradient-to-br from-bg1/80 via-bg0/90 to-black p-6 shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-neonCyan to-neonPink flex items-center justify-center font-bold text-bg0">
                P
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Premium Analytics Suite
                </p>
                <h2 className="text-lg font-semibold text-white">Personaliza Analytics</h2>
              </div>
            </div>
            <div className="hidden flex-wrap gap-2 lg:flex">
              <ActionButton icon={<RefreshCw className="h-4 w-4" />} label="Atualizar" />
              <ActionButton icon={<Download className="h-4 w-4" />} label="Exportar" />
              <ActionButton
                icon={<Settings className="h-4 w-4" />}
                label="Configurar"
                hidden={role !== "admin"}
              />
            </div>
            <details className="lg:hidden">
              <summary className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                Ações
              </summary>
              <div className="mt-2 flex flex-col gap-2">
                <ActionButton icon={<RefreshCw className="h-4 w-4" />} label="Atualizar" />
                <ActionButton icon={<Download className="h-4 w-4" />} label="Exportar" />
                <ActionButton
                  icon={<Settings className="h-4 w-4" />}
                  label="Configurar"
                  hidden={role !== "admin"}
                />
              </div>
            </details>
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-white">Dashboard de Social & Tráfego Pago</h1>
            <p className="mt-2 text-sm text-slate-400">
              Dados consolidados por canal + comparativo com período anterior.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ContextChip label="Cliente" value={clientName} />
            <ContextChip label="Período" value={periodLabel} />
            <ContextChip label="Atualização" value={lastUpdate} />
            <ContextChip label="Status" value={status} accent="green" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
