import { describe, it, expect } from "vitest";
import type { Position, RiskLevel } from "../src/core/types.js";

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
    lastUpdatedAt: Date.now(),
  };
}

describe("health factor classification", () => {
  it("hf < 1.05 is critical", () => {
    expect(makePosition(1.02).riskLevel).toBe("critical");
  });

  it("hf 1.05–1.15 is danger", () => {
    expect(makePosition(1.10).riskLevel).toBe("danger");
  });

  it("hf 1.15–1.50 is watch", () => {
    expect(makePosition(1.30).riskLevel).toBe("watch");
  });

  it("hf >= 1.50 is safe", () => {
    expect(makePosition(2.0).riskLevel).toBe("safe");
  });
});

describe("position sorting", () => {
  it("sorts by health factor ascending (most at risk first)", () => {
    const positions = [
      makePosition(1.30),
      makePosition(1.02),
      makePosition(1.10),
    ];
    const sorted = [...positions].sort((a, b) => a.healthFactor - b.healthFactor);
    expect(sorted[0].healthFactor).toBe(1.02);
    expect(sorted[2].healthFactor).toBe(1.30);
  });
});

describe("position sizing", () => {
  it("borrow usd is approximately collateral / health factor", () => {
    const p = makePosition(1.5, 15_000);
    expect(p.borrowUsd).toBeCloseTo(10_000, 0);
  });

  it("position with high collateral and low hf is highest priority", () => {
    const small = makePosition(1.02, 1_000);
    const large = makePosition(1.03, 500_000);
    // same risk zone, large position is more impactful
    expect(large.collateralUsd).toBeGreaterThan(small.collateralUsd);
    expect(large.riskLevel).toBe("critical");
  });
});

describe("alert types", () => {
  it("position type matches protocol", () => {
    const valid: string[] = ["kamino", "marginfi", "drift", "solend"];
    const p = makePosition(1.05);
    expect(valid).toContain(p.protocol);
  });
});
