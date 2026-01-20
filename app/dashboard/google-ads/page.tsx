"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import Funnel from "@/components/Funnel";
import DataTable from "@/components/DataTable";
import { GradientAreaChart, BarStackChart } from "@/components/Charts";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getCampaignTable,
  getKpis,
  getTimeSeries,
} from "@/lib/data";
import { chartPalette } from "@/data/mock";

export default function GoogleAdsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const kpis = useMemo(() => getKpis(filters, "google"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "google"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "google"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    leads: series.leads[index],
  }));

  return (
    <div className="space-y-6">
      <Topbar />
      <FiltersBar onChange={setFilters} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Spend" value={formatCurrency(kpis.spend)} delta="+11%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+5%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+4%" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+1%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" />
        <KpiCard label="Conversões" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="CPL" value={formatCurrency(kpis.cpl)} delta="-4%" />
        <KpiCard label="CPA" value={formatCurrency(kpis.cpl)} delta="-4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Funil" description="Impressões → Cliques → Leads">
          <Funnel
            steps={[
              { label: "Impressões", value: formatNumber(kpis.impressions) },
              { label: "Cliques", value: formatNumber(kpis.clicks) },
              { label: "Leads", value: formatNumber(kpis.leads) },
            ]}
          />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Spend & Leads" description="Série temporal">
            <GradientAreaChart
              data={spendLeadData}
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan },
                { key: "leads", color: chartPalette.pink, fill: chartPalette.pink },
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
