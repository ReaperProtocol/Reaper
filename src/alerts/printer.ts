import type { RiskAlert, Position } from "../core/types.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const ORANGE = "\x1b[33m";
const YELLOW = "\x1b[93m";
const DIM = "\x1b[2m";

const URGENCY_COLOR: Record<string, string> = {
  critical: RED,
  high: RED,
  medium: ORANGE,
  low: YELLOW,
};

function hfBar(hf: number): string {
  const capped = Math.min(hf, 2);
  const pct = Math.max(0, Math.min(1, (capped - 1) / 1));
  const filled = Math.round(pct * 20);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  const color = hf < 1.05 ? RED : hf < 1.15 ? ORANGE : YELLOW;
  return `${color}[${bar}]${RESET} ${hf.toFixed(3)}`;
}

export function printRiskAlert(alert: RiskAlert): void {
  const color = URGENCY_COLOR[alert.urgency] ?? "";
  const position = alert.position;

  console.log(`\n  ${BOLD}${color}${alert.urgency.toUpperCase()}${RESET} ${position.protocol.toUpperCase()} | ${position.collateralToken}/${position.borrowToken}`);
  console.log(`     Health: ${hfBar(position.healthFactor)}`);
  console.log(`     Edge:   $${position.liquidationEdgeUsd.toFixed(2)} | keeper ${position.keeperRaceProbability.toFixed(2)} | unwind ${position.unwindQuality.toFixed(2)}`);
  console.log(`     Oracle: age ${position.oracleAgeSeconds}s | drift ${position.oracleDriftBps} bps`);
  console.log(`     ${alert.message}`);
  console.log(`     ${BOLD}-> ${alert.actionable}${RESET}`);
  console.log(`     ${DIM}${position.owner.slice(0, 12)}...${RESET}`);
}

export function printRiskBoard(alerts: RiskAlert[], positions: Position[]): void {
  const bar = "-".repeat(74);
  const critical = positions.filter((position) => position.riskLevel === "critical").length;
  const danger = positions.filter((position) => position.riskLevel === "danger").length;

  console.log(`\n${bar}`);
  console.log(`  ${BOLD}REAPER // DISTRESSED FLOW CONSOLE${RESET}`);
  console.log(`  ${RED}${critical} critical${RESET}  ${ORANGE}${danger} danger${RESET}  ${positions.length} total distressed accounts`);
  console.log(bar);

  if (alerts.length === 0) {
    console.log(`  ${DIM}no actionable distressed-flow opportunities this cycle${RESET}`);
  } else {
    for (const alert of alerts) printRiskAlert(alert);
  }
  console.log(`\n${bar}\n`);
}
