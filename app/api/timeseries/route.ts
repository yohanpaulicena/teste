import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = Number(searchParams.get("clientId"));
  const source = searchParams.get("source");
  const metric = searchParams.get("metric");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!clientId || !source || !metric || !from || !to) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const sources = source === "google_ads" ? ["google_ads", "google"] : [source];
  const placeholders = sources.map(() => "?").join(", ");
  const [rows] = await pool.query<{ date: string; value: number }[]>(
    `SELECT date, SUM(value) as value
     FROM metrics
     WHERE client_id = ?
     AND source IN (${placeholders})
     AND metric = ?
     AND date BETWEEN ? AND ?
     GROUP BY date
     ORDER BY date`,
    [clientId, ...sources, metric, from, to]
  );

  return NextResponse.json({ series: rows });
}
