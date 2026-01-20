"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getCampaignTable,
  getKpis,
  getTimeSeries,
  getTopEntities,
} from "@/lib/data";
import { chartPalette, placements } from "@/data/mock";

export default function MetaAdsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const kpis = useMemo(() => getKpis(filters, "meta"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "meta"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "meta"), [filters]);
  const highlights = useMemo(() => getTopEntities(filters, "meta"), [filters]);

  const performanceData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    results: series.leads[index],
  }));

  const viewMetrics = [
    { label: "25%", value: 62 },
    { label: "50%", value: 48 },
    { label: "75%", value: 31 },
    { label: "100%", value: 18 },
  ];

  return (
    <div className="space-y-6">
      <Topbar />
      <FiltersBar onChange={setFilters} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento" value={formatCurrency(kpis.spend)} delta="+9%" />
        <KpiCard label="Resultados" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="Custo por resultado" value={formatCurrency(kpis.cpl)} delta="-4%" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" />
        <KpiCard label="CPM" value={formatCurrency(kpis.cpc * 12)} delta="+1%" />
        <KpiCard label="Mensagens" value={formatNumber(kpis.leads)} delta="+6%" />
        <KpiCard label="ROAS" value="3.2x" delta="+4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Investimento vs Resultados" description="Performance diária">
            <GradientAreaChart
              data={performanceData}
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan },
                { key: "results", color: chartPalette.pink, fill: chartPalette.pink },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Vídeo views" description="Compleção de vídeo">
          <BarStackChart
            data={viewMetrics.map((metric) => ({ label: metric.label, value: metric.value }))}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Posicionamentos" description="Distribuição de budget">
          <BarStackChart data={placements.map((p) => ({ label: p.name, value: p.value }))} bars={[{ key: "value", color: chartPalette.cyan }]} />
        </ChartCard>
        <TopEntities title="Melhores anúncios" items={highlights} />
        <TopEntities title="Melhor dia" items={highlights} />
      </section>

      <DataTable
        columns={["Campanha", "Plataforma", "Spend", "Impressões", "Cliques", "CTR", "CPC", "Leads", "CPL", "Status"]}
        rows={campaigns.map((row) => [
          row.name,
          "Meta",
          formatCurrency(row.spend),
          formatNumber(row.impressions),
          formatNumber(row.clicks),
          formatPercent(row.ctr),
          formatCurrency(row.cpc),
          formatNumber(row.leads),
          formatCurrency(row.cpl),
          row.status,
        ])}
      />
    </div>
  );
}
