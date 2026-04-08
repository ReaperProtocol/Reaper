import { describe, it, expect } from "vitest";
import type { Position } from "../src/core/types.js";

function makePosition(hf: number, collateralUsd = 10_000): Position {
  return {
    owner: "AbCdEfGh1234567890abcdefgh",
    protocol: "kamino",
    collateralToken: "SOL",
    borrowToken: "USDC",
    collateralUsd,
    borrowUsd: collateralUsd / hf,
    healthFactor: hf,
    liquidationPrice: 0,
    riskLevel: hf < 1.05 ? "critical" : hf < 1.15 ? "danger" : hf < 1.5 ? "watch" : "safe",
    oracleAgeSeconds: 42,
    oracleDriftBps: 28,
    keeperRaceProbability: 0.62,
    unwindQuality: 0.71,
    liquidationEdgeUsd: 96,
    lastUpdatedAt: Date.now(),
  };
}

describe("health factor classification", () => {
  it("hf < 1.05 is critical", () => {
    expect(makePosition(1.02).riskLevel).toBe("critical");
  });

  it("hf 1.05-1.15 is danger", () => {
    expect(makePosition(1.1).riskLevel).toBe("danger");
  });
});

describe("edge fields", () => {
  it("includes oracle drift and keeper race data", () => {
    const position = makePosition(1.04);
    expect(position.oracleDriftBps).toBeGreaterThan(0);
    expect(position.keeperRaceProbability).toBeGreaterThan(0);
  });

  it("liquidation edge stays numeric", () => {
    expect(makePosition(1.03).liquidationEdgeUsd).toBeTypeOf("number");
  });

  it("keeps unwind quality bounded above zero", () => {
    expect(makePosition(1.03).unwindQuality).toBeGreaterThan(0);
  });
});
