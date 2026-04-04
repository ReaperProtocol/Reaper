import { scanAllProtocols } from "./src/scanner/aggregator.js";
import { runReaperAgent } from "./src/agent/loop.js";
import { printRiskBoard } from "./src/alerts/printer.js";
import { config } from "./src/core/config.js";
import { log } from "./src/core/logger.js";

async function scan(): Promise<void> {
  const positions = await scanAllProtocols();
  if (positions.length === 0) {
    log.info("No at-risk positions found");
    return;
  }
  const alerts = await runReaperAgent(positions);
  printRiskBoard(alerts, positions);
}

async function main(): Promise<void> {
  log.info("Reaper v0.1.0 — liquidation monitor starting");
  log.info(`Protocols: ${config.PROTOCOLS} · Interval: ${config.SCAN_INTERVAL_MS / 1000}s`);
  log.info(`Thresholds: warn=${config.HEALTH_WARN_THRESHOLD} danger=${config.HEALTH_DANGER_THRESHOLD}`);

  await scan();
  setInterval(() => scan().catch((e) => log.error("Scan error:", e)), config.SCAN_INTERVAL_MS);
}

main().catch((e) => { log.error("Fatal:", e); process.exit(1); });
