# Reaper Issue Drafts

## Oracle drift can still make marginal liquidations look cleaner than they are

We need to clamp edge harder when drift expands at the same time slot congestion rises. Marginal edges should drop out before the agent suggests bidding.

## Unwind quality is too static for correlated collateral stress

When multiple accounts share the same collateral type, unwind quality should worsen as the queue fills. Add a congestion term tied to per-asset liquidation density.

Backlog note: validate both issues against stressed oracle windows before tightening the live scanner defaults.
