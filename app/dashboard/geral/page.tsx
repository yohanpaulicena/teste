"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, LineTrendChart } from "@/components/Charts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";
import { useAvailability } from "@/components/AvailabilityProvider";
import { useDashboardData } from "@/lib/useDashboardData";
import { fetchTimeseries } from "@/lib/apiClient";

export default function GeralPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });

  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["meta_ads", "google_ads", "instagram", "facebook"],
    metrics: ["spend", "messaging_first_reply", "conversions", "followers_count", "page_follows"],
  });
  const [leadSeries, setLeadSeries] = useState<Array<{ date: string; value: number }>>([]);

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  useEffect(() => {
    const loadLeads = async () => {
      const meta = await fetchTimeseries(filters.clientId, "meta_ads", "messaging_first_reply", filters);
      const google = await fetchTimeseries(filters.clientId, "google_ads", "conversions", filters);
      const map: Record<string, number> = {};
      [...meta.series, ...google.series].forEach((point) => {
        map[point.date] = (map[point.date] ?? 0) + point.value;
      });
      setLeadSeries(
        Object.entries(map)
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => a.date.localeCompare(b.date))
      );
    };
    loadLeads();
  }, [filters]);

  const spendLeadData = useMemo(() => {
    const spendMap = series.spend ?? [];
    const leadMap = leadSeries;
    const merged: Record<string, { label: string; spend?: number; leads?: number }> = {};
    spendMap.forEach((point) => {
      merged[point.date] = { label: point.date, spend: point.value };
    });
    leadMap.forEach((point) => {
      merged[point.date] = { ...merged[point.date], label: point.date, leads: point.value };
    });
    return Object.values(merged);
  }, [leadSeries, series]);
  const followerData = useMemo(() => {
    const instagram = series.followers_count ?? [];
    const facebook = series.page_follows ?? [];
    const map: Record<string, number> = {};
    [...instagram, ...facebook].forEach((point) => {
      map[point.date] = (map[point.date] ?? 0) + point.value;
    });
    return Object.entries(map)
      .map(([date, value]) => ({ label: date, followers: value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [series]);
  const cpl = kpis.leads ? (kpis.spend ?? 0) / kpis.leads : 0;
  const ctr = kpis.impressions ? ((kpis.clicks ?? 0) / kpis.impressions) * 100 : 0;
  const cpc = kpis.clicks ? (kpis.spend ?? 0) / kpis.clicks : 0;

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
          { label: "Leads", value: formatNumber(kpis.leads ?? 0) },
        ]}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento total" value={formatCurrency(kpis.spend ?? 0)} delta="+12%" />
        <KpiCard label="Leads / Conversões" value={formatNumber(kpis.leads ?? 0)} delta="+8%" />
        <KpiCard label="CPL médio" value={formatCurrency(cpl)} delta="-5%" trend="down" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks ?? 0)} delta="+6%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions ?? 0)} delta="+4%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach ?? 0)} delta="+7%" />
        <KpiCard label="Seguidores ganhos" value={formatNumber(kpis.followers ?? 0)} delta="+3%" />
        <KpiCard label="Engajamento" value={formatPercent(ctr)} delta="+5%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Investimento vs Leads" description="Atual vs período anterior">
            <GradientAreaChart
              data={spendLeadData}
              formatter={(value, key) =>
                key.includes("spend") ? formatCurrency(value) : formatNumber(value)
              }
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Investimento" },
                { key: "leads", color: chartPalette.pink, fill: chartPalette.pink, name: "Leads" },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Seguidores ganhos" description="Evolução diária">
          <LineTrendChart
            data={followerData}
            formatter={(value) => formatNumber(value)}
            lines={[{ key: "followers", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DataTable
          columns={["Campanha", "Plataforma", "Spend", "Leads", "CPL", "CTR"]}
          rows={[]}
        />
        <DataTable
          columns={["Post", "Data", "Alcance", "Engajamento", "Saves", "Cliques"]}
          rows={[]}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <TopEntities title="Destaques do período" items={[]} />
        <TopEntities title="Top campanhas" items={[]} />
        <TopEntities title="Top posts" items={[]} />
      </section>
    </div>
  );
}
