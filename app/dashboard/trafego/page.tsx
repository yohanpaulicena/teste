"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import Funnel from "@/components/Funnel";
import DataTable from "@/components/DataTable";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";
import { useAvailability } from "@/components/AvailabilityProvider";
import { useDashboardData } from "@/lib/useDashboardData";
import { useSourceGuard } from "@/lib/useSourceGuard";
import { buildFunnel } from "@/lib/funnel";

export default function TrafegoPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const { clientName, refresh } = useAvailability();
  const { kpis, series } = useDashboardData({
    filters,
    sources: ["meta_ads", "google_ads"],
    metrics: ["spend", "impressions", "clicks", "messaging_first_reply", "conversions"],
  });

  useSourceGuard(["meta_ads", "google_ads"]);

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const leadSeries = useMemo(() => {
    const meta = series.messaging_first_reply ?? [];
    const google = series.conversions ?? [];
    const map: Record<string, number> = {};
    [...meta, ...google].forEach((point) => {
      map[point.date] = (map[point.date] ?? 0) + point.value;
    });
    return Object.entries(map)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [series]);

  const spendSeries = series.spend ?? [];
  const spendLeadData = useMemo(() => {
    const map: Record<string, { label: string; spend?: number; leads?: number }> = {};
    spendSeries.forEach((point) => {
      map[point.date] = { label: point.date, spend: point.value };
    });
    leadSeries.forEach((point) => {
      map[point.date] = { ...map[point.date], label: point.date, leads: point.value };
    });
    return Object.values(map);
  }, [leadSeries, spendSeries]);

  const funnel = useMemo(() => buildFunnel(kpis, formatNumber, formatPercent), [kpis]);
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
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} showCampaignFilters />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Spend" value={formatCurrency(kpis.spend ?? 0)} delta="+10%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions ?? 0)} delta="+4%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks ?? 0)} delta="+6%" />
        <KpiCard label="CTR" value={formatPercent(ctr)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(cpc)} delta="-3%" trend="down" />
        <KpiCard label="Leads" value={formatNumber(kpis.leads ?? 0)} delta="+8%" />
        <KpiCard label="CPL" value={formatCurrency(cpl)} delta="-4%" trend="down" />
        <KpiCard label="ROAS" value="3.1x" delta="+5%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Funil" description="Impressões → Cliques → Leads">
          <Funnel
            steps={funnel.steps.map((step, index) => ({
              ...step,
              color: index === 0 ? chartPalette.cyan : index === 1 ? chartPalette.pink : chartPalette.purple,
            }))}
            rates={funnel.rates}
          />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Spend & Leads" description="Atual vs período anterior">
            <GradientAreaChart
              data={spendLeadData}
              formatter={(value, key) =>
                key.includes("spend") ? formatCurrency(value) : formatNumber(value)
              }
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan, name: "Spend" },
                { key: "leads", color: chartPalette.pink, fill: chartPalette.pink, name: "Leads" },
              ]}
            />
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Impressões" description="Volume diário">
          <BarStackChart
            data={(series.impressions ?? []).map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.blue }]}
          />
        </ChartCard>
        <ChartCard title="Cliques" description="Volume diário">
          <BarStackChart
            data={(series.clicks ?? []).map((point) => ({ label: point.date, value: point.value }))}
            bars={[{ key: "value", color: chartPalette.pink }]}
          />
        </ChartCard>
      </section>

      <DataTable
        columns={["Campanha", "Plataforma", "Spend", "Cliques", "Leads", "CPL", "Status"]}
        rows={[]}
      />
    </div>
  );
}
