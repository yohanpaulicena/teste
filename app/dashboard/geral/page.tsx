"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import { GradientAreaChart, LineTrendChart } from "@/components/Charts";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getCampaignTable,
  getKpis,
  getTimeSeries,
  getTopEntities,
  getTopPosts,
} from "@/lib/data";
import { chartPalette } from "@/data/mock";

export default function GeralPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const kpis = useMemo(() => getKpis(filters, "geral"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "geral"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "geral"), [filters]);
  const posts = useMemo(() => getTopPosts(filters, "geral"), [filters]);
  const highlights = useMemo(() => getTopEntities(filters, "geral"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    leads: series.leads[index],
  }));
  const followerData = series.labels.map((label, index) => ({
    label,
    followers: series.followers[index],
  }));

  return (
    <div className="space-y-6">
      <Topbar />
      <FiltersBar onChange={setFilters} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento total" value={formatCurrency(kpis.spend)} delta="+12%" />
        <KpiCard label="Leads / Conversões" value={formatNumber(kpis.leads)} delta="+8%" />
        <KpiCard label="CPL médio" value={formatCurrency(kpis.cpl)} delta="-5%" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+6%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+4%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach)} delta="+7%" />
        <KpiCard label="Seguidores ganhos" value={formatNumber(kpis.followers)} delta="+3%" />
        <KpiCard label="Engajamento" value={formatPercent(kpis.engagement)} delta="+5%" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Spend vs Leads" description="Linha dupla com comparativo de período">
            <GradientAreaChart
              data={spendLeadData}
              lines={[
                { key: "spend", color: chartPalette.cyan, fill: chartPalette.cyan },
                { key: "leads", color: chartPalette.pink, fill: chartPalette.pink },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Seguidores ganhos" description="Evolução diária">
          <LineTrendChart
            data={followerData}
            lines={[{ key: "followers", color: chartPalette.purple }]}
          />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DataTable
          columns={["Campanha", "Plataforma", "Spend", "Leads", "CPL", "CTR"]}
          rows={campaigns.map((row) => [
            row.name,
            row.platform,
            formatCurrency(row.spend),
            formatNumber(row.leads),
            formatCurrency(row.cpl),
            formatPercent(row.ctr),
          ])}
        />
        <DataTable
          columns={["Post", "Data", "Alcance", "Engajamento", "Saves", "Cliques"]}
          rows={posts.map((row) => [
            row.name,
            row.date,
            formatNumber(row.reach),
            formatPercent(row.engagement),
            formatNumber(row.saves),
            formatNumber(row.clicks),
          ])}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <TopEntities title="Destaques do período" items={highlights} />
        <TopEntities title="Top campanhas" items={highlights} />
        <TopEntities title="Top posts" items={highlights} />
      </section>
    </div>
  );
}
