"use client";

import { useEffect, useState } from "react";
import type { Filters } from "@/components/FiltersBar";
import { fetchKpis, fetchTimeseries } from "@/lib/apiClient";

export type TimeseriesMap = Record<string, Array<{ date: string; value: number }>>;

const mergeKpis = (targets: Array<Record<string, number>>) => {
  const merged: Record<string, number> = {};
  targets.forEach((kpis) => {
    Object.entries(kpis).forEach(([key, value]) => {
      merged[key] = (merged[key] ?? 0) + value;
    });
  });
  return merged;
};

const mergeSeries = (
  targets: Array<Array<{ date: string; value: number }>>
): Array<{ date: string; value: number }> => {
  const map: Record<string, number> = {};
  targets.forEach((series) => {
    series.forEach((point) => {
      map[point.date] = (map[point.date] ?? 0) + point.value;
    });
  });
  return Object.entries(map)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const useDashboardData = ({
  filters,
  sources,
  metrics,
}: {
  filters: Filters;
  sources: string[];
  metrics: string[];
}) => {
  const [kpis, setKpis] = useState<Record<string, number>>({});
  const [series, setSeries] = useState<TimeseriesMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!sources.length) return;
      setLoading(true);
      try {
        const kpiResponses = await Promise.all(
          sources.map((source) => fetchKpis(filters.clientId, source, filters))
        );
        setKpis(mergeKpis(kpiResponses.map((response) => response.kpis)));

        const seriesEntries = await Promise.all(
          metrics.map(async (metric) => {
            const responses = await Promise.all(
              sources.map((source) => fetchTimeseries(filters.clientId, source, metric, filters))
            );
            return [metric, mergeSeries(responses.map((response) => response.series))] as const;
          })
        );
        setSeries(Object.fromEntries(seriesEntries));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, metrics, sources]);

  return { kpis, series, loading };
};
