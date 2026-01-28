const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export type DateRange = { from: string; to: string };

export type PeriodKey = "hoje" | "7d" | "30d" | "mes" | "custom";

export const resolveDateRange = ({
  period,
  startDate,
  endDate,
}: {
  period: PeriodKey | string;
  startDate?: string;
  endDate?: string;
}): DateRange => {
  const today = new Date();
  if (period === "hoje") {
    const formatted = formatDate(today);
    return { from: formatted, to: formatted };
  }
  if (period === "7d") {
    const from = new Date(today);
    from.setDate(today.getDate() - 6);
    return { from: formatDate(from), to: formatDate(today) };
  }
  if (period === "30d") {
    const from = new Date(today);
    from.setDate(today.getDate() - 29);
    return { from: formatDate(from), to: formatDate(today) };
  }
  if (period === "mes") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: formatDate(from), to: formatDate(today) };
  }
  if (period === "custom") {
    const from = startDate || formatDate(today);
    const to = endDate || startDate || formatDate(today);
    return { from, to };
  }

  const fallback = formatDate(today);
  return { from: fallback, to: fallback };
};

export const formatRangeLabel = (range: DateRange) => `${range.from} → ${range.to}`;
