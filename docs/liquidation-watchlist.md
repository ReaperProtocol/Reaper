# Liquidation Watchlist

Reaper should maintain a small watchlist of stressed setups instead of chasing every unhealthy account on chain.

## Put a position on the watchlist when

- Health is deteriorating faster than collateral quality suggests.
- Oracle drift or mark dislocation can change liquidation incentives.
- The keeper race looks competitive enough that timing matters.

## Remove it when

- The owner delevers and health stabilizes.
- The remaining edge depends on unrealistic execution speed.
- The position only looks interesting because the oracle briefly glitched.

## Why this matters

A compact watchlist makes the operator loop sharper and keeps alerts tied to real opportunity rather than generic stress.
