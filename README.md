<div align="center">

# Reaper

**Liquidation risk monitor for Solana DeFi.**
Watches every leveraged position on Kamino, MarginFi, and Drift. Fires alerts before the reaper arrives.

[![Build](https://img.shields.io/github/actions/workflow/status/ReaperProtocol/Reaper/ci.yml?branch=main&style=flat-square&label=Build)](https://github.com/ReaperProtocol/Reaper/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
[![Built with Claude Agent SDK](https://img.shields.io/badge/Built%20with-Claude%20Agent%20SDK-cc7800?style=flat-square)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)](https://www.typescriptlang.org/)

</div>

---

In DeFi, liquidations happen in seconds. A 5% candle can wipe a $100K position before anyone reacts. The problem isn't the market — it's that most tools only show you your own positions.

`Reaper` scans every lending protocol every 30 seconds, finds positions approaching the liquidation threshold, and uses Claude to assess urgency, size, and volatility context. Critical positions get escalated immediately. You see what's about to break before it does.

```
SCAN → ASSESS → PRIORITIZE → ALERT
```

---

## Risk Dashboard

![Reaper Risk Monitor](assets/preview-risk.svg)

---

## Liquidation Event

![Reaper Liquidation](assets/preview-liquidation.svg)

---

## Architecture

```
┌──────────────────────────────────────────────┐
│          Protocol Scanners                    │
│  Kamino API · MarginFi API · Drift SDK       │
│  Health factor · collateral · borrow size    │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│           Risk Aggregator                     │
│  Merge · dedupe · sort by health factor      │
│  Group: critical / danger / watch            │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│         Claude Reaper Agent                   │
│  get_risk_summary → get_critical_positions   │
│  → get_position_detail → emit_risk_alert     │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│             Alert Printer                     │
│  Health bars · urgency icons · action notes  │
└──────────────────────────────────────────────┘
```

---

## Health Factor Zones

| Zone | Range | Meaning |
|------|-------|---------|
| ☠ **CRITICAL** | < 1.05 | Liquidation imminent |
| ⚠ **DANGER** | 1.05–1.15 | 5–10% move liquidates |
| **WATCH** | 1.15–1.50 | Monitor closely |
| **SAFE** | > 1.50 | No immediate risk |

---

## Quick Start

```bash
git clone https://github.com/ReaperProtocol/Reaper
cd Reaper && bun install
cp .env.example .env
bun run dev
```

---

## Configuration

```bash
ANTHROPIC_API_KEY=sk-ant-...
HELIUS_API_KEY=...
PROTOCOLS=kamino,marginfi,drift
HEALTH_WARN_THRESHOLD=1.15
HEALTH_DANGER_THRESHOLD=1.05
MIN_POSITION_USD=5000
SCAN_INTERVAL_MS=30000
```

---

## License

MIT

---

*watch the health. survive the market.*
