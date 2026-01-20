"use client";

import { useState } from "react";
import { clientOptions, currentUser } from "@/lib/auth";

export const defaultFilters = {
  period: "30d",
  channel: "Todos",
  campaign: "Todas",
  objective: "Leads",
  clientId: currentUser.clientId,
};

const periodOptions = [
  { value: "hoje", label: "Hoje" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "mes", label: "Mês atual" },
  { value: "custom", label: "Custom" },
];

export type Filters = typeof defaultFilters;

export default function FiltersBar({
  onChange,
  showClient,
  initialFilters,
}: {
  onChange?: (filters: Filters) => void;
  showClient?: boolean;
  initialFilters?: Filters;
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters ?? defaultFilters);

  const updateFilter = (key: keyof Filters, value: string | number) => {
    const next = { ...filters, [key]: value } as Filters;
    setFilters(next);
    onChange?.(next);
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:grid-cols-5">
      {showClient && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Cliente</span>
          <select
            className="rounded-xl border border-white/10 bg-bg1/70 px-3 py-2 text-sm"
            value={filters.clientId}
            onChange={(event) => updateFilter("clientId", Number(event.target.value))}
          >
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Período</span>
        <select
          className="rounded-xl border border-white/10 bg-bg1/70 px-3 py-2 text-sm"
          value={filters.period}
          onChange={(event) => updateFilter("period", event.target.value)}
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Canal</span>
        <select
          className="rounded-xl border border-white/10 bg-bg1/70 px-3 py-2 text-sm"
          value={filters.channel}
          onChange={(event) => updateFilter("channel", event.target.value)}
        >
          {["Todos", "Meta", "Google", "Instagram", "Facebook"].map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Campanha</span>
        <select
          className="rounded-xl border border-white/10 bg-bg1/70 px-3 py-2 text-sm"
          value={filters.campaign}
          onChange={(event) => updateFilter("campaign", event.target.value)}
        >
          {["Todas", "Performance Max", "Lead Premium", "Retargeting"].map((campaign) => (
            <option key={campaign} value={campaign}>
              {campaign}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Objetivo</span>
        <select
          className="rounded-xl border border-white/10 bg-bg1/70 px-3 py-2 text-sm"
          value={filters.objective}
          onChange={(event) => updateFilter("objective", event.target.value)}
        >
          {["Leads", "Mensagens", "Tráfego", "Conversões"].map((objective) => (
            <option key={objective} value={objective}>
              {objective}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
