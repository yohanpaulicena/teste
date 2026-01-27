export const formatNumber = (value: number, maximumFractionDigits = 0) =>
  Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(value);

export const formatCurrency = (value: number) => `R$ ${formatNumber(value, 0)}`;

export const formatPercent = (value: number) => `${formatNumber(value, 1)}%`;

export const formatCompact = (value: number) =>
  Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
