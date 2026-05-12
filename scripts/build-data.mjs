/* eslint-disable */
// Pipeline:
//   1. Fetch daily closes from Yahoo Finance for every unique pick + SPY.
//   2. Compute daily portfolio NAV, SPX-equivalent NAV, and contributions
//      using the $1,000-per-pick / fixed-share rule.
//   3. Write the small precomputed result to data/daily.json so it is the
//      only artifact shipped to the client.
//
// Run:   node scripts/build-data.mjs
// Output: data/daily.json (committed), data/prices.json (cache, gitignored)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import ts from "typescript";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const DAY_MS = 86_400_000;

// --- Load positions.ts via on-the-fly transpile -----------------------------
async function loadPositions() {
  const src = readFileSync(resolve(root, "lib/positions.ts"), "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const tmp = resolve(root, ".tmp-positions.mjs");
  writeFileSync(tmp, out);
  const mod = await import(tmp);
  (await import("node:fs")).rmSync(tmp);
  return mod;
}

// --- Yahoo fetcher ----------------------------------------------------------
function normalize(t) {
  return t.replace("*", "").replace(".", "-");
}

async function fetchDaily(ticker, period1, period2) {
  const url = `https://query1.finance.yahoo.com/v7/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=1d&events=history&includeAdjustedClose=true`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; the-hedge-backfill)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(json?.chart?.error?.description ?? "no result");
  const tsArr = result.timestamp ?? [];
  const adj =
    result.indicators?.adjclose?.[0]?.adjclose ??
    result.indicators?.quote?.[0]?.close ??
    [];
  const series = {};
  for (let i = 0; i < tsArr.length; i++) {
    const v = adj[i];
    if (v == null || !Number.isFinite(v)) continue;
    const d = new Date(tsArr[i] * 1000).toISOString().slice(0, 10);
    series[d] = Math.round(v * 10000) / 10000;
  }
  return series;
}

async function backfillPrices(tickers, period1, period2) {
  const cachePath = resolve(root, "data/prices.json");
  let cached = {};
  if (existsSync(cachePath)) {
    cached = JSON.parse(readFileSync(cachePath, "utf8"));
    console.log(`Loaded cache with ${Object.keys(cached).length} tickers`);
  }
  const all = { ...cached };
  const failed = [];
  let i = 0;
  for (const t of tickers) {
    i++;
    if (all[t]) {
      console.log(`[${i}/${tickers.length}] ${t} (cached)`);
      continue;
    }
    process.stdout.write(`[${i}/${tickers.length}] ${t}... `);
    try {
      all[t] = await fetchDaily(t, period1, period2);
      console.log(`${Object.keys(all[t]).length} days`);
    } catch (e) {
      console.log(`FAIL ${e.message}`);
      failed.push(t);
    }
    await sleep(120);
  }
  mkdirSync(resolve(root, "data"), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(all));
  return { prices: all, failed };
}

// --- Brownian bridge fallback (delisted tickers only) -----------------------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function strHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function gauss(r) {
  const u1 = Math.max(r(), 1e-12);
  const u2 = r();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
function bridge(p0, pN, days, sigma, r) {
  if (days < 1) return [p0];
  const log0 = Math.log(p0);
  const logN = Math.log(pN);
  const incs = new Array(days);
  let sum = 0;
  for (let i = 0; i < days; i++) {
    const v = sigma * gauss(r);
    incs[i] = v;
    sum += v;
  }
  const adjust = (logN - log0 - sum) / days;
  const path = new Array(days + 1);
  path[0] = p0;
  let logCurr = log0;
  for (let i = 0; i < days - 1; i++) {
    logCurr += incs[i] + adjust;
    path[i + 1] = Math.exp(logCurr);
  }
  path[days] = pN;
  return path;
}

// --- Build daily NAV --------------------------------------------------------
function priceOnOrBefore(series, dateStr) {
  if (series[dateStr]) return series[dateStr];
  // Walk back up to 7 calendar days for weekends/holidays.
  const t = new Date(dateStr).getTime();
  for (let k = 1; k <= 7; k++) {
    const d = new Date(t - k * DAY_MS).toISOString().slice(0, 10);
    if (series[d]) return series[d];
  }
  return null;
}

function buildPortfolio(positions, INCEPTION, AS_OF, PER_PICK_USD, prices) {
  const startMs = new Date(INCEPTION).getTime();
  const endMs = new Date(AS_OF).getTime();
  const totalDays = Math.round((endMs - startMs) / DAY_MS);

  const dates = new Array(totalDays + 1);
  for (let d = 0; d <= totalDays; d++) {
    dates[d] = new Date(startMs + d * DAY_MS).toISOString().slice(0, 10);
  }

  const spy = prices["SPY"];
  if (!spy) throw new Error("SPY series missing");

  // Resolve a "shares" path for each pick: real prices when we have them,
  // bridge fallback for delisted tickers.
  const usingFallback = [];
  const pps = positions.map((p, i) => {
    const ms0 = new Date(p.date).getTime();
    const ms1 =
      p.status === "CLOSED" && p.closeDate
        ? new Date(p.closeDate).getTime()
        : endMs;
    const startDay = Math.round((ms0 - startMs) / DAY_MS);
    const endDay = Math.round((ms1 - startMs) / DAY_MS);
    const sym = normalize(p.ticker);
    const series = prices[sym];

    const path = new Array(endDay - startDay + 1);
    if (series) {
      for (let d = startDay; d <= endDay; d++) {
        const v = priceOnOrBefore(series, dates[d]);
        path[d - startDay] = v ?? p.entry;
      }
      // Anchor first to entry, last to current/exit (so $1000 sized cleanly).
      path[0] = p.entry;
      path[path.length - 1] = p.current;
    } else {
      usingFallback.push(p.ticker);
      const rng = mulberry32(strHash(`${p.ticker}|${p.date}|${i}`));
      const bp = bridge(p.entry, p.current, endDay - startDay, 0.025, rng);
      for (let k = 0; k < bp.length; k++) path[k] = bp[k];
    }
    return { startDay, endDay, entry: p.entry, exit: p.current, path };
  });

  // SPY-equivalent: at each pick date "buy" $1000 of SPY, hold for the same
  // calendar window as the real pick.
  const spyAt = (d) => priceOnOrBefore(spy, dates[d]);

  const nav = new Array(totalDays + 1).fill(0);
  const spxEq = new Array(totalDays + 1).fill(0);
  const contrib = new Array(totalDays + 1).fill(0);

  for (let d = 0; d <= totalDays; d++) {
    let n = 0;
    let s = 0;
    let c = 0;
    for (const pp of pps) {
      if (d < pp.startDay) continue;
      const hedgeMult =
        d <= pp.endDay
          ? pp.path[d - pp.startDay] / pp.entry
          : pp.exit / pp.entry;
      n += PER_PICK_USD * hedgeMult;
      const spy0 = spyAt(pp.startDay);
      const spyD = d <= pp.endDay ? spyAt(d) : spyAt(pp.endDay);
      if (spy0 && spyD) s += PER_PICK_USD * (spyD / spy0);
      c += PER_PICK_USD;
    }
    nav[d] = Math.round(n * 100) / 100;
    spxEq[d] = Math.round(s * 100) / 100;
    contrib[d] = c;
  }

  return { dates, nav, spxEq, contrib, usingFallback };
}

// --- Main -------------------------------------------------------------------
async function main() {
  const { positions, INCEPTION, AS_OF, PER_PICK_USD } = await loadPositions();
  const tickers = new Set(["SPY"]);
  for (const p of positions) tickers.add(normalize(p.ticker));

  const period1 = Math.floor(new Date(INCEPTION).getTime() / 1000);
  const period2 = Math.floor(new Date(AS_OF).getTime() / 1000) + 7 * 86400;

  const { prices, failed } = await backfillPrices(
    [...tickers],
    period1,
    period2,
  );

  const out = buildPortfolio(positions, INCEPTION, AS_OF, PER_PICK_USD, prices);
  const path = resolve(root, "data/daily.json");
  writeFileSync(
    path,
    JSON.stringify({
      inception: INCEPTION,
      asOf: AS_OF,
      perPick: PER_PICK_USD,
      dates: out.dates,
      nav: out.nav,
      spxEq: out.spxEq,
      contrib: out.contrib,
      fallbackTickers: [...new Set(out.usingFallback)],
    }),
  );

  const last = out.dates.length - 1;
  console.log(`\nWrote data/daily.json`);
  console.log(`  inception → asOf: ${INCEPTION} → ${AS_OF}`);
  console.log(`  days: ${out.dates.length}`);
  console.log(`  contributed: $${out.contrib[last].toLocaleString()}`);
  console.log(`  nav:         $${Math.round(out.nav[last]).toLocaleString()}`);
  console.log(`  spx-equiv:   $${Math.round(out.spxEq[last]).toLocaleString()}`);
  console.log(`  multiple:    ${(out.nav[last] / out.contrib[last]).toFixed(2)}x`);
  console.log(`  vs spx:      ${((out.nav[last] / out.spxEq[last] - 1) * 100).toFixed(1)}%`);
  if (failed.length) console.log(`  yahoo fail:  ${failed.join(", ")}`);
  if (out.usingFallback.length)
    console.log(`  bridge fallback: ${[...new Set(out.usingFallback)].join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
