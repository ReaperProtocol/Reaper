import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("public launch surface", () => {
  it("links the live Reaper website and the active CI branch", () => {
    expect(readme).toContain("[Website](https://reaper-launch.vercel.app)");
    expect(readme).toContain("ci.yml?branch=master");
    expect(readme).not.toContain("ci.yml?branch=main");
    expect(packageJson.homepage).toBe("https://reaper-launch.vercel.app");
  });
});
