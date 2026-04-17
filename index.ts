import { scanAllProtocols } from "./src/scanner/aggregator.js";
import { runReaperAgent } from "./src/agent/loop.js";
import { printRiskBoard } from "./src/alerts/printer.js";
import { config } from "./src/core/config.js";
import { log } from "./src/core/logger.js";

async function scan(): Promise<void> {
  const startedAt = Date.now();

  try {
    const positions = await scanAllProtocols();
    log.info(`Scanned ${positions.length} distressed candidates across ${config.PROTOCOLS.length} protocols`);

    if (positions.length === 0) {
      log.info("No distressed positions found");
      return;
    }

    const alerts = await runReaperAgent(positions);
    if (alerts.length === 0) {
      log.info("No liquidation-edge alerts qualified this cycle");
      return;
    }

    printRiskBoard(alerts, positions);
  } finally {
    const durationMs = Date.now() - startedAt;
    log.info("Reaper scan complete", { durationMs });

    if (durationMs > config.SCAN_INTERVAL_MS) {
      log.warn("Reaper scan exceeded configured interval", {
        durationMs,
        intervalMs: config.SCAN_INTERVAL_MS,
      });
    }
  }
}

async function main(): Promise<void> {
  log.info("Reaper v0.1.1 - distressed-flow hunter starting");
  log.info(`Protocols: ${config.PROTOCOLS} | Interval: ${config.SCAN_INTERVAL_MS / 1000}s`);
  log.info(
    `Thresholds: warn=${config.HEALTH_WARN_THRESHOLD} danger=${config.HEALTH_DANGER_THRESHOLD} oracleDrift=${config.ORACLE_DRIFT_THRESHOLD_BPS}bps`,
  );

  let scanInFlight = false;
  let skippedScans = 0;

  const tick = async () => {
    if (scanInFlight) {
      skippedScans++;
      log.warn("Skipping distressed-flow scan because the previous cycle is still running", {
        skippedScans,
      });
      return;
    }

    scanInFlight = true;
    try {
      await scan();
    } catch (e) {
      log.error("Scan error:", e);
    } finally {
      scanInFlight = false;
    }
  };

  await tick();
  setInterval(() => {
    void tick();
  }, config.SCAN_INTERVAL_MS);
}

main().catch((e) => {
  log.error("Fatal:", e);
  process.exit(1);
});
