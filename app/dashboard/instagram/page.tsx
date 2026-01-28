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

export default function InstagramPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["instagram"],
    metrics: [
      "followers_count",
      "account_day_total_interactions",
      "account_day_reach",
      "page_posts_impressions",
      "account_day_profile_views",
      "account_day_profile_links_taps",
      "reels_posts_count",
      "feed_posts_count",
    ],
  });

  useSourceGuard("instagram");

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const growthData = useMemo(() => {
    const followers = series.followers_count ?? [];
    const interactions = series.account_day_total_interactions ?? [];
    const map: Record<string, { label: string; followers?: number; interactions?: number }> = {};
    followers.forEach((point) => {
      map[point.date] = { label: point.date, followers: point.value };
    });
    interactions.forEach((point) => {
      map[point.date] = { ...map[point.date], label: point.date, interactions: point.value };
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
          { label: "Interações", value: formatNumber(kpis.interactions ?? 0) },
        ]}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Seguidores" value={formatNumber(kpis.followers ?? 0)} delta="+3%" />
        <KpiCard label="Interações" value={formatNumber(kpis.interactions ?? 0)} delta="+4%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach ?? 0)} delta="+6%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions ?? 0)} delta="+5%" />
        <KpiCard label="Visitas ao perfil" value={formatNumber(kpis.profile_views ?? 0)} delta="+6%" />
        <KpiCard label="Cliques no link" value={formatNumber(kpis.link_clicks ?? 0)} delta="+4%" />
        <KpiCard label="Reels" value={formatNumber(kpis.reels ?? 0)} delta="+5%" />
        <KpiCard label="Feed" value={formatNumber(kpis.feed_posts ?? 0)} delta="+3%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Crescimento & Interações" description="Timeline diária">
            <GradientAreaChart
              data={growthData}
              formatter={(value) => formatNumber(value)}
              lines={[
                { key: "followers", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Seguidores" },
                { key: "interactions", color: chartPalette.pink, fill: chartPalette.pink, name: "Interações" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Impressões" description="Volume diário">
          <BarStackChart
            data={(series.page_posts_impressions ?? []).map((point) => ({
              label: point.date,
              value: point.value,
            }))}
            bars={[{ key: "value", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Reels publicados" description="Volume diário">
          <BarStackChart
            data={(series.reels_posts_count ?? []).map((point) => ({
              label: point.date,
              value: point.value,
            }))}
            bars={[{ key: "value", color: chartPalette.cyan }]}
          />
        </ChartCard>
        <ChartCard title="Feed publicados" description="Volume diário">
          <BarStackChart
            data={(series.feed_posts_count ?? []).map((point) => ({
              label: point.date,
              value: point.value,
            }))}
            bars={[{ key: "value", color: chartPalette.pink }]}
          />
        </ChartCard>
      </section>

      <DataTable
        columns={["Data", "Seguidores", "Interações", "Alcance", "Impressões"]}
        rows={(series.followers_count ?? []).map((point) => [
          point.date,
          formatNumber(point.value),
          formatNumber(
            (series.account_day_total_interactions ?? []).find((item) => item.date === point.date)
              ?.value ?? 0
          ),
          formatNumber(
            (series.account_day_reach ?? []).find((item) => item.date === point.date)?.value ?? 0
          ),
          formatNumber(
            (series.page_posts_impressions ?? []).find((item) => item.date === point.date)?.value ?? 0
          ),
        ])}
      />
    </div>
  );
}
