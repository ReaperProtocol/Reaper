export type Protocol = "kamino" | "marginfi" | "drift" | "solend";
export type RiskLevel = "safe" | "watch" | "danger" | "critical";

export interface Position {
  owner: string;
  protocol: Protocol;
  collateralToken: string;
  borrowToken: string;
  collateralUsd: number;
  borrowUsd: number;
  healthFactor: number;
  liquidationPrice: number;
  riskLevel: RiskLevel;
  oracleAgeSeconds: number;
  oracleDriftBps: number;
  keeperRaceProbability: number;
  unwindQuality: number;
  liquidationEdgeUsd: number;
  lastUpdatedAt: number;
}

export interface RiskAlert {
  id: string;
  type: "at_risk" | "liquidated";
  position: Position;
  urgency: "low" | "medium" | "high" | "critical";
  message: string;
  actionable: string;
  confidence: number;
  generatedAt: number;
}
