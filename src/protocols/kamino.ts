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

export function estimateLiquidationEdge(collateralUsd: number, borrowUsd: number, keeperRaceProbability: number): number {
  const slippageCost = collateralUsd * 0.003;
  const priorityFee = 8;
  const gross = collateralUsd * 0.05;
  return Number((gross - slippageCost - priorityFee - (1 - keeperRaceProbability) * 25 - borrowUsd * 0.002).toFixed(2));
}

export function deriveOracleAgeSeconds(healthFactor: number, collateralUsd: number): number {
  return Math.round(Math.min(config.MAX_ORACLE_AGE_SECONDS, 18 + (1.2 - Math.min(healthFactor, 1.2)) * 70 + collateralUsd / 20_000));
}

export function deriveOracleDriftBps(healthFactor: number, borrowUsd: number): number {
  return Math.round(12 + (1.2 - Math.min(healthFactor, 1.2)) * 80 + borrowUsd / 5_000);
}

export function deriveUnwindQuality(collateralUsd: number, borrowUsd: number): number {
  const leverage = borrowUsd / Math.max(collateralUsd, 1);
  return Number(Math.max(0.35, Math.min(0.92, 0.88 - leverage * 0.28 - collateralUsd / 5_000_000)).toFixed(2));
}

export async function fetchKaminoAtRisk(): Promise<Position[]> {
  const url = `${KAMINO_API}/v2/obligations?healthFactorBelow=${config.HEALTH_WARN_THRESHOLD}&limit=50`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Kamino API ${res.status}`);

  const data = (await res.json()) as { obligations: KaminoObligation[] };
  const positions: Position[] = [];

  for (const obligation of data.obligations ?? []) {
    const collateral = [...obligation.deposits].sort((left, right) => right.amountUsd - left.amountUsd)[0];
    const borrow = [...obligation.borrows].sort((left, right) => right.amountUsd - left.amountUsd)[0];
    if (!collateral || !borrow) continue;
    if (collateral.amountUsd < config.MIN_POSITION_USD) continue;

    const keeperRaceProbability = Number(Math.max(0.2, 1 - (1.2 - obligation.healthFactor)).toFixed(2));
    const oracleAgeSeconds = deriveOracleAgeSeconds(obligation.healthFactor, collateral.amountUsd);
    const oracleDriftBps = deriveOracleDriftBps(obligation.healthFactor, borrow.amountUsd);
    const unwindQuality = deriveUnwindQuality(collateral.amountUsd, borrow.amountUsd);

    positions.push({
      owner: obligation.obligationAddress,
      protocol: "kamino",
      collateralToken: collateral.symbol,
      borrowToken: borrow.symbol,
      collateralUsd: collateral.amountUsd,
      borrowUsd: borrow.amountUsd,
      healthFactor: obligation.healthFactor,
      liquidationPrice: Number((borrow.amountUsd / Math.max(collateral.amountUsd, 1)).toFixed(4)),
      riskLevel: toRiskLevel(obligation.healthFactor),
      oracleAgeSeconds,
      oracleDriftBps,
      keeperRaceProbability,
      unwindQuality,
      liquidationEdgeUsd: estimateLiquidationEdge(collateral.amountUsd, borrow.amountUsd, keeperRaceProbability),
      lastUpdatedAt: Date.now(),
    });
  }

  return positions;
}
