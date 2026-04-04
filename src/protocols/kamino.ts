import type { Position, RiskLevel } from "../core/types.js";
import { config } from "../core/config.js";

const KAMINO_API = "https://api.kamino.finance";

interface KaminoObligation {
  obligationAddress: string;
  loanToValue: number;
  healthFactor: number;
  deposits: Array<{ symbol: string; amount: number; amountUsd: number }>;
  borrows: Array<{ symbol: string; amount: number; amountUsd: number }>;
}

function toRiskLevel(hf: number): RiskLevel {
  if (hf >= 1.5) return "safe";
  if (hf >= config.HEALTH_WARN_THRESHOLD) return "watch";
  if (hf >= config.HEALTH_DANGER_THRESHOLD) return "danger";
  return "critical";
}

export async function fetchKaminoAtRisk(): Promise<Position[]> {
  // Fetch obligations near liquidation threshold
  const url = `${KAMINO_API}/v2/obligations?healthFactorBelow=${config.HEALTH_WARN_THRESHOLD}&limit=50`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Kamino API ${res.status}`);

  const data = await res.json() as { obligations: KaminoObligation[] };
  const positions: Position[] = [];

  for (const obl of data.obligations ?? []) {
    const collateral = obl.deposits[0];
    const borrow = obl.borrows[0];
    if (!collateral || !borrow) continue;

    const collateralUsd = collateral.amountUsd;
    const borrowUsd = borrow.amountUsd;
    if (collateralUsd < config.MIN_POSITION_USD) continue;

    positions.push({
      owner: obl.obligationAddress,
      protocol: "kamino",
      collateralToken: collateral.symbol,
      borrowToken: borrow.symbol,
      collateralUsd,
      borrowUsd,
      healthFactor: obl.healthFactor,
      liquidationPrice: 0,
      riskLevel: toRiskLevel(obl.healthFactor),
      lastUpdatedAt: Date.now(),
    });
  }

  return positions;
}
