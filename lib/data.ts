import type { Filters } from "@/components/FiltersBar";
import { formatNumber } from "@/lib/format";

const randomSeed = (seed: number) => {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const seedFromFilters = (filters: Filters, scope: string) => {
  const raw = `${filters.period}-${filters.channel}-${filters.campaign}-${filters.objective}-${filters.clientId}-${scope}`;
  return raw.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const generateSeries = (seed: number, length: number, base: number, variance: number) => {
  const rand = randomSeed(seed);
  return Array.from({ length }, (_, index) => {
    const wave = Math.sin(index / 4) * variance;
    return Math.max(0, base + wave + rand() * variance * 0.8);
  });
};

export const getTimeSeries = (filters: Filters, scope: string) => {
  const seed = seedFromFilters(filters, scope);
  const labels = Array.from({ length: 30 }, (_, index) => `Dia ${index + 1}`);
  return {
    labels,
    spend: generateSeries(seed, 30, 280, 60),
    spendPrev: generateSeries(seed + 3, 30, 260, 55),
    leads: generateSeries(seed + 11, 30, 120, 25),
    leadsPrev: generateSeries(seed + 15, 30, 110, 22),
    impressions: generateSeries(seed + 19, 30, 5200, 900),
    clicks: generateSeries(seed + 23, 30, 380, 80),
    engagement: generateSeries(seed + 29, 30, 6.5, 1.4),
    reach: generateSeries(seed + 31, 30, 4200, 800),
    followers: generateSeries(seed + 37, 30, 160, 40),
  };
};

export const getKpis = (filters: Filters, scope: string) => {
  const seed = seedFromFilters(filters, scope);
  const rand = randomSeed(seed);
  const spend = 185000 + rand() * 42000;
  const leads = 920 + rand() * 240;
  const clicks = 7800 + rand() * 1600;
  const impressions = 180000 + rand() * 42000;
  const reach = 92000 + rand() * 18000;
  const followers = 6400 + rand() * 400;
  const engagement = 6.4 + rand() * 1.2;

  return {
    spend,
    leads,
    clicks,
    impressions,
    reach,
    followers,
    engagement,
    cpl: spend / leads,
    cpc: spend / clicks,
    ctr: (clicks / impressions) * 100,
  };
};

export const getCampaignTable = (filters: Filters, scope: string) => {
  const seed = seedFromFilters(filters, scope);
  const rand = randomSeed(seed);
  return Array.from({ length: 6 }, (_, index) => {
    const spend = 12000 + rand() * 4200;
    const leads = 120 + rand() * 50;
    const impressions = 14000 + rand() * 3200;
    const clicks = 1400 + rand() * 400;
    return {
      name: `Campanha ${String.fromCharCode(65 + index)}`,
      platform: index % 2 === 0 ? "Meta" : "Google",
      spend,
      impressions,
      clicks,
      ctr: (clicks / impressions) * 100,
      cpc: spend / clicks,
      leads,
      cpl: spend / leads,
      status: index % 3 === 0 ? "Em alta" : "Ativa",
    };
  });
};

export const getTopPosts = (filters: Filters, scope: string) => {
  const seed = seedFromFilters(filters, scope);
  const rand = randomSeed(seed);
  return Array.from({ length: 5 }, (_, index) => {
    const reach = 8200 + rand() * 2400;
    const engagement = 4.8 + rand() * 1.8;
    const saves = 80 + rand() * 30;
    const clicks = 120 + rand() * 40;
    return {
      name: `Post destaque ${index + 1}`,
      date: `0${index + 1}/09/2024`,
      reach,
      engagement,
      saves,
      shares: Math.round(rand() * 40 + 20),
      comments: Math.round(rand() * 25 + 10),
      clicks,
    };
  });
};

export const getTopEntities = (filters: Filters, scope: string) => {
  const seed = seedFromFilters(filters, scope);
  const rand = randomSeed(seed);
  return Array.from({ length: 4 }, (_, index) => ({
    name: `Destaque ${index + 1}`,
    value: formatNumber(1200 + rand() * 420),
    helper: "Performance premium",
  }));
};
