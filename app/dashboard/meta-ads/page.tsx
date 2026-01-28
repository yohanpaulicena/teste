"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";
import { useAvailability } from "@/components/AvailabilityProvider";
import { useDashboardData } from "@/lib/useDashboardData";
import { useSourceGuard } from "@/lib/useSourceGuard";
import { buildFunnel } from "@/lib/funnel";
import Funnel from "@/components/Funnel";

export default function MetaAdsPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["meta_ads"],
    metrics: ["spend", "messaging_first_reply", "video_view", "post_engagement"],
  });

  useSourceGuard("meta_ads");

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const performanceSeries = useMemo(() => {
    const spend = series.spend ?? [];
    const results = series.messaging_first_reply ?? [];
    const map: Record<string, { label: string; spend?: number; results?: number }> = {};
    spend.forEach((point) => {
      map[point.date] = { label: point.date, spend: point.value };
    });
    results.forEach((point) => {
      map[point.date] = { ...map[point.date], label: point.date, results: point.value };
    });
    return Object.values(map);
  }, [series]);

  const videoSeries = series.video_view ?? [];
  const engagementSeries = series.post_engagement ?? [];
  const funnel = useMemo(() => buildFunnel(kpis, formatNumber, formatPercent), [kpis]);
  const cpl = kpis.leads ? (kpis.spend ?? 0) / kpis.leads : 0;

  return (
    <div className="space-y-6">
      <Header
        role={currentUser.role}
        clientName={clientName}
        period={filters.period}
        lastUpdate="há 2 min"
        status="Conectado"
        summary={[
          { label: "Spend", value: formatCurrency(kpis.spend ?? 0) },
          { label: "Resultados", value: formatNumber(kpis.leads ?? 0) },
        ]}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} showCampaignFilters />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento" value={formatCurrency(kpis.spend ?? 0)} delta="+9%" />
        <KpiCard label="Resultados" value={formatNumber(kpis.leads ?? 0)} delta="+7%" />
        <KpiCard label="Custo por resultado" value={formatCurrency(cpl)} delta="-4%" trend="down" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr ?? 0)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc ?? 0)} delta="-3%" trend="down" />
        <KpiCard label="CPM" value={formatCurrency(kpis.cpm ?? 0)} delta="+1%" />
        <KpiCard label="Conversas" value={formatNumber(kpis.conversations ?? 0)} delta="+6%" />
        <KpiCard label="Engajamento" value={formatNumber(kpis.engagements ?? 0)} delta="+4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Investimento vs Resultados" description="Atual vs período anterior">
            <GradientAreaChart
              data={performanceSeries}
              formatter={(value, key) =>
                key.includes("spend") ? formatCurrency(value) : formatNumber(value)
              }
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Investimento" },
                { key: "results", color: chartPalette.pink, fill: chartPalette.pink, name: "Resultados" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Views de vídeo" description="Volume diário">
          <BarStackChart
            data={videoSeries.map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Engajamento" description="Post engagement">
          <BarStackChart
            data={engagementSeries.map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.cyan }]}
          />
        </ChartCard>
        <TopEntities title="Melhores anúncios" items={[]} />
        <TopEntities title="Melhor dia" items={[]} />
      </section>

      <ChartCard title="Funil" description="Impressões → Cliques → Conversas → Leads">
        <Funnel
          steps={funnel.steps.map((step, index) => ({
            ...step,
            color: index === 0 ? chartPalette.cyan : index === 1 ? chartPalette.pink : chartPalette.purple,
          }))}
          rates={funnel.rates}
        />
      </ChartCard>

      <DataTable
        columns={["Campanha", "Plataforma", "Spend", "Leads", "CTR", "CPC", "CPL", "Status"]}
        rows={[]}
      />
    </div>
  );
}
