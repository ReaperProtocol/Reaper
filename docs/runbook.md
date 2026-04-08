# Reaper Runbook

## What Reaper Is For

Reaper helps the operator decide whether a distressed account is merely close to liquidation or actually worth chasing.

## Daily Operator Loop

1. Run `bun run dev`.
2. Read the distressed flow console for the top-ranked account.
3. Confirm oracle freshness, keeper race, and unwind quality together.
4. Escalate only the setups where edge still survives execution friction.

## What Gets Promoted

- healthy liquidation spread after penalties
- acceptable oracle age and drift
- keeper race probability strong enough to justify the attempt

## What Gets Demoted

- stale oracle conditions
- weak unwind quality
- marginal edge that disappears after fees and competition
