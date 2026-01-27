const chartInstances = new Map();

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

const palette = {
  blue: "#2563eb",
  sky: "#38bdf8",
  purple: "#7c3aed",
  green: "#22c55e",
  orange: "#f97316",
  pink: "#ec4899",
  gray: "#94a3b8",
};

const kpiConfig = {
  traffic: [
    { label: "Investimento", key: "spend", prefix: "R$" },
    { label: "Leads", key: "leads" },
    { label: "CPL", key: "cpl", prefix: "R$" },
    { label: "CPC", key: "cpc", prefix: "R$" },
    { label: "CTR", key: "ctr", suffix: "%" },
  ],
  social: [
    { label: "Alcance", key: "reach" },
    { label: "Engajamento", key: "engagement", suffix: "%" },
    { label: "Seguidores", key: "followers" },
    { label: "Views", key: "views" },
    { label: "CTR", key: "ctr", suffix: "%" },
  ],
  meta: [
    { label: "Investimento", key: "spend", prefix: "R$" },
    { label: "Conversões", key: "conversions" },
    { label: "CPA", key: "cpa", prefix: "R$" },
    { label: "ROAS", key: "roas", suffix: "x" },
    { label: "CTR", key: "ctr", suffix: "%" },
  ],
  instagram: [
    { label: "Seguidores", key: "followers" },
    { label: "Engajamento", key: "engagement", suffix: "%" },
    { label: "Stories", key: "stories" },
    { label: "Reels", key: "reels" },
    { label: "Salvos", key: "saves" },
  ],
  google: [
    { label: "Investimento", key: "spend", prefix: "R$" },
    { label: "Cliques", key: "clicks" },
    { label: "CPA", key: "cpa", prefix: "R$" },
    { label: "Conversões", key: "conversions" },
    { label: "CTR", key: "ctr", suffix: "%" },
  ],
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function generateSeries(days, base, variance) {
  return Array.from({ length: days }, (_, index) => {
    const factor = Math.sin(index / 6) * variance;
    return Math.max(0, base + factor + rand(-variance, variance));
  });
}

function formatNumber(value) {
  return Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value);
}

function formatCurrency(value) {
  return `R$ ${formatNumber(value)}`;
}

function formatPercent(value) {
  return `${formatNumber(value)}%`;
}

function buildKpiCards(target, kpis, current, previous) {
  target.innerHTML = "";
  kpis.forEach((kpi) => {
    const value = current[kpi.key] ?? 0;
    const prev = previous[kpi.key] ?? 0;
    const delta = prev === 0 ? 0 : ((value - prev) / prev) * 100;
    const card = document.createElement("div");
    card.className = "kpi-card";

    const label = document.createElement("h4");
    label.textContent = kpi.label;

    const metric = document.createElement("p");
    metric.className = "kpi-value";

    const formatted = kpi.prefix
      ? `${kpi.prefix} ${formatNumber(value)}`
      : kpi.suffix
        ? `${formatNumber(value)}${kpi.suffix}`
        : formatNumber(value);

    metric.textContent = formatted;

    const compare = document.createElement("p");
    compare.className = "kpi-compare";
    const direction = delta >= 0 ? "up" : "down";
    if (direction === "down") {
      compare.classList.add("down");
    }
    compare.innerHTML = `<strong>${formatNumber(delta)}%</strong> vs período anterior`;

    card.append(label, metric, compare);
    target.append(card);
  });
}

function buildChart(canvasId, config) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
  }
  const chart = new Chart(ctx, config);
  chartInstances.set(canvasId, chart);
}

function mountCharts(data) {
  buildChart("trafficSpendChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Investimento",
          data: data.traffic.spendSeries,
          borderColor: palette.blue,
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Leads",
          data: data.traffic.leadsSeries,
          borderColor: palette.green,
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { position: "top" } } },
  });

  buildChart("trafficFunnelChart", {
    type: "bar",
    data: {
      labels: ["Impressões", "Cliques", "Leads"],
      datasets: [
        {
          data: [data.traffic.impressions, data.traffic.clicks, data.traffic.leads],
          backgroundColor: [palette.blue, palette.sky, palette.green],
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  buildChart("trafficEfficiencyChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "CPA",
          data: data.traffic.cpaSeries,
          borderColor: palette.orange,
          tension: 0.35,
        },
        {
          label: "CPC",
          data: data.traffic.cpcSeries,
          borderColor: palette.purple,
          tension: 0.35,
        },
      ],
    },
  });

  buildChart("socialEngagementChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Alcance",
          data: data.social.reachSeries,
          borderColor: palette.blue,
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Engajamento",
          data: data.social.engagementSeries,
          borderColor: palette.pink,
          backgroundColor: "rgba(236, 72, 153, 0.12)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
  });

  buildChart("socialFormatChart", {
    type: "doughnut",
    data: {
      labels: ["Reels", "Stories", "Feed"],
      datasets: [
        {
          data: [42, 35, 23],
          backgroundColor: [palette.pink, palette.blue, palette.purple],
        },
      ],
    },
  });

  buildChart("socialAudienceChart", {
    type: "doughnut",
    data: {
      labels: ["Feminino", "Masculino", "Outro"],
      datasets: [
        {
          data: [48, 44, 8],
          backgroundColor: [palette.purple, palette.blue, palette.gray],
        },
      ],
    },
  });

  buildChart("metaPerformanceChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Investimento",
          data: data.meta.spendSeries,
          borderColor: palette.blue,
          tension: 0.4,
        },
        {
          label: "Conversões",
          data: data.meta.conversionSeries,
          borderColor: palette.green,
          tension: 0.4,
        },
      ],
    },
  });

  buildChart("metaCampaignChart", {
    type: "bar",
    data: {
      labels: ["Campanha A", "Campanha B", "Campanha C"],
      datasets: [
        {
          data: [320, 260, 210],
          backgroundColor: [palette.blue, palette.purple, palette.sky],
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  buildChart("metaSegmentChart", {
    type: "doughnut",
    data: {
      labels: ["Retargeting", "Aquisição", "Remarketing"],
      datasets: [
        {
          data: [45, 35, 20],
          backgroundColor: [palette.orange, palette.pink, palette.blue],
        },
      ],
    },
  });

  buildChart("instagramGrowthChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Seguidores",
          data: data.instagram.followerSeries,
          borderColor: palette.blue,
          tension: 0.4,
        },
        {
          label: "Engajamento",
          data: data.instagram.engagementSeries,
          borderColor: palette.pink,
          tension: 0.4,
        },
      ],
    },
  });

  buildChart("instagramContentChart", {
    type: "bar",
    data: {
      labels: ["Stories", "Reels", "Feed"],
      datasets: [
        {
          data: [72, 88, 64],
          backgroundColor: [palette.blue, palette.pink, palette.purple],
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  buildChart("instagramPeakChart", {
    type: "bar",
    data: {
      labels: ["09h", "12h", "15h", "18h", "21h"],
      datasets: [
        {
          data: [32, 45, 53, 68, 57],
          backgroundColor: palette.sky,
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  buildChart("googleClicksChart", {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Cliques",
          data: data.google.clickSeries,
          borderColor: palette.blue,
          tension: 0.4,
        },
        {
          label: "Conversões",
          data: data.google.conversionSeries,
          borderColor: palette.green,
          tension: 0.4,
        },
      ],
    },
  });

  buildChart("googleImpressionsChart", {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Impressões",
          data: data.google.impressionSeries,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
        },
      ],
    },
  });

  buildChart("googleDeviceChart", {
    type: "doughnut",
    data: {
      labels: ["Desktop", "Mobile", "Tablet"],
      datasets: [
        {
          data: [52, 40, 8],
          backgroundColor: [palette.blue, palette.pink, palette.gray],
        },
      ],
    },
  });
}

function generateData() {
  const labels = Array.from({ length: 30 }, (_, index) => `Dia ${index + 1}`);

  const traffic = {
    spendSeries: generateSeries(30, 280, 70),
    leadsSeries: generateSeries(30, 120, 30),
    cpaSeries: generateSeries(30, 28, 6),
    cpcSeries: generateSeries(30, 3.8, 0.6),
  };

  traffic.spend = traffic.spendSeries.reduce((a, b) => a + b, 0);
  traffic.leads = traffic.leadsSeries.reduce((a, b) => a + b, 0);
  traffic.clicks = Math.round(traffic.leads * 6.2);
  traffic.impressions = Math.round(traffic.clicks * 14);
  traffic.cpl = traffic.spend / traffic.leads;
  traffic.cpc = traffic.spend / traffic.clicks;
  traffic.ctr = (traffic.clicks / traffic.impressions) * 100;
  traffic.cpa = traffic.cpl;

  const social = {
    reachSeries: generateSeries(30, 4200, 900),
    engagementSeries: generateSeries(30, 6.8, 1.1),
  };
  social.reach = social.reachSeries.reduce((a, b) => a + b, 0);
  social.engagement = social.engagementSeries.reduce((a, b) => a + b, 0) / 30;
  social.followers = Math.round(rand(4800, 5200));
  social.views = Math.round(rand(82000, 94000));
  social.ctr = rand(1.8, 2.6);

  const meta = {
    spendSeries: generateSeries(30, 190, 40),
    conversionSeries: generateSeries(30, 32, 8),
  };
  meta.spend = meta.spendSeries.reduce((a, b) => a + b, 0);
  meta.conversions = Math.round(meta.conversionSeries.reduce((a, b) => a + b, 0));
  meta.cpa = meta.spend / meta.conversions;
  meta.roas = rand(2.8, 3.6);
  meta.ctr = rand(2.1, 3.5);

  const instagram = {
    followerSeries: generateSeries(30, 4800, 160),
    engagementSeries: generateSeries(30, 5.2, 1.0),
  };
  instagram.followers = Math.round(instagram.followerSeries.at(-1));
  instagram.engagement = instagram.engagementSeries.reduce((a, b) => a + b, 0) / 30;
  instagram.stories = Math.round(rand(42, 56));
  instagram.reels = Math.round(rand(28, 40));
  instagram.saves = Math.round(rand(1300, 1800));

  const google = {
    clickSeries: generateSeries(30, 320, 80),
    conversionSeries: generateSeries(30, 60, 14),
    impressionSeries: generateSeries(30, 5200, 1200),
  };
  google.clicks = Math.round(google.clickSeries.reduce((a, b) => a + b, 0));
  google.conversions = Math.round(google.conversionSeries.reduce((a, b) => a + b, 0));
  google.impressions = Math.round(google.impressionSeries.reduce((a, b) => a + b, 0));
  google.spend = google.clicks * rand(3.4, 4.1);
  google.cpa = google.spend / google.conversions;
  google.ctr = (google.clicks / google.impressions) * 100;

  return {
    labels,
    traffic,
    social,
    meta,
    instagram,
    google,
  };
}

function generatePrevious(current) {
  const variation = 0.9 + Math.random() * 0.2;
  return Object.fromEntries(
    Object.entries(current).map(([key, value]) => {
      if (typeof value === "number") {
        return [key, value * variation];
      }
      return [key, value];
    })
  );
}

function mountKpis(data) {
  document.querySelectorAll("[data-kpi]").forEach((container) => {
    const section = container.dataset.kpi;
    const current = data[section];
    const previous = generatePrevious(current);
    buildKpiCards(container, kpiConfig[section], current, previous);
  });
}

function handleTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) {
        target.classList.add("active");
      }
    });
  });
}

const dataset = generateData();
mountKpis(dataset);
mountCharts(dataset);
handleTabs();
