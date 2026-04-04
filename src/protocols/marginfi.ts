import type { Position, RiskLevel } from "../core/types.js";
import { config } from "../core/config.js";

const MARGINFI_API = "https://marginfi.com/api/v1";

interface MarginfiAccount {
  address: string;
  healthFactor: number;
  equity: number;
  liabilities: number;
  assets: Array<{ token: string; usdValue: number; side: "asset" | "liability" }>;
}

function toRiskLevel(hf: number): RiskLevel {
  if (hf >= 1.5) return "safe";
  if (hf >= config.HEALTH_WARN_THRESHOLD) return "watch";
  if (hf >= config.HEALTH_DANGER_THRESHOLD) return "danger";
  return "critical";
}

export async function fetchMarginFiAtRisk(): Promise<Position[]> {
  const url = `${MARGINFI_API}/accounts/at-risk?maxHealthFactor=${config.HEALTH_WARN_THRESHOLD}&minEquity=${config.MIN_POSITION_USD}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`MarginFi API ${res.status}`);

  const accounts = await res.json() as MarginfiAccount[];
  return accounts.map((acc) => {
    const collateral = acc.assets.filter((a) => a.side === "asset")[0];
    const borrow = acc.assets.filter((a) => a.side === "liability")[0];
    return {
      owner: acc.address,
      protocol: "marginfi" as const,
      collateralToken: collateral?.token ?? "UNKNOWN",
      borrowToken: borrow?.token ?? "UNKNOWN",
      collateralUsd: collateral?.usdValue ?? 0,
      borrowUsd: borrow?.usdValue ?? 0,
      healthFactor: acc.healthFactor,
      liquidationPrice: 0,
      riskLevel: toRiskLevel(acc.healthFactor),
      lastUpdatedAt: Date.now(),
    };
  });
}
