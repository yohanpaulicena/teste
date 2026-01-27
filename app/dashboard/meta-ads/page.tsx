"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { getCampaignTable, getKpis, getTimeSeries, getTopEntities } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette, placements } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function MetaAdsPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const kpis = useMemo(() => getKpis(filters, "meta"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "meta"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "meta"), [filters]);
  const highlights = useMemo(() => getTopEntities(filters, "meta"), [filters]);

  const performanceData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    spendPrev: series.spendPrev[index],
    results: series.leads[index],
    resultsPrev: series.leadsPrev[index],
  }));

  const viewMetrics = [
    { label: "25%", value: 62 },
    { label: "50%", value: 48 },
    { label: "75%", value: 31 },
    { label: "100%", value: 18 },
  ];

  return (
    <div className="space-y-6">
      <Header
        role={currentUser.role}
        clientName={currentUser.clientName}
        period={filters.period}
        lastUpdate="há 2 min"
        status="Conectado"
        summary={[
          { label: "Spend", value: formatCurrency(kpis.spend) },
          { label: "Resultados", value: formatNumber(kpis.leads) },
        ]}
      />
      <Tabs />
      <FiltersBar
        onChange={setFilters}
        showClient={currentUser.role === "admin"}
        showCampaignFilters
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento" value={formatCurrency(kpis.spend)} delta="+9%" />
        <KpiCard label="Resultados" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="Custo por resultado" value={formatCurrency(kpis.cpl)} delta="-4%" trend="down" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" trend="down" />
        <KpiCard label="CPM" value={formatCurrency(kpis.cpc * 12)} delta="+1%" />
        <KpiCard label="Mensagens" value={formatNumber(kpis.leads)} delta="+6%" />
        <KpiCard label="ROAS" value="3.2x" delta="+4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Investimento vs Resultados" description="Atual vs período anterior">
            <GradientAreaChart
              data={performanceData}
              formatter={(value, key) =>
                key.includes("spend") ? formatCurrency(value) : formatNumber(value)
              }
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Investimento" },
                {
                  key: "spendPrev",
                  color: "rgba(79, 209, 255, 0.4)",
                  fill: chartPalette.cyan,
                  dashed: true,
                  name: "Investimento (anterior)",
                },
                { key: "results", color: chartPalette.pink, fill: chartPalette.pink, name: "Resultados" },
                {
                  key: "resultsPrev",
                  color: "rgba(255, 79, 216, 0.4)",
                  fill: chartPalette.pink,
                  dashed: true,
                  name: "Resultados (anterior)",
                },
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
          <BarStackChart
            data={placements.map((p) => ({ label: p.name, value: p.value }))}
            bars={[{ key: "value", color: chartPalette.cyan }]}
          />
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
