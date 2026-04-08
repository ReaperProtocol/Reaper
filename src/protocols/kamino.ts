import type { Position, RiskLevel } from "../core/types.js";
import { config } from "../core/config.js";

const KAMINO_API = "https://api.kamino.finance";

interface KaminoObligation {
  obligationAddress: string;
  healthFactor: number;
  deposits: Array<{ symbol: string; amountUsd: number }>;
  borrows: Array<{ symbol: string; amountUsd: number }>;
}

function toRiskLevel(hf: number): RiskLevel {
  if (hf >= 1.5) return "safe";
  if (hf >= config.HEALTH_WARN_THRESHOLD) return "watch";
  if (hf >= config.HEALTH_DANGER_THRESHOLD) return "danger";
  return "critical";
}

function estimateLiquidationEdge(collateralUsd: number, borrowUsd: number, keeperRaceProbability: number): number {
  const slippageCost = collateralUsd * 0.003;
  const priorityFee = 8;
  const gross = collateralUsd * 0.05;
  return Number((gross - slippageCost - priorityFee - (1 - keeperRaceProbability) * 25 - borrowUsd * 0.002).toFixed(2));
}

export async function fetchKaminoAtRisk(): Promise<Position[]> {
  const url = `${KAMINO_API}/v2/obligations?healthFactorBelow=${config.HEALTH_WARN_THRESHOLD}&limit=50`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Kamino API ${res.status}`);

  const data = (await res.json()) as { obligations: KaminoObligation[] };
  const positions: Position[] = [];

  for (const obligation of data.obligations ?? []) {
    const collateral = obligation.deposits[0];
    const borrow = obligation.borrows[0];
    if (!collateral || !borrow) continue;
    if (collateral.amountUsd < config.MIN_POSITION_USD) continue;

    const keeperRaceProbability = Number(Math.max(0.2, 1 - (1.2 - obligation.healthFactor)).toFixed(2));

    positions.push({
      owner: obligation.obligationAddress,
      protocol: "kamino",
      collateralToken: collateral.symbol,
      borrowToken: borrow.symbol,
      collateralUsd: collateral.amountUsd,
      borrowUsd: borrow.amountUsd,
      healthFactor: obligation.healthFactor,
      liquidationPrice: 0,
      riskLevel: toRiskLevel(obligation.healthFactor),
      oracleAgeSeconds: 32,
      oracleDriftBps: 21,
      keeperRaceProbability,
      unwindQuality: 0.78,
      liquidationEdgeUsd: estimateLiquidationEdge(collateral.amountUsd, borrow.amountUsd, keeperRaceProbability),
      lastUpdatedAt: Date.now(),
    });
  }

  return positions;
}
