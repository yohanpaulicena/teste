import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = Number(searchParams.get("clientId"));
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!clientId || !from || !to) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const [sources] = await pool.query<{
    source: string;
    count: number;
  }[]>(
    `SELECT source, COUNT(*) as count
     FROM metrics
     WHERE client_id = ?
     AND date BETWEEN ? AND ?
     GROUP BY source`,
    [clientId, from, to]
  );

  const [clients] = await pool.query<{ name: string }[]>(
    "SELECT name FROM clients WHERE id = ? LIMIT 1",
    [clientId]
  );

  const availability = {
    instagram: false,
    facebook: false,
    meta_ads: false,
    google_ads: false,
  };

  sources.forEach((row) => {
    const key = row.source.toLowerCase();
    if (key in availability) {
      availability[key as keyof typeof availability] = row.count > 0;
    }
    if (key === "meta_ads") availability.meta_ads = row.count > 0;
    if (key === "google") availability.google_ads = row.count > 0;
  });

  return NextResponse.json({
    clientName: clients[0]?.name ?? `Cliente ${clientId}`,
    availability,
  });
}
