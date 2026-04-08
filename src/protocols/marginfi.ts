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

function estimateLiquidationEdge(collateralUsd: number, borrowUsd: number, keeperRaceProbability: number): number {
  const gross = collateralUsd * 0.045;
  const costs = collateralUsd * 0.0025 + borrowUsd * 0.0015 + 10;
  return Number((gross - costs - (1 - keeperRaceProbability) * 30).toFixed(2));
}

export async function fetchMarginFiAtRisk(): Promise<Position[]> {
  const url = `${MARGINFI_API}/accounts/at-risk?maxHealthFactor=${config.HEALTH_WARN_THRESHOLD}&minEquity=${config.MIN_POSITION_USD}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`MarginFi API ${res.status}`);

  const accounts = (await res.json()) as MarginfiAccount[];
  return accounts.map((account) => {
    const collateral = account.assets.find((asset) => asset.side === "asset");
    const borrow = account.assets.find((asset) => asset.side === "liability");
    const keeperRaceProbability = Number(Math.max(0.18, 1 - (1.25 - account.healthFactor) * 1.1).toFixed(2));
    const collateralUsd = collateral?.usdValue ?? 0;
    const borrowUsd = borrow?.usdValue ?? 0;

    return {
      owner: account.address,
      protocol: "marginfi" as const,
      collateralToken: collateral?.token ?? "UNKNOWN",
      borrowToken: borrow?.token ?? "UNKNOWN",
      collateralUsd,
      borrowUsd,
      healthFactor: account.healthFactor,
      liquidationPrice: 0,
      riskLevel: toRiskLevel(account.healthFactor),
      oracleAgeSeconds: 54,
      oracleDriftBps: 34,
      keeperRaceProbability,
      unwindQuality: 0.66,
      liquidationEdgeUsd: estimateLiquidationEdge(collateralUsd, borrowUsd, keeperRaceProbability),
      lastUpdatedAt: Date.now(),
    };
  });
}
