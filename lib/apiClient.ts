"use client";

import type { Filters } from "@/components/FiltersBar";
import { resolveDateRange } from "@/lib/dateRange";

export type AvailabilityResponse = {
  clientName: string;
  availability: Record<string, boolean>;
};

export type TimeseriesPoint = { date: string; value: number };

export const buildRange = (filters: Filters) =>
  resolveDateRange({
    period: filters.period,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

export const fetchAvailability = async (clientId: number, filters: Filters) => {
  const range = buildRange(filters);
  const params = new URLSearchParams({
    clientId: String(clientId),
    from: range.from,
    to: range.to,
  });
  const response = await fetch(`/api/availability?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load availability");
  }
  return (await response.json()) as AvailabilityResponse;
};

export const fetchKpis = async (clientId: number, source: string, filters: Filters) => {
  const range = buildRange(filters);
  const params = new URLSearchParams({
    clientId: String(clientId),
    source,
    from: range.from,
    to: range.to,
  });
  const response = await fetch(`/api/kpis?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load KPIs");
  }
  return (await response.json()) as { kpis: Record<string, number> };
};

export const fetchTimeseries = async (
  clientId: number,
  source: string,
  metric: string,
  filters: Filters
) => {
  const range = buildRange(filters);
  const params = new URLSearchParams({
    clientId: String(clientId),
    source,
    metric,
    from: range.from,
    to: range.to,
  });
  const response = await fetch(`/api/timeseries?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load timeseries");
  }
  return (await response.json()) as { series: TimeseriesPoint[] };
};
