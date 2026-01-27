"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart, DonutChart } from "@/components/Charts";
import { getKpis, getTimeSeries, getTopPosts } from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/format";
import { audienceSplit, chartPalette, weekdays } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function FacebookPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const kpis = useMemo(() => getKpis(filters, "facebook"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "facebook"), [filters]);
  const posts = useMemo(() => getTopPosts(filters, "facebook"), [filters]);

  const engagementData = series.labels.map((label, index) => ({
    label,
    reach: series.reach[index],
    engagement: series.engagement[index],
    engagementPrev: series.engagement[index] * 0.92,
  }));
  const activeDays = weekdays.map((label, index) => ({
    label,
    posts: Math.round(series.followers[index] ?? 40),
  }));

  return (
    <div className="space-y-6">
      <Header
        role={currentUser.role}
        clientName={currentUser.clientName}
        period={filters.period}
        lastUpdate="há 2 min"
        status="Conectado"
        summary={{
          spend: formatNumber(kpis.impressions),
          leads: formatNumber(kpis.clicks),
        }}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Seguidores" value={formatNumber(kpis.followers)} delta="+2%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach)} delta="+4%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+5%" />
        <KpiCard label="Interações" value={formatNumber(kpis.clicks)} delta="+6%" />
        <KpiCard label="Engajamento" value={formatPercent(kpis.engagement)} delta="+3%" />
        <KpiCard label="Vídeos" value={formatNumber(86)} delta="+4%" />
        <KpiCard label="Compartilhamentos" value={formatNumber(640)} delta="+6%" />
        <KpiCard label="Cliques" value={formatNumber(980)} delta="+5%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Alcance & Interações" description="Timeline diária">
            <GradientAreaChart
              data={engagementData}
              formatter={(value) => formatNumber(value)}
              lines={[
                { key: "reach", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Alcance" },
                { key: "engagement", color: chartPalette.pink, fill: chartPalette.pink, name: "Interações" },
                {
                  key: "engagementPrev",
                  color: "rgba(255, 79, 216, 0.4)",
                  fill: chartPalette.pink,
                  dashed: true,
                  name: "Interações (anterior)",
                },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Dias mais ativos" description="Publicações por dia">
          <BarStackChart data={activeDays} bars={[{ key: "posts", color: chartPalette.purple }]} />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Audiência por gênero" description="Distribuição">
          <DonutChart data={audienceSplit} colors={[chartPalette.pink, chartPalette.cyan, chartPalette.purple]} />
        </ChartCard>
        <ChartCard title="Top locais" description="Área preparada">
          <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-400">
            Placeholder para mapa / top cidades.
          </div>
        </ChartCard>
      </section>

      <DataTable
        columns={["Post", "Data", "Alcance", "Engajamento", "Saves", "Shares", "Comentários", "Cliques"]}
        rows={posts.map((row) => [
          row.name,
          row.date,
          formatNumber(row.reach),
          formatPercent(row.engagement),
          formatNumber(row.saves),
          formatNumber(row.shares),
          formatNumber(row.comments),
          formatNumber(row.clicks),
        ])}
      />
    </div>
  );
}
