import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const avatar = readFileSync(new URL("../assets/reaper-avatar.png", import.meta.url));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("public launch surface", () => {
  it("positions Reaper as a current Robinhood recovery-edge hunter launching on Pons", () => {
    expect(readme).toContain("Robinhood post-selloff recovery-edge hunter");
    expect(readme).toContain('<img src="assets/reaper-avatar.png"');
    expect(avatar.byteLength).toBeGreaterThan(1_024);
    expect(readme).toContain("[Website](https://reaperedge.com/)");
    expect(readme).toContain("[Launch venue](https://pons.family/)");
    expect(readme).toContain("Snapshot: September 4, 2026 · 12:27 UTC");
    expect(readme).not.toMatch(/\bSolana\b|Pump\.fun|Polymarket|Helius|oracle|keeper|liquidation/i);
    expect(readme).toContain("ci.yml?branch=master");
    expect(readme).not.toContain("ci.yml?branch=main");
    expect(packageJson.description).toContain("Robinhood post-selloff");
    expect(packageJson.homepage).toBe("https://reaperedge.com/");
    expect(packageJson.keywords).toContain("robinhood");
    expect(packageJson.keywords).toContain("pons");
    expect(packageJson.keywords).not.toContain("solana");
  });
});
