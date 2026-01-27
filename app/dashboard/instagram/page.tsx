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
import { audienceSplit, chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function InstagramPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const kpis = useMemo(() => getKpis(filters, "instagram"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "instagram"), [filters]);
  const posts = useMemo(() => getTopPosts(filters, "instagram"), [filters]);

  const growthData = series.labels.map((label, index) => ({
    label,
    followers: series.followers[index],
    followersPrev: series.followers[index] * 0.92,
    engagement: series.engagement[index],
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
          spend: formatNumber(kpis.followers),
          leads: formatNumber(kpis.clicks),
        }}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Seguidores" value={formatNumber(kpis.followers)} delta="+3%" />
        <KpiCard label="Engajamento" value={formatPercent(kpis.engagement)} delta="+4%" />
        <KpiCard label="Stories" value={formatNumber(58)} delta="+6%" />
        <KpiCard label="Reels" value={formatNumber(42)} delta="+5%" />
        <KpiCard label="Saves" value={formatNumber(1800)} delta="+7%" />
        <KpiCard label="Comentários" value={formatNumber(860)} delta="+2%" />
        <KpiCard label="Visitas" value={formatNumber(5200)} delta="+6%" />
        <KpiCard label="Cliques" value={formatNumber(960)} delta="+4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Crescimento & Engajamento" description="Timeline diária">
            <GradientAreaChart
              data={growthData}
              formatter={(value) => formatNumber(value)}
              lines={[
                { key: "followers", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Seguidores" },
                {
                  key: "followersPrev",
                  color: "rgba(79, 209, 255, 0.4)",
                  fill: chartPalette.cyan,
                  dashed: true,
                  name: "Seguidores (anterior)",
                },
                { key: "engagement", color: chartPalette.pink, fill: chartPalette.pink, name: "Engajamento" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Audiência por gênero" description="Distribuição">
          <DonutChart data={audienceSplit} colors={[chartPalette.pink, chartPalette.cyan, chartPalette.purple]} />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Formatos" description="Stories vs Reels">
          <BarStackChart
            data={[
              { label: "Stories", value: 72 },
              { label: "Reels", value: 88 },
              { label: "Feed", value: 64 },
            ]}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
        <ChartCard title="Horários de pico" description="Atividade por horário">
          <BarStackChart
            data={[
              { label: "09h", value: 32 },
              { label: "12h", value: 45 },
              { label: "15h", value: 53 },
              { label: "18h", value: 68 },
              { label: "21h", value: 57 },
            ]}
            bars={[{ key: "value", color: chartPalette.cyan }]}
          />
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
