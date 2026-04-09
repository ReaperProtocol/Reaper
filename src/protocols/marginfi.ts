import type { Position, RiskLevel } from "../core/types.js";
import { config } from "../core/config.js";

const MARGINFI_API = "https://marginfi.com/api/v1";

interface MarginfiAccount {
  address: string;
  healthFactor: number;
  equity: number;
  assets: Array<{ token: string; usdValue: number; side: "asset" | "liability" }>;
}

function toRiskLevel(hf: number): RiskLevel {
  if (hf >= 1.5) return "safe";
  if (hf >= config.HEALTH_WARN_THRESHOLD) return "watch";
  if (hf >= config.HEALTH_DANGER_THRESHOLD) return "danger";
  return "critical";
}

export function estimateLiquidationEdge(collateralUsd: number, borrowUsd: number, keeperRaceProbability: number): number {
  const gross = collateralUsd * 0.045;
  const costs = collateralUsd * 0.0025 + borrowUsd * 0.0015 + 10;
  return Number((gross - costs - (1 - keeperRaceProbability) * 30).toFixed(2));
}

export function deriveOracleAgeSeconds(healthFactor: number, equityUsd: number): number {
  return Math.round(Math.min(config.MAX_ORACLE_AGE_SECONDS, 24 + (1.25 - Math.min(healthFactor, 1.25)) * 65 + equityUsd / 30_000));
}

export function deriveOracleDriftBps(healthFactor: number, borrowUsd: number): number {
  return Math.round(16 + (1.25 - Math.min(healthFactor, 1.25)) * 90 + borrowUsd / 4_000);
}

export function deriveUnwindQuality(collateralUsd: number, borrowUsd: number): number {
  const leverage = borrowUsd / Math.max(collateralUsd, 1);
  return Number(Math.max(0.28, Math.min(0.88, 0.8 - leverage * 0.24 - borrowUsd / 4_000_000)).toFixed(2));
}

export async function fetchMarginFiAtRisk(): Promise<Position[]> {
  const url = `${MARGINFI_API}/accounts/at-risk?maxHealthFactor=${config.HEALTH_WARN_THRESHOLD}&minEquity=${config.MIN_POSITION_USD}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`MarginFi API ${res.status}`);

  const accounts = (await res.json()) as MarginfiAccount[];
  return accounts.map((account) => {
    const collateral = [...account.assets]
      .filter((asset) => asset.side === "asset")
      .sort((left, right) => right.usdValue - left.usdValue)[0];
    const borrow = [...account.assets]
      .filter((asset) => asset.side === "liability")
      .sort((left, right) => right.usdValue - left.usdValue)[0];
    const keeperRaceProbability = Number(Math.max(0.18, 1 - (1.25 - account.healthFactor) * 1.1).toFixed(2));
    const collateralUsd = collateral?.usdValue ?? 0;
    const borrowUsd = borrow?.usdValue ?? 0;
    const oracleAgeSeconds = deriveOracleAgeSeconds(account.healthFactor, account.equity);
    const oracleDriftBps = deriveOracleDriftBps(account.healthFactor, borrowUsd);
    const unwindQuality = deriveUnwindQuality(collateralUsd, borrowUsd);

    return {
      owner: account.address,
      protocol: "marginfi" as const,
      collateralToken: collateral?.token ?? "UNKNOWN",
      borrowToken: borrow?.token ?? "UNKNOWN",
      collateralUsd,
      borrowUsd,
      healthFactor: account.healthFactor,
      liquidationPrice: Number((borrowUsd / Math.max(collateralUsd, 1)).toFixed(4)),
      riskLevel: toRiskLevel(account.healthFactor),
      oracleAgeSeconds,
      oracleDriftBps,
      keeperRaceProbability,
      unwindQuality,
      liquidationEdgeUsd: estimateLiquidationEdge(collateralUsd, borrowUsd, keeperRaceProbability),
      lastUpdatedAt: Date.now(),
    };
  });
}
