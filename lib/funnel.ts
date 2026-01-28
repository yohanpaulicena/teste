type FunnelStep = { label: string; value: string };
type FunnelRate = { label: string; value: string; formula: string };

export const buildFunnel = (
  kpis: Record<string, number>,
  formatNumber: (value: number) => string,
  formatPercent: (value: number) => string
): { steps: FunnelStep[]; rates: FunnelRate[] } => {
  const impressions = kpis.impressions ?? 0;
  const clicks = kpis.clicks ?? kpis.link_clicks ?? 0;
  const conversations = kpis.conversations ?? 0;
  const leads = kpis.leads ?? 0;

  const steps: FunnelStep[] = [];
  if (impressions) steps.push({ label: "Impressões", value: formatNumber(impressions) });
  if (clicks) steps.push({ label: "Cliques", value: formatNumber(clicks) });
  if (conversations) steps.push({ label: "Conversas", value: formatNumber(conversations) });
  if (leads) steps.push({ label: "Leads", value: formatNumber(leads) });

  const rates: FunnelRate[] = [];
  if (impressions && clicks) {
    rates.push({
      label: "CTR",
      value: formatPercent((clicks / impressions) * 100),
      formula: "Cliques / Impressões",
    });
  }
  if (clicks && leads) {
    rates.push({
      label: "CVR",
      value: formatPercent((leads / clicks) * 100),
      formula: "Leads / Cliques",
    });
  } else if (clicks && conversations) {
    rates.push({
      label: "CVR",
      value: formatPercent((conversations / clicks) * 100),
      formula: "Conversas / Cliques",
    });
  }

  return { steps, rates };
};
