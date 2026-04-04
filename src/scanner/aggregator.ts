import type { Position } from "../core/types.js";
import { fetchKaminoAtRisk } from "../protocols/kamino.js";
import { fetchMarginFiAtRisk } from "../protocols/marginfi.js";
import { config, TRACKED_PROTOCOLS } from "../core/config.js";
import { log } from "../core/logger.js";

export async function scanAllProtocols(): Promise<Position[]> {
  const fetchers: Array<Promise<Position[]>> = [];

  if (TRACKED_PROTOCOLS.includes("kamino")) {
    fetchers.push(fetchKaminoAtRisk().catch((e) => { log.warn("Kamino fetch failed:", e.message); return []; }));
  }
  if (TRACKED_PROTOCOLS.includes("marginfi")) {
    fetchers.push(fetchMarginFiAtRisk().catch((e) => { log.warn("MarginFi fetch failed:", e.message); return []; }));
  }

  const results = await Promise.all(fetchers);
  const all = results.flat();

  // sort by health factor ascending (most at risk first)
  all.sort((a, b) => a.healthFactor - b.healthFactor);

  log.info(`${all.length} at-risk positions found across ${fetchers.length} protocols`);
  return all;
}

export function groupByRisk(positions: Position[]): Record<string, Position[]> {
  const groups: Record<string, Position[]> = { critical: [], danger: [], watch: [] };
  for (const p of positions) {
    if (p.riskLevel !== "safe") groups[p.riskLevel]?.push(p);
  }
  return groups;
}
