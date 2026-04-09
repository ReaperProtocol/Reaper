import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  HELIUS_API_KEY: z.string().min(1),
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-6"),
  SCAN_INTERVAL_MS: z.coerce.number().default(30_000),
  HEALTH_WARN_THRESHOLD: z.coerce.number().default(1.15),
  HEALTH_DANGER_THRESHOLD: z.coerce.number().default(1.05),
  MIN_POSITION_USD: z.coerce.number().default(5_000),
  ORACLE_DRIFT_THRESHOLD_BPS: z.coerce.number().default(45),
  MAX_ORACLE_AGE_SECONDS: z.coerce.number().default(75),
  MIN_LIQUIDATION_EDGE_USD: z.coerce.number().default(40),
  PROTOCOLS: z.string().default("kamino,marginfi"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Config error:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export const TRACKED_PROTOCOLS = config.PROTOCOLS.split(",").map((p) => p.trim()) as string[];
