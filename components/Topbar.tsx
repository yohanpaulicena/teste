"use client";

import { RefreshCw, Download } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Painel do cliente</p>
        <h1 className="text-2xl font-semibold">Cliente X • Relatório Premium</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:text-white">
          Exportar CSV/PDF <Download className="ml-2 inline h-4 w-4" />
        </button>
        <button className="rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-pink px-4 py-2 text-sm font-semibold text-night-900 shadow-glow">
          Atualizar <RefreshCw className="ml-2 inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
