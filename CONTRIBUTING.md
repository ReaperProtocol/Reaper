# Contributing

## Local Setup

```bash
bun install
cp .env.example .env
bun run dev
```

## Contribution Rules

- keep oracle, keeper-race, and unwind logic in separate changes when possible
- update tests when edge calculations or filters change
- keep the docs focused on actionable liquidation quality, not generic risk

## Pull Request Notes

- explain which liquidation guardrail changed
- include a sample ticket when ranking behavior changes
- update the runbook if operator flow changed
