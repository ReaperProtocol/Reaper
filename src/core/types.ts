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
  lastUpdatedAt: number;
}

export interface LiquidationEvent {
  id: string;
  protocol: Protocol;
  owner: string;
  collateralToken: string;
  borrowToken: string;
  collateralSeized: number;
  debtRepaid: number;
  usdValue: number;
  txSignature: string;
  timestamp: number;
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
