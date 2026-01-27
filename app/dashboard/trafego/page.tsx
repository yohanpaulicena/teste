"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import Funnel from "@/components/Funnel";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, LineTrendChart, BarStackChart } from "@/components/Charts";
import { getCampaignTable, getKpis, getTimeSeries } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette, weekdays } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function TrafegoPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });
  const kpis = useMemo(() => getKpis(filters, "trafego"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "trafego"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "trafego"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    spendPrev: series.spendPrev[index],
    leads: series.leads[index],
    leadsPrev: series.leadsPrev[index],
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
      <Header
        role={currentUser.role}
        clientName={currentUser.clientName}
        period={filters.period}
        lastUpdate="há 2 min"
        status="Conectado"
        summary={{
          spend: formatCurrency(kpis.spend),
          leads: formatNumber(kpis.leads),
        }}
      />
      <Tabs />
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Spend" value={formatCurrency(kpis.spend)} delta="+10%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+6%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+5%" />
        <KpiCard label="CTR" value={formatPercent(kpis.ctr)} delta="+2%" />
        <KpiCard label="CPC" value={formatCurrency(kpis.cpc)} delta="-3%" trend="down" />
        <KpiCard label="Leads" value={formatNumber(kpis.leads)} delta="+7%" />
        <KpiCard label="CPL" value={formatCurrency(kpis.cpl)} delta="-4%" trend="down" />
        <KpiCard label="CPA" value={formatCurrency(kpis.cpl)} delta="-4%" trend="down" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Funil de performance" description="Impressões → Cliques → Leads">
          <Funnel
            steps={[
              { label: "Impressões", value: formatNumber(kpis.impressions), color: chartPalette.cyan },
              { label: "Cliques", value: formatNumber(kpis.clicks), color: chartPalette.pink },
              { label: "Leads", value: formatNumber(kpis.leads), color: chartPalette.yellow },
            ]}
            rates={[
              {
                label: "CTR",
                value: formatPercent(kpis.ctr),
                formula: "Cliques / Impressões",
              },
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

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Impressões & Cliques" description="Volume diário">
          <BarStackChart
            data={impressionsData}
            formatter={(value) => formatNumber(value)}
            bars={[
              { key: "impressions", color: chartPalette.blue },
              { key: "clicks", color: chartPalette.cyan },
            ]}
          />
        </ChartCard>
        <ChartCard title="CPA & CPC" description="Eficiência por dia">
          <LineTrendChart
            data={spendLeadData}
            formatter={(value, key) =>
              key.includes("spend") ? formatCurrency(value) : formatNumber(value)
            }
            dualAxis
            lines={[
              { key: "leads", color: chartPalette.pink, axis: "left" },
              { key: "spend", color: chartPalette.cyan, axis: "right" },
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
