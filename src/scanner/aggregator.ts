import type { Position } from "../core/types.js";
import { fetchKaminoAtRisk } from "../protocols/kamino.js";
import { fetchMarginFiAtRisk } from "../protocols/marginfi.js";
import { config, TRACKED_PROTOCOLS } from "../core/config.js";
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
  const actionable = all.filter(
    (position) =>
      position.liquidationEdgeUsd >= config.MIN_LIQUIDATION_EDGE_USD &&
      position.oracleDriftBps <= config.ORACLE_DRIFT_THRESHOLD_BPS &&
      position.oracleAgeSeconds <= config.MAX_ORACLE_AGE_SECONDS,
  );
  actionable.sort((a, b) => b.liquidationEdgeUsd * b.keeperRaceProbability - a.liquidationEdgeUsd * a.keeperRaceProbability);

  log.info(`${actionable.length} distressed positions found across ${fetchers.length} protocols after oracle and edge filters`);
  return actionable;
}

export function groupByRisk(positions: Position[]): Record<string, Position[]> {
  const groups: Record<string, Position[]> = { critical: [], danger: [], watch: [] };
  for (const position of positions) {
    if (position.riskLevel !== "safe") groups[position.riskLevel]?.push(position);
  }
  return groups;
}
