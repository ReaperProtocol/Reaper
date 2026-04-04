import Anthropic from "@anthropic-ai/sdk";
import type { Position, RiskAlert } from "../core/types.js";
import { REAPER_SYSTEM } from "./prompts.js";
import { config } from "../core/config.js";
import { log } from "../core/logger.js";
import crypto from "crypto";

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "get_risk_summary",
    description: "Get a summary of all at-risk positions grouped by risk level",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_position_detail",
    description: "Get full detail for a specific position by owner address and protocol",
    input_schema: {
      type: "object" as const,
      properties: {
        owner: { type: "string" },
        protocol: { type: "string" },
      },
      required: ["owner", "protocol"],
    },
  },
  {
    name: "get_critical_positions",
    description: "Get only positions in the critical zone (health factor < 1.05)",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "emit_risk_alert",
    description: "Emit a liquidation risk alert for a specific position",
    input_schema: {
      type: "object" as const,
      properties: {
        owner: { type: "string" },
        protocol: { type: "string" },
        urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
        message: { type: "string", description: "What's happening and why it's risky" },
        actionable: { type: "string", description: "What the position owner should do right now" },
        confidence: { type: "number" },
      },
      required: ["owner", "protocol", "urgency", "message", "actionable", "confidence"],
    },
  },
];

export async function runReaperAgent(positions: Position[]): Promise<RiskAlert[]> {
  const alerts: RiskAlert[] = [];
  const byKey = new Map(positions.map((p) => [`${p.owner}:${p.protocol}`, p]));

  const grouped = {
    critical: positions.filter((p) => p.riskLevel === "critical"),
    danger: positions.filter((p) => p.riskLevel === "danger"),
    watch: positions.filter((p) => p.riskLevel === "watch"),
  };

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `New scan: ${positions.length} at-risk positions found. ${grouped.critical.length} critical, ${grouped.danger.length} danger, ${grouped.watch.length} watch. Analyze and emit alerts.`,
    },
  ];

  for (let turn = 0; turn < 14; turn++) {
    const response = await client.messages.create({
      model: config.CLAUDE_MODEL,
      max_tokens: 4096,
      system: REAPER_SYSTEM,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });
    if (response.stop_reason !== "tool_use") break;

    const results: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const input = block.input as Record<string, unknown>;
      let result = "";

      if (block.name === "get_risk_summary") {
        result = JSON.stringify({
          total: positions.length,
          critical: grouped.critical.map((p) => ({ owner: p.owner.slice(0, 10), protocol: p.protocol, hf: p.healthFactor.toFixed(3), usd: `$${(p.collateralUsd).toLocaleString()}` })),
          danger: grouped.danger.map((p) => ({ owner: p.owner.slice(0, 10), protocol: p.protocol, hf: p.healthFactor.toFixed(3) })),
          watch: grouped.watch.length,
        });
      } else if (block.name === "get_position_detail") {
        const pos = byKey.get(`${input.owner}:${input.protocol}`);
        result = pos ? JSON.stringify(pos) : "not found";
      } else if (block.name === "get_critical_positions") {
        result = JSON.stringify(grouped.critical);
      } else if (block.name === "emit_risk_alert") {
        const pos = byKey.get(`${input.owner}:${input.protocol}`);
        if (!pos) { result = "position not found"; continue; }
        const alert: RiskAlert = {
          id: crypto.randomUUID(),
          type: "at_risk",
          position: pos,
          urgency: input.urgency as RiskAlert["urgency"],
          message: input.message as string,
          actionable: input.actionable as string,
          confidence: input.confidence as number,
          generatedAt: Date.now(),
        };
        alerts.push(alert);
        log.warn(`Alert [${alert.urgency}] ${pos.protocol} HF=${pos.healthFactor.toFixed(3)} $${pos.collateralUsd.toLocaleString()}`);
        result = JSON.stringify({ id: alert.id, accepted: true });
      }

      results.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    messages.push({ role: "user", content: results });
  }

  return alerts;
}
