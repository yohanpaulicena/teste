"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import FiltersBar, { defaultFilters } from "@/components/FiltersBar";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TopEntities from "@/components/TopEntities";
import Tabs from "@/components/Tabs";
import { GradientAreaChart, LineTrendChart } from "@/components/Charts";
import {
  getCampaignTable,
  getKpis,
  getTimeSeries,
  getTopEntities,
  getTopPosts,
} from "@/lib/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { chartPalette } from "@/data/mock";
import { currentUser } from "@/lib/auth";

export default function GeralPage() {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    clientId: currentUser.clientId,
  });

  const kpis = useMemo(() => getKpis(filters, "geral"), [filters]);
  const series = useMemo(() => getTimeSeries(filters, "geral"), [filters]);
  const campaigns = useMemo(() => getCampaignTable(filters, "geral"), [filters]);
  const posts = useMemo(() => getTopPosts(filters, "geral"), [filters]);
  const highlights = useMemo(() => getTopEntities(filters, "geral"), [filters]);

  const spendLeadData = series.labels.map((label, index) => ({
    label,
    spend: series.spend[index],
    spendPrev: series.spendPrev[index],
    leads: series.leads[index],
    leadsPrev: series.leadsPrev[index],
  }));
  const followerData = series.labels.map((label, index) => ({
    label,
    followers: series.followers[index],
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
      <FiltersBar onChange={setFilters} showClient={currentUser.role === "admin"} />

      <section className="grid gap-4 xl:grid-cols-4">
        <KpiCard label="Investimento total" value={formatCurrency(kpis.spend)} delta="+12%" />
        <KpiCard label="Leads / Conversões" value={formatNumber(kpis.leads)} delta="+8%" />
        <KpiCard label="CPL médio" value={formatCurrency(kpis.cpl)} delta="-5%" trend="down" />
        <KpiCard label="Cliques" value={formatNumber(kpis.clicks)} delta="+6%" />
        <KpiCard label="Impressões" value={formatNumber(kpis.impressions)} delta="+4%" />
        <KpiCard label="Alcance" value={formatNumber(kpis.reach)} delta="+7%" />
        <KpiCard label="Seguidores ganhos" value={formatNumber(kpis.followers)} delta="+3%" />
        <KpiCard label="Engajamento" value={formatPercent(kpis.engagement)} delta="+5%" />
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
                {
                  key: "spendPrev",
                  color: "rgba(79, 209, 255, 0.4)",
                  fill: chartPalette.cyan,
                  dashed: true,
                  name: "Investimento (anterior)",
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
