"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import Funnel from "@/components/Funnel";
import { GradientAreaChart, LineTrendChart, BarStackChart } from "@/components/Charts";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getCampaignTable,
  getKpis,
  getTimeSeries,
} from "@/lib/data";
import { chartPalette, weekdays } from "@/data/mock";

export default function TrafegoPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const kpis = useMemo(() => getKpis(filters, "trafego"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "trafego"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "trafego"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    leads: series.leads[index],
  }));
  const impressionsData = series.labels.map((label, index) => ({
    label,
    impressions: series.impressions[index],
    clicks: series.clicks[index],
  }));
  const weekdayData = weekdays.map((label, index) => ({
    label,
    leads: Math.round(series.leads[index] ?? 80),
  }));

  return (
    <div className="space-y-6">
      <Topbar />
      <FiltersBar onChange={setFilters} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Spend" value={formatCurrency(kpis.spend)} delta="+10%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+6%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+5%" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" />
        <KpiCard label="Leads" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="CPL" value={formatCurrency(kpis.cpl)} delta="-4%" />
        <KpiCard label="CPA" value={formatCurrency(kpis.cpl)} delta="-4%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Funil de performance" description="Impressões → Cliques → Leads">
          <Funnel
            steps={[
              { label: "Impressões", value: formatNumber(kpis.impressions) },
              { label: "Cliques", value: formatNumber(kpis.clicks) },
              { label: "Leads", value: formatNumber(kpis.leads) },
            ]}
          />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Spend & Leads" description="Comparativo diário">
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

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Impressões & Cliques" description="Volume diário">
          <BarStackChart
            data={impressionsData}
            bars={[
              { key: "impressions", color: chartPalette.blue },
              { key: "clicks", color: chartPalette.cyan },
            ]}
          />
        </ChartCard>
        <ChartCard title="Leads & CPL" description="Eficiência por dia">
          <LineTrendChart
            data={spendLeadData}
            lines={[
              { key: "leads", color: chartPalette.pink },
              { key: "spend", color: chartPalette.cyan },
            ]}
          />
        </ChartCard>
        <ChartCard title="Melhor dia" description="Resultados por dia da semana">
          <BarStackChart data={weekdayData} bars={[{ key: "leads", color: chartPalette.purple }]} />
        </ChartCard>
      </section>

      <DataTable
        columns={[
          "Campanha",
          "Plataforma",
          "Spend",
          "Impressões",
          "Cliques",
          "CTR",
          "CPC",
          "Leads",
          "CPL",
          "Status",
        ]}
        rows={campaigns.map((row) => [
          row.name,
          row.platform,
          formatCurrency(row.spend),
          formatNumber(row.impressions),
          formatNumber(row.clicks),
          formatPercent(row.ctr),
          formatCurrency(row.cpc),
          formatNumber(row.leads),
          formatCurrency(row.cpl),
          row.status,
        ])}
      />
    </div>
  );
}
