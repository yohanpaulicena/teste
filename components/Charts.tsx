"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { formatCompact } from "@/lib/format";

const axisStyle = { fontSize: 10, fill: "#94a3b8" };

const tooltipStyle = {
  background: "rgba(7, 8, 12, 0.92)",
  border: "1px solid rgba(250, 204, 21, 0.35)",
  borderRadius: "12px",
  padding: "10px 12px",
  color: "#e2e8f0",
  backdropFilter: "blur(12px)",
};

const TooltipContent = ({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { name: string; value: number; dataKey: string }[];
  label?: string;
  formatter?: (value: number, key: string) => string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <p className="text-xs text-slate-400">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((item) => (
          <p key={item.dataKey} className="text-sm">
            <span className="text-slate-400">{item.name}: </span>
            <span className="font-semibold text-white">
              {formatter ? formatter(item.value, item.dataKey) : formatCompact(item.value)}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export function GradientAreaChart({
  data,
  lines,
  formatter,
}: {
  data: Record<string, number | string>[];
  lines: { key: string; color: string; fill: string; dashed?: boolean; name?: string }[];
  formatter?: (value: number, key: string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
        <defs>
          {lines.map((line) => (
            <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line.fill} stopOpacity={0.5} />
              <stop offset="100%" stopColor={line.fill} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
        <Tooltip content={<TooltipContent formatter={formatter} />} />
        {lines.map((line) => (
          <Area
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name ?? line.key}
            stroke={line.color}
            fill={`url(#gradient-${line.key})`}
            strokeWidth={2}
            strokeDasharray={line.dashed ? "6 4" : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineTrendChart({
  data,
  lines,
  formatter,
  dualAxis,
}: {
  data: Record<string, number | string>[];
  lines: { key: string; color: string; axis?: "left" | "right"; dashed?: boolean }[];
  formatter?: (value: number, key: string) => string;
  dualAxis?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
        {dualAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCompact}
          />
        )}
        <Tooltip content={<TooltipContent formatter={formatter} />} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            yAxisId={line.axis ?? "left"}
            strokeDasharray={line.dashed ? "6 4" : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarStackChart({
  data,
  bars,
  formatter,
}: {
  data: Record<string, number | string>[];
  bars: { key: string; color: string }[];
  formatter?: (value: number, key: string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
        <Tooltip content={<TooltipContent formatter={formatter} />} />
        {bars.map((bar) => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} radius={[8, 8, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  colors,
  formatter,
}: {
  data: { name: string; value: number }[];
  colors: string[];
  formatter?: (value: number, key: string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Tooltip content={<TooltipContent formatter={formatter} />} />
        <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
