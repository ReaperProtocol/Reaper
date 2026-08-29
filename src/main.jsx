// ReaperLanding.jsx — single React component. Renders the Reaper landing page.
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const COLORS = {
  canvas: "#05070a",
  surface: "#0b1016",
  hairline: "#18222e",
  hairlineHeavy: "#253647",
  steel: "#4d9de0",
  steelBright: "#b9dcf7",
  steelDeep: "#285f8f",
  bone: "#e9ecef",
  mutedBone: "#aeb8c2",
  faintBone: "#657381",
  fadedHeadline: "rgba(233,236,239,0.32)",
};

// Inline SVG icon set — minimal lucide-style strokes, no external deps.
const ICON_PATHS = {
  ArrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
  Github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
  Search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  Calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="8" y2="18" />
      <line x1="12" y1="18" x2="12" y2="18" />
      <line x1="16" y1="18" x2="16" y2="18" />
    </>
  ),
  Eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  DoorOpen: (
    <>
      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
      <path d="M2 20h20" />
      <path d="M13 20V4l-7 2v14" />
      <line x1="11" y1="12" x2="11" y2="12" />
    </>
  ),
  TicketCheck: (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      <polyline points="9 12 11 14 15 10" />
    </>
  ),
  Crosshair: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </>
  ),
  Clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
};

const Icon = ({ name, size = 18, color = COLORS.bone, strokeWidth = 1.5, style }) => {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {path}
    </svg>
  );
};

const Eyebrow = ({ children, large = false, color, style }) => {
  if (large) {
    return (
      <div
        style={{
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          color: color || COLORS.steel,
          textTransform: "uppercase",
          marginBottom: 16,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      style={{
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.12em",
        color: color || COLORS.faintBone,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Badge = ({ kind }) => {
  const styles = {
    HUNT: { bg: COLORS.steelBright, text: COLORS.canvas, border: COLORS.steelBright },
    WATCH: { bg: "rgba(77,157,224,0.15)", text: COLORS.steel, border: COLORS.steel },
    SKIP: { bg: "transparent", text: COLORS.steelBright, border: COLORS.steelBright },
    EXPIRED: { bg: COLORS.hairline, text: COLORS.faintBone, border: "transparent" },
  }[kind];
  return (
    <span
      style={{
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11,
        letterSpacing: "0.06em",
        padding: "4px 8px",
        borderRadius: 2,
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        textTransform: "uppercase",
        fontWeight: 500,
        display: "inline-block",
      }}
    >
      {kind}
    </span>
  );
};

const StatusPill = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "ui-monospace, Menlo, monospace",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: COLORS.mutedBone,
      border: `1px solid ${COLORS.hairline}`,
      padding: "5px 10px",
      borderRadius: 2,
    }}
  >
    <span style={{ width: 5, height: 5, borderRadius: 99, background: COLORS.steel }} />
    {children}
  </span>
);

// ----- HERO EDGE PROFILE SVG -----
// eslint-disable-next-line no-unused-vars
const EdgeProfile = () => {
  const rows = [
    { label: "ORACLE FRESHNESS", val: "−$18", pct: 0.06 },
    { label: "DRIFT THRESHOLD", val: "−$24", pct: 0.08 },
    { label: "KEEPER RACE", val: "−$71", pct: 0.25 },
    { label: "UNWIND QUALITY", val: "−$32", pct: 0.11 },
    { label: "FEES + GAS", val: "−$22", pct: 0.08 },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 80% at center, rgba(77,157,224,0.06), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", padding: "24px 16px" }}>
        <div
          style={{
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 14,
            color: COLORS.steel,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          GROSS EDGE · +$284
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                height: 36,
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr 0.6fr",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 11,
                  color: COLORS.mutedBone,
                  letterSpacing: "0.06em",
                }}
              >
                {r.label}
              </div>
              <div style={{ position: "relative", height: 6, background: "transparent" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 6,
                    width: `${Math.min(100, r.pct * 100 * 3.5)}%`,
                    background: COLORS.steelDeep,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 11,
                  color: COLORS.faintBone,
                  textAlign: "right",
                  letterSpacing: "0.04em",
                }}
              >
                {r.val}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.hairlineHeavy}`, marginTop: 16, marginBottom: 16 }} />
        <div
          style={{
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 14,
            color: COLORS.steelBright,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          NET EDGE · +$117
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 11,
            color: COLORS.faintBone,
            marginTop: 6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          WORTH CHASING.
        </div>
      </div>
    </div>
  );
};

// ----- HERO PANEL DECISION ROW -----
const heroRows = [
  { addr: "Wallet 8nQpA…wK4f", sub: "Kamino · USDC short", health: 92, oracle: "12s", oracleFlag: false, edge: "+$117", badge: "HUNT" },
  { addr: "Wallet 4xR9c…Lp7m", sub: "MarginFi · SOL short", health: 87, oracle: "8s", oracleFlag: false, edge: "+$48", badge: "WATCH" },
  { addr: "Wallet 9bF2d…Mn5v", sub: "Drift · perp long", health: 96, oracle: "47s", oracleFlag: true, edge: "+$8", badge: "SKIP" },
  { addr: "Wallet 2gB6f…Hd1q", sub: "Kamino · USDT short", health: 99, oracle: "62s", oracleFlag: true, edge: "−$14", badge: "EXPIRED" },
];

const HealthBar = ({ pct }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div
      style={{
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11,
        color: COLORS.bone,
      }}
    >
      {pct}%
    </div>
    <div style={{ height: 3, background: COLORS.hairline, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 3,
          width: `${pct}%`,
          background: COLORS.steel,
        }}
      />
    </div>
  </div>
);

const HeroPanel = () => (
  <div style={{ position: "relative", maxWidth: 1024, margin: "64px auto 0" }}>
    <div
      style={{
        position: "relative",
        borderRadius: 6,
        padding: 32,
        background: COLORS.surface,
        border: `1px solid ${COLORS.hairline}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at center top, rgba(77,157,224,0.07), transparent 65%)",
        }}
      />
      <div style={{ position: "relative" }}>
        <Eyebrow>WHAT YOU TOLD REAPER</Eyebrow>
        <div
          style={{
            marginTop: 12,
            paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.steelBright}`,
            color: COLORS.bone,
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.4,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
        >
          “Find me distressed accounts where the math still works after the keeper race. Don't bother me with stale-oracle traps. If the unwind is messy, skip it.”
        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
          <Icon name="ArrowDown" size={20} color={COLORS.steel} />
        </div>
        <Eyebrow>REAPER FOUND · 14:32 UTC</Eyebrow>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
          {heroRows.map((r, i) => (
            <div
              key={i}
              className="hero-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 0.9fr 0.8fr 0.8fr 110px",
                alignItems: "center",
                gap: 16,
                padding: "14px 4px",
                borderTop: i === 0 ? `1px solid ${COLORS.hairline}` : "none",
                borderBottom: `1px solid ${COLORS.hairline}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 13,
                    color: COLORS.bone,
                  }}
                >
                  {r.addr}
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 11,
                    color: COLORS.faintBone,
                    marginTop: 2,
                  }}
                >
                  {r.sub}
                </div>
              </div>
              <HealthBar pct={r.health} />
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 12,
                  color: r.oracleFlag ? COLORS.steelBright : COLORS.bone,
                }}
              >
                {r.oracle}
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 12,
                  color:
                    r.badge === "HUNT"
                      ? COLORS.steelBright
                      : r.badge === "EXPIRED"
                      ? COLORS.faintBone
                      : COLORS.bone,
                  fontWeight: r.badge === "HUNT" ? 600 : 400,
                }}
              >
                {r.edge}
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge kind={r.badge} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div
      style={{
        textAlign: "center",
        marginTop: 16,
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11,
        color: COLORS.faintBone,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      Every ticket clears five gates before Reaper shows it to you.
    </div>
  </div>
);

// ----- HUNT BOARD -----
const boardRows = [
  { addr: "Wallet 8nQpA…wK4f", sub: "Kamino · USDC short", hf: "1.04", hfFlag: true, oracle: "12s", oracleFlag: false, race: "low", edge: "+$117", badge: "HUNT" },
  { addr: "Wallet 4xR9c…Lp7m", sub: "MarginFi · SOL short", hf: "1.06", hfFlag: false, oracle: "8s", oracleFlag: false, race: "med", edge: "+$48", badge: "WATCH" },
  { addr: "Wallet 9bF2d…Mn5v", sub: "Drift · perp long", hf: "1.02", hfFlag: true, oracle: "47s", oracleFlag: true, race: "high", edge: "+$8", badge: "SKIP" },
  { addr: "Wallet 2gB6f…Hd1q", sub: "Kamino · USDT short", hf: "1.01", hfFlag: true, oracle: "62s", oracleFlag: true, race: "high", edge: "−$14", badge: "EXPIRED" },
  { addr: "Wallet 7nM2a…Vc8x", sub: "MarginFi · USDC short", hf: "1.08", hfFlag: false, oracle: "5s", oracleFlag: false, race: "low", edge: "+$74", badge: "HUNT" },
  { addr: "Wallet 5kL4j…Pq3y", sub: "Drift · perp short", hf: "1.11", hfFlag: false, oracle: "11s", oracleFlag: false, race: "med", edge: "+$31", badge: "WATCH" },
];

const HuntBoard = () => {
  const colTpl = "1.6fr 0.7fr 0.7fr 0.7fr 0.9fr 0.9fr";
  return (
    <section id="board" style={{ padding: "120px 24px 80px", maxWidth: 1152, margin: "0 auto" }}>
      <Eyebrow large>01 · HUNT BOARD</Eyebrow>
      <h2
        className="section-headline"
        style={{
          fontSize: "clamp(40px, 5.5vw, 68px)",
          lineHeight: 0.98,
          letterSpacing: "-0.02em",
          fontWeight: 600,
          margin: "0 0 20px",
        }}
      >
        <span style={{ color: COLORS.bone }}>Every minute,</span>{" "}
        <span style={{ color: COLORS.fadedHeadline }}>the board re-prices.</span>
      </h2>
      <p style={{ maxWidth: 640, color: COLORS.mutedBone, fontSize: 16, lineHeight: 1.55, margin: "0 0 36px" }}>
        A live snapshot of every distressed account Reaper is tracking: health factor, oracle staleness, keeper-race probability, net edge after friction, and the verdict. These are the same numbers that decide whether a ticket gets emitted.
      </p>

      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: 6,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Eyebrow>TRACKED 318 · ACTIVE 7 · SUPPRESSED 311</Eyebrow>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: COLORS.steel }} />
            <Eyebrow>UPDATED 02:18 AGO</Eyebrow>
          </div>
        </div>

        {/* Desktop header */}
        <div
          className="board-header"
          style={{
            display: "grid",
            gridTemplateColumns: colTpl,
            gap: 16,
            padding: "10px 8px",
            borderBottom: `1px solid ${COLORS.hairline}`,
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: COLORS.faintBone,
          }}
        >
          <div>ACCOUNT</div>
          <div>HEALTH</div>
          <div>ORACLE</div>
          <div>KEEPER RACE</div>
          <div>NET EDGE</div>
          <div>DECISION</div>
        </div>

        {/* Desktop rows */}
        <div className="board-rows-desktop">
          {boardRows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: colTpl,
                gap: 16,
                padding: "16px 8px",
                borderBottom: `1px solid ${COLORS.hairline}`,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: COLORS.bone }}>{r.addr}</div>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: COLORS.faintBone, marginTop: 2 }}>{r.sub}</div>
              </div>
              <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: r.hfFlag ? COLORS.steelBright : COLORS.bone }}>{r.hf}</div>
              <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: r.oracleFlag ? COLORS.steelBright : COLORS.bone }}>{r.oracle}</div>
              <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: COLORS.mutedBone }}>{r.race}</div>
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 14,
                  color:
                    r.badge === "HUNT"
                      ? COLORS.steelBright
                      : r.badge === "EXPIRED"
                      ? COLORS.faintBone
                      : COLORS.bone,
                  fontWeight: r.badge === "HUNT" ? 700 : 400,
                }}
              >
                {r.edge}
              </div>
              <div>
                <Badge kind={r.badge} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="board-cards-mobile">
          {boardRows.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "16px 4px",
                borderBottom: `1px solid ${COLORS.hairline}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, color: COLORS.bone }}>{r.addr}</div>
                  <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: COLORS.faintBone, marginTop: 2 }}>{r.sub}</div>
                </div>
                <Badge kind={r.badge} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { k: "HEALTH", v: r.hf, flag: r.hfFlag },
                  { k: "ORACLE", v: r.oracle, flag: r.oracleFlag },
                  { k: "KEEPER RACE", v: r.race, flag: false },
                  { k: "NET EDGE", v: r.edge, flag: r.badge === "HUNT", neg: r.badge === "EXPIRED" },
                ].map((c, j) => (
                  <div key={j}>
                    <div
                      style={{
                        fontFamily: "ui-monospace, Menlo, monospace",
                        fontSize: 10,
                        color: COLORS.faintBone,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {c.k}
                    </div>
                    <div
                      style={{
                        fontFamily: "ui-monospace, Menlo, monospace",
                        fontSize: 13,
                        color: c.flag ? COLORS.steelBright : c.neg ? COLORS.faintBone : COLORS.bone,
                        marginTop: 2,
                      }}
                    >
                      {c.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----- DOCTRINE -----
const doctrinePoints = [
  { n: "01", h: "Origin honesty.", b: "Reaper does not pretend a stale oracle is a current one. If the price hasn't moved on-chain in 30 seconds, the trade is gated, not promoted." },
  { n: "02", h: "Race realism.", b: "If the keeper race is crowded, your edge dies before your transaction lands. Reaper models that cost up front instead of pretending it isn't there." },
  { n: "03", h: "Exit realism.", b: "An account profitable on paper is profitable only if you can unwind the collateral cleanly. Reaper scores exit quality before scoring opportunity." },
  { n: "04", h: "Quiet output.", b: "Most days the board is short. That is the design — Reaper is built to surface what survives, not to fill a feed." },
];

const Doctrine = () => (
  <section id="doctrine" style={{ padding: "100px 24px", maxWidth: 1152, margin: "0 auto" }}>
    <Eyebrow large>02 · DOCTRINE</Eyebrow>
    <div
      style={{
        maxWidth: 896,
        margin: "0 auto",
        background: COLORS.surface,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 6,
        padding: 48,
      }}
    >
      <blockquote
        style={{
          margin: 0,
          paddingLeft: 24,
          borderLeft: `3px solid ${COLORS.steelBright}`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: "clamp(22px, 3vw, 30px)",
          lineHeight: 1.25,
          fontWeight: 500,
          color: COLORS.bone,
          letterSpacing: "-0.005em",
        }}
      >
        “An ugly health factor does not pay you by itself. It pays you only after the oracle, the queue, and the unwind have all left you something.”
      </blockquote>
      <div style={{ borderTop: `1px solid ${COLORS.hairline}`, margin: "32px 0" }} />
      <div className="doctrine-grid">
        {doctrinePoints.map((p) => (
          <div key={p.n} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontFamily: "ui-monospace, Menlo, monospace",
                color: COLORS.steel,
                fontSize: 12,
                letterSpacing: "0.16em",
              }}
            >
              {p.n}
            </div>
            <div style={{ color: COLORS.bone, fontSize: 16, fontWeight: 500 }}>{p.h}</div>
            <div style={{ color: COLORS.mutedBone, fontSize: 14, lineHeight: 1.6 }}>{p.b}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ----- LOOP -----
const loopSteps = [
  { n: "01", icon: "Search", title: "Scan", body: "Pulls every distressed account from Kamino, MarginFi, and Drift in a single sweep." },
  { n: "02", icon: "Calculator", title: "Price", body: "Estimates the gross edge each account would yield at current liquidation parameters." },
  { n: "03", icon: "Eye", title: "Verify", body: "Cross-checks the oracle's last update — if the price feed is stale, the edge is provisional, not real." },
  { n: "04", icon: "Users", title: "Model", body: "Predicts how many keepers are likely to compete for the same liquidation, and what fraction of the edge survives." },
  { n: "05", icon: "DoorOpen", title: "Exit", body: "Scores how cleanly the underlying collateral can be exited at current depth — illiquid collateral is downgraded." },
  { n: "06", icon: "TicketCheck", title: "Emit", body: "Issues a hunt ticket only if the net edge clears every gate. Most candidates do not." },
];

const Loop = () => (
  <section id="loop" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
    <Eyebrow large>03 · LOOP</Eyebrow>
    <h2
      style={{
        fontSize: "clamp(40px, 5.5vw, 68px)",
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
        fontWeight: 600,
        margin: "0 0 20px",
      }}
    >
      <span style={{ color: COLORS.bone }}>Six steps every cycle.</span>{" "}
      <span style={{ color: COLORS.fadedHeadline }}>The order is the discipline.</span>
    </h2>
    <p style={{ maxWidth: 640, color: COLORS.mutedBone, fontSize: 16, lineHeight: 1.55, margin: "0 0 60px" }}>
      The loop runs every minute against every supported lending protocol. Skip a step and the edge stops being honest.
    </p>

    {/* Desktop horizontal */}
    <div className="loop-horizontal">
      {loopSteps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 8px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: COLORS.surface,
                border: `1px solid ${COLORS.steel}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 14,
                color: COLORS.steel,
              }}
            >
              {s.n}
            </div>
            <div style={{ marginTop: 16 }}>
              <Icon name={s.icon} size={18} color={COLORS.bone} />
            </div>
            <div style={{ marginTop: 10, color: COLORS.bone, fontSize: 16, fontWeight: 500 }}>{s.title}</div>
            <div style={{ marginTop: 8, color: COLORS.mutedBone, fontSize: 13, lineHeight: 1.55 }}>{s.body}</div>
          </div>
          {i < loopSteps.length - 1 && (
            <div style={{ flex: "0 0 auto", width: 32, alignSelf: "flex-start", marginTop: 20 }}>
              <svg width="100%" height="2" style={{ display: "block" }}>
                <line x1="0" y1="1" x2="100%" y2="1" stroke={COLORS.steelDeep} strokeWidth="1" strokeDasharray="2 3" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Mobile vertical */}
    <div className="loop-vertical">
      {loopSteps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", gap: 20, position: "relative", paddingBottom: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: COLORS.surface,
                border: `1px solid ${COLORS.steel}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 14,
                color: COLORS.steel,
                flexShrink: 0,
              }}
            >
              {s.n}
            </div>
            {i < loopSteps.length - 1 && (
              <div style={{ flex: 1, marginTop: 4, width: 1, borderLeft: `1px dashed ${COLORS.steelDeep}` }} />
            )}
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={s.icon} size={16} color={COLORS.bone} />
              <div style={{ color: COLORS.bone, fontSize: 16, fontWeight: 500 }}>{s.title}</div>
            </div>
            <div style={{ marginTop: 8, color: COLORS.mutedBone, fontSize: 13, lineHeight: 1.6 }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ----- GUARDRAILS -----
const Guardrails = () => {
  const gates = [
    { n: "1", t: "Oracle freshness.", b: "The last on-chain price update must be within the configured staleness window. Older feeds are gated, not surfaced." },
    { n: "2", t: "Drift threshold.", b: "If the position is profitable only because the oracle hasn't caught up, Reaper subtracts that drift before scoring." },
    { n: "3", t: "Keeper-race floor.", b: "The expected fraction of edge that survives competition must clear a minimum. Crowded races demote the candidate." },
    { n: "4", t: "Unwind quality.", b: "Collateral that can't be exited cleanly at current depth is downgraded — sometimes to zero — before final scoring." },
    { n: "5", t: "Net edge floor.", b: "After every haircut, the residual edge must still beat the minimum-ticket threshold. Below that, no ticket fires." },
  ];
  const blocks = [
    { t: "Gross is the start, not the answer.", b: "Reaper begins with the headline edge a liquidation appears to offer, then subtracts every honest cost: stale-oracle drift, keeper-race competition, unwind slippage, fees, and gas. The number you see on the board is what's left." },
    { t: "The board is short on purpose.", b: "Most distressed accounts look profitable on paper. Once the actual frictions are priced, fewer than one in twenty makes it through every gate. Reaper is built to filter, not to fill a feed." },
    { t: "Empty boards are not broken boards.", b: "When markets are calm, the keeper race is more crowded and the residual edge is thinner. An empty hunt board is not a bug — it's the doctrine working." },
  ];
  return (
    <section id="guardrails" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <Eyebrow large>04 · GUARDRAILS</Eyebrow>
      <h2
        style={{
          fontSize: "clamp(40px, 5.5vw, 68px)",
          lineHeight: 0.98,
          letterSpacing: "-0.02em",
          fontWeight: 600,
          margin: "0 0 60px",
        }}
      >
        <span style={{ color: COLORS.bone }}>Five gates between thought and ticket.</span>{" "}
        <span style={{ color: COLORS.fadedHeadline }}>The market only pays you after they all align.</span>
      </h2>
      <div className="guardrails-grid">
        <div style={{ padding: "0 16px" }}>
          <Eyebrow>RISK GATES · IN ORDER</Eyebrow>
          <ol style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column", gap: 28 }}>
            {gates.map((g) => (
              <li key={g.n} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16 }}>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: COLORS.steel }}>{g.n}.</div>
                <div>
                  <div style={{ color: COLORS.bone, fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{g.t}</div>
                  <div style={{ color: COLORS.mutedBone, fontSize: 14, lineHeight: 1.6 }}>{g.b}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="guardrails-right" style={{ padding: "0 16px" }}>
          <Eyebrow>EDGE COMPONENTS · STACKED</Eyebrow>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column" }}>
            {blocks.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${COLORS.hairline}`,
                }}
              >
                <div style={{ color: COLORS.bone, fontSize: 18, fontWeight: 500, marginBottom: 10 }}>{b.t}</div>
                <div style={{ color: COLORS.mutedBone, fontSize: 14, lineHeight: 1.65 }}>{b.b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ----- PRINCIPLES -----
const principles = [
  { n: "01", icon: "Crosshair", t: "First-order honesty.", b: "Edge is what the trade actually pays — not the spread that appears in a screenshot." },
  { n: "02", icon: "Clock", t: "Oracle vigilance.", b: "Stale feeds are the most common trap. Reaper treats freshness as a primary input, not a footnote." },
  { n: "03", icon: "Users", t: "Race awareness.", b: "Liquidations are not single-actor markets. The keeper population is part of the math, every cycle." },
  { n: "04", icon: "DoorOpen", t: "Exit-aware ranking.", b: "An account profitable on entry is not profitable until the position is closed. Unwind quality is in every score." },
];

const Principles = () => (
  <section id="principles" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
    <Eyebrow large>05 · PRINCIPLES</Eyebrow>
    <h2
      style={{
        fontSize: "clamp(40px, 5.5vw, 68px)",
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
        fontWeight: 600,
        margin: "0 0 60px",
      }}
    >
      <span style={{ color: COLORS.bone }}>What separates Reaper</span>{" "}
      <span style={{ color: COLORS.fadedHeadline }}>from a liquidation feed.</span>
    </h2>
    <div className="principles-grid">
      {principles.map((p) => (
        <div
          key={p.n}
          className="principle-card"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.hairline}`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            transition: "border-color 160ms ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontFamily: "ui-monospace, Menlo, monospace", color: COLORS.steel, fontSize: 12, letterSpacing: "0.16em" }}>
              {p.n}
            </div>
            <Icon name={p.icon} size={20} color={COLORS.faintBone} />
          </div>
          <div style={{ color: COLORS.bone, fontSize: 18, fontWeight: 500 }}>{p.t}</div>
          <div style={{ color: COLORS.mutedBone, fontSize: 14, lineHeight: 1.6 }}>{p.b}</div>
        </div>
      ))}
    </div>
  </section>
);

// ----- LAUNCH -----
const Launch = () => (
  <section id="launch" style={{ padding: "100px 24px", maxWidth: 768, margin: "0 auto", textAlign: "center" }}>
    <Eyebrow large>06 · LAUNCH</Eyebrow>
    <h2
      style={{
        fontSize: "clamp(40px, 5.5vw, 64px)",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        fontWeight: 600,
        margin: "0 0 48px",
        color: COLORS.bone,
      }}
    >
      Reaper launches on Pump.fun.
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
      {[
        { k: "LIVE", v: "The hunter runs the same loop the page describes — every minute, every supported protocol." },
        { k: "OPEN", v: "The board is public. Hunt tickets are public. The proof is the surface, not a pitch." },
        { k: "OWNED", v: "Coin holders fund the engine and steer the watchlist. The product and the launch are one thing." },
      ].map((r) => (
        <div key={r.k} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 24, textAlign: "left", padding: "8px 0" }}>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", color: COLORS.steel, fontSize: 12, letterSpacing: "0.16em", paddingTop: 4 }}>
            {r.k}
          </div>
          <div style={{ color: COLORS.bone, fontSize: 15, lineHeight: 1.6 }}>{r.v}</div>
        </div>
      ))}
    </div>
    <a
      href="#board"
      className="cta-primary"
      style={{
        display: "inline-block",
        background: COLORS.steel,
        color: COLORS.canvas,
        padding: "12px 22px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        borderRadius: 4,
        transition: "background 160ms ease",
      }}
    >
      Open the board
    </a>
  </section>
);

// ----- CLOSING CTA -----
const ClosingCta = () => (
  <section style={{ padding: "120px 24px", maxWidth: 768, margin: "0 auto", textAlign: "center" }}>
    <Eyebrow style={{ display: "block", marginBottom: 20 }}>A HEALTH FACTOR ALONE PAYS YOU NOTHING</Eyebrow>
    <h2
      style={{
        fontSize: "clamp(28px, 4.5vw, 44px)",
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        fontWeight: 600,
        color: COLORS.bone,
        margin: "0 0 40px",
      }}
    >
      The market does not reward distress. It rewards the operator who can still execute when the math is real.
    </h2>
    <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
      <a
        href="#doctrine"
        className="ghost-link"
        style={{
          color: COLORS.mutedBone,
          textDecoration: "none",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 13,
          letterSpacing: "0.06em",
        }}
      >
        Read the doctrine →
      </a>
      <a
        href="#board"
        className="ghost-link"
        style={{
          color: COLORS.mutedBone,
          textDecoration: "none",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 13,
          letterSpacing: "0.06em",
        }}
      >
        Open the board →
      </a>
    </div>
  </section>
);

// ----- FOOTER -----
const Footer = () => (
  <footer
    style={{
      background: COLORS.canvas,
      borderTop: `1px solid ${COLORS.hairline}`,
      padding: "64px 24px",
    }}
  >
    <div style={{ maxWidth: 1152, margin: "0 auto" }}>
      <div className="footer-cols" style={{ display: "grid", gap: 48 }}>
        <div>
          <Eyebrow>SITE</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
            {["Doctrine", "Loop", "Guardrails", "Launch"].map((x) => (
              <li key={x}>
                <a
                  href={`#${x.toLowerCase()}`}
                  className="footer-link"
                  style={{ color: COLORS.mutedBone, textDecoration: "none", fontSize: 14 }}
                >
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow>PROJECT</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
            {["GitHub", "Twitter", "Pump.fun", "Whitepaper"].map((x) => (
              <li key={x}>
                <a href="#" className="footer-link" style={{ color: COLORS.mutedBone, textDecoration: "none", fontSize: 14 }}>
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        style={{
          marginTop: 48,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 11,
          color: COLORS.faintBone,
          letterSpacing: "0.06em",
        }}
      >
        Reaper · Solana liquidation hunter · MIT licensed · 2026
      </div>
    </div>
  </footer>
);

// ----- TOP NAV -----
const TopNav = () => {
  const links = ["HUNT", "DOCTRINE", "LOOP", "GUARDRAILS", "LAUNCH"];
  const map = { HUNT: "#board", DOCTRINE: "#doctrine", LOOP: "#loop", GUARDRAILS: "#guardrails", LAUNCH: "#launch" };
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(5,7,10,0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: `1px solid ${COLORS.hairline}`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a
          href="#"
          className="reaper-brand"
          style={{
            color: COLORS.bone,
            textDecoration: "none",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.01em",
          }}
        >
          <img src="/reaper-mark.webp" alt="Reaper liquidation-target mark" width={32} height={32} className="reaper-brand-mark" />
          Reaper
        </a>
        <div className="nav-links" style={{ display: "flex", gap: 28 }}>
          {links.map((l) => (
            <a
              key={l}
              href={map[l]}
              className="nav-link"
              style={{
                color: COLORS.faintBone,
                textDecoration: "none",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
              }}
            >
              {l}
            </a>
          ))}
        </div>
        <a href="#" className="nav-icon" aria-label="GitHub" style={{ color: COLORS.faintBone, display: "inline-flex" }}>
          <Icon name="Github" size={18} color="currentColor" />
        </a>
      </div>
    </nav>
  );
};

// ----- HERO -----
const Hero = () => (
  <section style={{ padding: "96px 24px 64px", maxWidth: 1152, margin: "0 auto" }}>
    <div style={{ maxWidth: 768 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
        <StatusPill>LIVE LIQUIDATION HUNTER</StatusPill>
        <StatusPill>3 PROTOCOLS</StatusPill>
        <StatusPill>60-SEC CYCLE</StatusPill>
      </div>
      <h1
        className="hero-headline"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          fontWeight: 600,
          margin: "0 0 28px",
        }}
      >
        <span style={{ color: COLORS.bone, display: "block" }}>Most are close.</span>
        <span style={{ color: COLORS.fadedHeadline, display: "block" }}>Few are worth it.</span>
      </h1>
      <p style={{ maxWidth: 540, color: COLORS.mutedBone, fontSize: 18, lineHeight: 1.55, margin: "0 0 36px" }}>
        Reaper scans Solana lending protocols for distressed accounts, then prices the actual edge you'd capture after oracle drift, keeper competition, and unwind friction. The board only surfaces the ones still worth chasing.
      </p>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <a
          href="#board"
          className="cta-primary"
          style={{
            background: COLORS.steel,
            color: COLORS.canvas,
            padding: "12px 22px",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            borderRadius: 4,
            transition: "background 160ms ease",
          }}
        >
          Open the board
        </a>
        <a
          href="#doctrine"
          className="ghost-link"
          style={{
            color: COLORS.mutedBone,
            textDecoration: "none",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 13,
            letterSpacing: "0.06em",
          }}
        >
          Read the doctrine →
        </a>
      </div>
    </div>
    <HeroPanel />
  </section>
);

// ----- ROOT -----
const ReaperLanding = () => {
  return (
    <div className="reaper-shell" style={{ background: COLORS.canvas, color: COLORS.bone, minHeight: "100vh" }}>
      <TopNav />
      <Hero />
      <HuntBoard />
      <Doctrine />
      <Loop />
      <Guardrails />
      <Principles />
      <Launch />
      <ClosingCta />
      <Footer />
    </div>
  );
};

createRoot(document.getElementById("root")).render(<ReaperLanding />);
