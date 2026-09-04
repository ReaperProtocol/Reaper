<div align="center">

# Reaper

<img src="assets/reaper-avatar.png" alt="Reaper avatar" width="128" />

**Robinhood post-selloff recovery-edge hunter.**
Reaper ranks sharp crypto selloffs by rebound participation, quoted spread, available depth, and recovery quality before a setup reaches the board.

[Website](https://reaperedge.com/) · [Launch venue](https://pons.family/)

[![Build](https://img.shields.io/github/actions/workflow/status/ReaperProtocol/Reaper/ci.yml?branch=master&style=flat-square&label=Build)](https://github.com/ReaperProtocol/Reaper/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)
[![Built with Claude Agent SDK](https://img.shields.io/badge/Built%20with-Claude%20Agent%20SDK-2f9ee9?style=flat-square)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk)

</div>

---

Most assets trade close to fair after a selloff. Reaper looks for the smaller set where participation returns, spreads stay controlled, and the book still supports an exit.

`SCAN -> MEASURE THE SELL-OFF -> CHECK RECOVERY -> SCORE -> HUNT OR SKIP`

## September 4 Market Board

Snapshot: September 4, 2026 · 12:27 UTC

| Asset | Price | 24h move | Recovery score | Decision |
|-------|------:|---------:|---------------:|----------|
| LINK | $12.02 | +6.56% | 86/100 | HUNT |
| XRP | $1.45 | +5.84% | 78/100 | WATCH |
| DOGE | $0.08768 | +5.46% | 73/100 | WATCH |
| ETH | $2,521.04 | +4.75% | 68/100 | WATCH |
| BTC | $81,172 | +4.16% | 55/100 | SKIP |
| AAVE | $135.75 | +3.59% | 31/100 | EXPIRED |

The snapshot is fixed to the timestamp above. Reaper does not present historical values as a live feed.

## At A Glance

- `Use case` — rank recovery setups after a sharp selloff
- `Primary inputs` — rebound participation, quoted spread, depth quality, and time since the low
- `Primary failure mode` — treating a bounce as proof that recovery is durable
- `Output` — HUNT, WATCH, SKIP, or EXPIRED with the supporting score

## What Reaper Measures

### Recovery Participation

Price alone does not prove that buyers returned. Reaper looks for participation that persists beyond the first reactive print.

### Spread Quality

A strong-looking rebound loses value when the quoted spread absorbs the edge. Reaper rejects candidates that remain expensive to enter or exit.

### Available Depth

The board favors assets with enough visible depth to support the intended size. Thin setups stay out even when the headline move looks attractive.

### Time Since The Low

Very early rebounds lack evidence. Very late rebounds often lose the asymmetry. Reaper scores the window between those extremes.

## Decision Gates

A candidate reaches HUNT only when all five checks agree:

1. the quoted spread stays inside the configured ceiling
2. recovery participation clears the minimum score
3. the current move still sits inside the valid recovery window
4. the book supports the intended size
5. the setup is not a duplicate of an active name

Every rejected item keeps its reason. Quiet output means the board found no setup worth promoting.

## Example Output

```text
REAPER // RECOVERY TICKET

asset             LINK
price             $12.02
24h move          +6.56%
quoted spread     0.18%
depth             deep
recovery score    86/100
decision          HUNT

reason: participation returned while spread and depth stayed inside the operating limits
```

## Operating Loop

1. pull the supported Robinhood crypto snapshot
2. identify assets recovering from a meaningful session low
3. score participation, spread, depth, and timing
4. remove duplicate, late, or weak candidates
5. rank the survivors and print one clear decision per asset

The loop stays deterministic around its gates. The model explains the setup after the data checks pass; it does not override a failed gate.

## Risk Controls

- `spread ceiling` — blocks rebounds whose execution cost consumes the edge
- `recovery floor` — requires enough participation before promotion
- `time window` — removes rebounds that are too early or already stale
- `position cap` — limits the number of promoted names
- `dry mode` — keeps the scaffold observational unless execution is configured explicitly

## Quick Start

```bash
git clone https://github.com/ReaperProtocol/Reaper
cd Reaper
npm install
cp .env.example .env
npm run dev
```

## License

MIT

---

*rank the recovery, not the drama.*
