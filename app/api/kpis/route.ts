import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { metricMap, type SourceKey } from "@/lib/metricMap";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = Number(searchParams.get("clientId"));
  const source = searchParams.get("source") as SourceKey;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!clientId || !source || !from || !to) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const sources = source === "google_ads" ? ["google_ads", "google"] : [source];
  const placeholders = sources.map(() => "?").join(", ");

  const [rows] = await pool.query<{ metric: string; value: number; date: string }[]>(
    `SELECT metric, value, date
     FROM metrics
     WHERE client_id = ?
     AND source IN (${placeholders})
     AND date BETWEEN ? AND ?
     ORDER BY date DESC`,
    [clientId, ...sources, from, to]
  );

  const sumMap: Record<string, number> = {};
  const latestMap: Record<string, number> = {};

  rows.forEach((row) => {
    sumMap[row.metric] = (sumMap[row.metric] ?? 0) + Number(row.value);
    if (latestMap[row.metric] === undefined) {
      latestMap[row.metric] = Number(row.value);
    }
  });

  const kpis: Record<string, number> = {};
  metricMap[source]?.forEach((definition) => {
    const value =
      definition.type === "latest"
        ? latestMap[definition.metric] ?? 0
        : sumMap[definition.metric] ?? 0;
    kpis[definition.key] = value;
  });

  return NextResponse.json({ kpis });
}
