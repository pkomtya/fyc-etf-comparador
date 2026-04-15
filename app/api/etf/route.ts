import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchETFData } from "@/lib/fmp";

const CACHE_HOURS = 12;

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const { tickers } = await req.json();
    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json({ error: "No tickers" }, { status: 400 });
    }

    const sb = admin();
    const results: any[] = [];

    for (const raw of tickers) {
      const ticker = String(raw).toUpperCase().trim();
      if (!ticker) continue;

      const { data: cached } = await sb
        .from("etf_cache")
        .select("data, updated_at")
        .eq("ticker", ticker)
        .maybeSingle();

      const fresh =
        cached &&
        Date.now() - new Date(cached.updated_at).getTime() <
          CACHE_HOURS * 3600 * 1000;

      if (fresh) {
        results.push(cached.data);
        continue;
      }

      try {
        const data = await fetchETFData(ticker);
        await sb
          .from("etf_cache")
          .upsert({ ticker, data, updated_at: new Date().toISOString() });
        results.push(data);
      } catch (e: any) {
        if (cached) {
          results.push(cached.data);
        } else {
          results.push({ ticker, error: e.message });
        }
      }
    }

    return NextResponse.json({ etfs: results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
