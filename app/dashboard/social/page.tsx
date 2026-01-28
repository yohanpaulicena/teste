"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";
import { useAvailability } from "@/components/AvailabilityProvider";
import { useDashboardData } from "@/lib/useDashboardData";
import { useSourceGuard } from "@/lib/useSourceGuard";

const mergeSeries = (
  a: Array<{ date: string; value: number }>,
  b: Array<{ date: string; value: number }>
) => {
  const map: Record<string, number> = {};
  [...a, ...b].forEach((point) => {
    map[point.date] = (map[point.date] ?? 0) + point.value;
  });
  return Object.entries(map)
    .map(([date, value]) => ({ date, value }))
    .sort((x, y) => x.date.localeCompare(y.date));
};

export default function SocialPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["instagram", "facebook"],
    metrics: [
      "account_day_reach",
      "page_posts_impressions_unique",
      "account_day_total_interactions",
      "page_actions_post_reactions_total",
      "followers_count",
      "page_follows",
      "page_posts_impressions",
    ],
  });

  useSourceGuard(["instagram", "facebook"]);

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const reachSeries = useMemo(
    () =>
      mergeSeries(series.account_day_reach ?? [], series.page_posts_impressions_unique ?? []).map((point) => ({
        label: point.date,
        reach: point.value,
      })),
    [series]
  );
  const interactionSeries = useMemo(
    () =>
      mergeSeries(series.account_day_total_interactions ?? [], series.page_actions_post_reactions_total ?? []).map(
        (point) => ({
          label: point.date,
          interactions: point.value,
        })
      ),
    [series]
  );
  const engagementData = useMemo(() => {
    const map: Record<string, { label: string; reach?: number; interactions?: number }> = {};
    reachSeries.forEach((point) => {
      map[point.label] = { label: point.label, reach: point.reach };
    });
    interactionSeries.forEach((point) => {
      map[point.label] = { ...map[point.label], label: point.label, interactions: point.interactions };
    });
    return Object.values(map);
  }, [reachSeries, interactionSeries]);

  const followersSeries = useMemo(
    () =>
      mergeSeries(series.followers_count ?? [], series.page_follows ?? []).map((point) => ({
        label: point.date,
        followers: point.value,
      })),
    [series]
  );

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
          { label: "Interações", value: formatNumber(kpis.interactions ?? 0) },
        ]}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Posts publicados" value={formatNumber(kpis.feed_posts ?? 0)} delta="+10%" />
        <KpiCard label="Seguidores ganhos" value={formatNumber(kpis.followers ?? 0)} delta="+3%" />
        <KpiCard label="Alcance total" value={formatNumber(kpis.reach ?? 0)} delta="+6%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions ?? 0)} delta="+5%" />
        <KpiCard label="Interações" value={formatNumber(kpis.interactions ?? 0)} delta="+8%" />
        <KpiCard label="Interações totais" value={formatNumber(kpis.interactions ?? 0)} delta="+4%" />
        <KpiCard label="Visitas ao perfil" value={formatNumber(kpis.profile_views ?? 0)} delta="+7%" />
        <KpiCard label="Cliques no link" value={formatNumber(kpis.link_clicks ?? 0)} delta="+5%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Alcance x Interações" description="Atual vs período anterior">
            <GradientAreaChart
              data={engagementData}
              formatter={(value) => formatNumber(value)}
              lines={[
                { key: "reach", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Alcance" },
                { key: "interactions", color: chartPalette.pink, fill: chartPalette.pink, name: "Interações" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Crescimento de seguidores" description="Evolução no período">
          <GradientAreaChart
            data={followersSeries}
            formatter={(value) => formatNumber(value)}
            lines={[{ key: "followers", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Seguidores" }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Impressões" description="Volume diário">
          <BarStackChart
            data={(series.page_posts_impressions ?? []).map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
        <ChartCard title="Alcance" description="Volume diário">
          <BarStackChart
            data={reachSeries.map((point) => ({ label: point.label, value: point.reach }))}
            bars={[{ key: "value", color: chartPalette.cyan }]}
          />
        </ChartCard>
      </section>

      <DataTable
        columns={["Data", "Alcance", "Interações", "Seguidores"]}
        rows={followersSeries.map((point) => [
          point.label,
          formatNumber(
            reachSeries.find((item) => item.label === point.label)?.reach ?? 0
          ),
          formatNumber(
            interactionSeries.find((item) => item.label === point.label)?.interactions ?? 0
          ),
          formatNumber(point.followers ?? 0),
        ])}
      />
    </div>
  );
}
