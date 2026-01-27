"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import Funnel from "@/components/Funnel";
import DataTable from "@/components/DataTable";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import { getCampaignTable, getKpis, getTimeSeries } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function GoogleAdsPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const kpis = useMemo(() => getKpis(filters, "google"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "google"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "google"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    spendPrev: series.spendPrev[index],
    leads: series.leads[index],
    leadsPrev: series.leadsPrev[index],
  }));

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
          { label: "Leads", value: formatNumber(kpis.leads) },
        ]}
      />
      <Tabs />
      <FiltersBar
        onChange={setFilters}
        showClient={currentUser.role === "admin"}
        showCampaignFilters
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Spend" value={formatCurrency(kpis.spend)} delta="+11%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+5%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+4%" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+1%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" trend="down" />
        <KpiCard label="Conversões" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="CPL" value={formatCurrency(kpis.cpl)} delta="-4%" trend="down" />
        <KpiCard label="CPA" value={formatCurrency(kpis.cpl)} delta="-4%" trend="down" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Funil" description="Impressões → Cliques → Leads">
          <Funnel
            steps={[
              { label: "Impressões", value: formatNumber(kpis.impressions), color: chartPalette.cyan },
              { label: "Cliques", value: formatNumber(kpis.clicks), color: chartPalette.pink },
              { label: "Leads", value: formatNumber(kpis.leads), color: chartPalette.yellow },
            ]}
            rates={[
              { label: "CTR", value: formatPercent(kpis.ctr), formula: "Cliques / Impressões" },
              {
                label: "CVR",
                value: formatPercent((kpis.leads / kpis.clicks) * 100),
                formula: "Leads / Cliques",
              },
            ]}
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
                {
                  key: "spendPrev",
                  color: "rgba(79, 209, 255, 0.4)",
                  fill: chartPalette.cyan,
                  dashed: true,
                  name: "Spend (anterior)",
                },
                { key: "leads", color: chartPalette.pink, fill: chartPalette.pink, name: "Leads" },
                {
                  key: "leadsPrev",
                  color: "rgba(255, 79, 216, 0.4)",
                  fill: chartPalette.pink,
                  dashed: true,
                  name: "Leads (anterior)",
                },
              ]}
            />
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Impressões" description="Volume diário">
          <BarStackChart
            data={series.labels.map((label, index) => ({
              label,
              impressions: series.impressions[index],
            }))}
            bars={[{ key: "impressions", color: chartPalette.blue }]}
          />
        </ChartCard>
        <ChartCard title="Cliques" description="Volume diário">
          <BarStackChart
            data={series.labels.map((label, index) => ({
              label,
              clicks: series.clicks[index],
            }))}
            bars={[{ key: "clicks", color: chartPalette.cyan }]}
          />
        </ChartCard>
      </section>

      <DataTable
        columns={["Campanha", "Network", "Spend", "Cliques", "Conversões", "CPL"]}
        rows={campaigns.map((row) => [
          row.name,
          "Search",
          formatCurrency(row.spend),
          formatNumber(row.clicks),
          formatNumber(row.leads),
          formatCurrency(row.cpl),
        ])}
      />
    </div>
  );
}
