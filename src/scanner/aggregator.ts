import type { Position } from "../core/types.js";
import { fetchKaminoAtRisk } from "../protocols/kamino.js";
import { fetchMarginFiAtRisk } from "../protocols/marginfi.js";
import { TRACKED_PROTOCOLS } from "../core/config.js";
import { log } from "../core/logger.js";

export async function scanAllProtocols(): Promise<Position[]> {
  const fetchers: Array<Promise<Position[]>> = [];

  if (TRACKED_PROTOCOLS.includes("kamino")) {
    fetchers.push(fetchKaminoAtRisk().catch((e) => {
      log.warn("Kamino fetch failed:", e.message);
      return [];
    }));
  }
  if (TRACKED_PROTOCOLS.includes("marginfi")) {
    fetchers.push(fetchMarginFiAtRisk().catch((e) => {
      log.warn("MarginFi fetch failed:", e.message);
      return [];
    }));
  }

  const all = (await Promise.all(fetchers)).flat();
  all.sort((a, b) => b.liquidationEdgeUsd * b.keeperRaceProbability - a.liquidationEdgeUsd * a.keeperRaceProbability);

  log.info(`${all.length} distressed positions found across ${fetchers.length} protocols`);
  return all;
}

export function groupByRisk(positions: Position[]): Record<string, Position[]> {
  const groups: Record<string, Position[]> = { critical: [], danger: [], watch: [] };
  for (const position of positions) {
    if (position.riskLevel !== "safe") groups[position.riskLevel]?.push(position);
  }
  return groups;
}
