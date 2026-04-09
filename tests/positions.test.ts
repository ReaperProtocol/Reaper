import { describe, it, expect } from "vitest";
import type { Position } from "../src/core/types.js";
import {
  estimateLiquidationEdge as estimateKaminoEdge,
  deriveOracleAgeSeconds as deriveKaminoOracleAgeSeconds,
  deriveOracleDriftBps as deriveKaminoOracleDriftBps,
  deriveUnwindQuality as deriveKaminoUnwindQuality,
} from "../src/protocols/kamino.js";
import {
  estimateLiquidationEdge as estimateMarginfiEdge,
  deriveOracleAgeSeconds as deriveMarginfiOracleAgeSeconds,
  deriveOracleDriftBps as deriveMarginfiOracleDriftBps,
  deriveUnwindQuality as deriveMarginfiUnwindQuality,
} from "../src/protocols/marginfi.js";

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

describe("protocol estimators", () => {
  it("kamino estimators stay numeric and bounded", () => {
    expect(estimateKaminoEdge(25_000, 18_000, 0.62)).toBeTypeOf("number");
    expect(deriveKaminoOracleAgeSeconds(1.04, 25_000)).toBeGreaterThan(0);
    expect(deriveKaminoOracleDriftBps(1.04, 18_000)).toBeGreaterThan(0);
    expect(deriveKaminoUnwindQuality(25_000, 18_000)).toBeGreaterThan(0.3);
  });

  it("marginfi estimators stay numeric and bounded", () => {
    expect(estimateMarginfiEdge(22_000, 14_000, 0.58)).toBeTypeOf("number");
    expect(deriveMarginfiOracleAgeSeconds(1.06, 28_000)).toBeGreaterThan(0);
    expect(deriveMarginfiOracleDriftBps(1.06, 14_000)).toBeGreaterThan(0);
    expect(deriveMarginfiUnwindQuality(22_000, 14_000)).toBeGreaterThan(0.25);
  });
});
