"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { formatNumber } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";
import { useAvailability } from "@/components/AvailabilityProvider";
import { useDashboardData } from "@/lib/useDashboardData";
import { useSourceGuard } from "@/lib/useSourceGuard";

export default function FacebookPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["facebook"],
    metrics: ["page_follows", "page_posts_impressions", "page_posts_impressions_unique", "page_views_total"],
  });

  useSourceGuard("facebook");

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const engagementData = useMemo(() => {
    const reach = series.page_posts_impressions_unique ?? [];
    const impressions = series.page_posts_impressions ?? [];
    const map: Record<string, { label: string; reach?: number; impressions?: number }> = {};
    reach.forEach((point) => {
      map[point.date] = { label: point.date, reach: point.value };
    });
    impressions.forEach((point) => {
      map[point.date] = { ...map[point.date], label: point.date, impressions: point.value };
    });
    return Object.values(map);
  }, [series]);

  return (
    <div className="space-y-6">
      <Header
        role={currentUser.role}
        clientName={clientName}
        period={filters.period}
        lastUpdate="há 2 min"
        status="Conectado"
        summary={[
          { label: "Seguidores", value: formatNumber(kpis.followers ?? 0) },
          { label: "Alcance", value: formatNumber(kpis.reach ?? 0) },
        ]}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Seguidores" value={formatNumber(kpis.followers ?? 0)} delta="+2%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach ?? 0)} delta="+4%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions ?? 0)} delta="+5%" />
        <KpiCard label="Visitas" value={formatNumber(kpis.views ?? 0)} delta="+6%" />
        <KpiCard label="Reações" value={formatNumber(kpis.reactions ?? 0)} delta="+3%" />
        <KpiCard label="Interações" value={formatNumber(kpis.reactions ?? 0)} delta="+4%" />
        <KpiCard label="Engajamento" value={formatNumber(kpis.reactions ?? 0)} delta="+3%" />
        <KpiCard label="Seguidores ganhos" value={formatNumber(kpis.followers ?? 0)} delta="+2%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Alcance & Impressões" description="Timeline diária">
            <GradientAreaChart
              data={engagementData}
              formatter={(value) => formatNumber(value)}
              lines={[
                { key: "reach", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Alcance" },
                { key: "impressions", color: chartPalette.pink, fill: chartPalette.pink, name: "Impressões" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Visitas" description="Volume diário">
          <BarStackChart
            data={(series.page_views_total ?? []).map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <DataTable
        columns={["Data", "Alcance", "Impressões", "Visitas"]}
        rows={(series.page_posts_impressions_unique ?? []).map((point) => [
          point.date,
          formatNumber(point.value),
          formatNumber(
            (series.page_posts_impressions ?? []).find((item) => item.date === point.date)?.value ?? 0
          ),
          formatNumber(
            (series.page_views_total ?? []).find((item) => item.date === point.date)?.value ?? 0
          ),
        ])}
      />
    </div>
  );
}
