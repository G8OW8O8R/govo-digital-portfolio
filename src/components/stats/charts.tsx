import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/lib/stats-aggregate";

/* ----------------------------- Line chart ----------------------------- */

type LineKey = "views" | "sessions" | "conversions";

const LINE_META: Record<LineKey, { label: string; color: string; dashed?: boolean }> = {
  views: { label: "Odsłony", color: "oklch(0.72 0.17 320)" },
  sessions: { label: "Sesje", color: "oklch(0.66 0.16 275)" },
  conversions: { label: "Konwersje", color: "oklch(0.78 0.14 165)", dashed: true },
};

export function LineChart({
  series,
  keys,
  height = 190,
}: {
  series: SeriesPoint[];
  keys: LineKey[];
  height?: number;
}) {
  const W = 1000;
  const H = height;
  const padL = 34;
  const padB = 20;
  const padT = 10;

  const max = Math.max(1, ...series.flatMap((p) => keys.map((k) => p[k])));
  const stepX = series.length > 1 ? (W - padL - 8) / (series.length - 1) : 0;
  const x = (i: number) => padL + i * stepX;
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  const ticks = useMemo(() => {
    const count = 4;
    return Array.from({ length: count + 1 }, (_, i) => Math.round((max / count) * i));
  }, [max]);

  const labelEvery = Math.max(1, Math.ceil(series.length / 8));

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-4">
        {keys.map((k) => (
          <span key={k} className="inline-flex items-center gap-2 text-[11px] text-foreground/55">
            <span
              className="h-0.5 w-5 rounded-full"
              style={{
                background: LINE_META[k].color,
                opacity: LINE_META[k].dashed ? 0.85 : 1,
              }}
            />
            {LINE_META[k].label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" style={{ height }} role="img">
        <defs>
          {keys.map((k) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_META[k].color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={LINE_META[k].color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {ticks.map((t, ti) => (
          <g key={`tick-${ti}`}>
            <line
              x1={padL}
              x2={W - 4}
              y1={y(t)}
              y2={y(t)}
              stroke="currentColor"
              className="text-foreground/8"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={y(t) + 3}
              textAnchor="end"
              className="fill-current text-foreground/35"
              style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)" }}
            >
              {t}
            </text>
          </g>
        ))}

        {keys.map((k) => {
          const pts = series.map((p, i) => `${x(i)},${y(p[k])}`);
          if (!pts.length) return null;
          return (
            <g key={k}>
              <polygon
                points={`${padL},${y(0)} ${pts.join(" ")} ${x(series.length - 1)},${y(0)}`}
                fill={`url(#grad-${k})`}
              />
              <polyline
                points={pts.join(" ")}
                fill="none"
                stroke={LINE_META[k].color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={LINE_META[k].dashed ? "5 5" : undefined}
              />
              {series.map((p, i) => (
                <circle key={i} cx={x(i)} cy={y(p[k])} r="2.4" fill={LINE_META[k].color} />
              ))}
            </g>
          );
        })}

        {series.map((p, i) =>
          i % labelEvery === 0 ? (
            <text
              key={p.key}
              x={x(i)}
              y={H - 4}
              textAnchor="middle"
              className="fill-current text-foreground/35"
              style={{ fontSize: 9 }}
            >
              {p.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

/* ------------------------------- Funnel ------------------------------- */

export function FunnelChart({ steps }: { steps: Array<{ label: string; value: number }> }) {
  const base = steps[0]?.value ?? 0;
  const W = 260;
  const H = 150;
  const rowH = H / Math.max(1, steps.length - 1);
  const widthAt = (v: number) => Math.max(18, (base ? v / base : 0) * W);

  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <ul className="space-y-2.5">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-xs">
            <span className="flex-1 truncate text-foreground/65">{s.label}</span>
            <span className="w-14 text-right font-mono text-foreground/90">{s.value}</span>
            <span className="w-14 text-right font-mono text-[11px] text-foreground/40">
              {base ? `${((s.value / base) * 100).toFixed(1).replace(".", ",")}%` : "—"}
            </span>
          </li>
        ))}
      </ul>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-[150px] w-full max-w-[260px] justify-self-center">
        <defs>
          <linearGradient id="funnel-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.17 320)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="oklch(0.6 0.16 265)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {steps.slice(0, -1).map((s, i) => {
          const next = steps[i + 1]!;
          const topW = widthAt(s.value);
          const botW = widthAt(next.value);
          const yTop = i * rowH;
          const yBot = yTop + rowH - 3;
          const c = W / 2;
          return (
            <polygon
              key={s.label}
              points={`${c - topW / 2},${yTop} ${c + topW / 2},${yTop} ${c + botW / 2},${yBot} ${c - botW / 2},${yBot}`}
              fill="url(#funnel-fill)"
              opacity={1 - i * 0.12}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------- Donut ------------------------------- */

const DONUT_COLORS = [
  "oklch(0.72 0.17 320)",
  "oklch(0.64 0.16 268)",
  "oklch(0.78 0.13 168)",
  "oklch(0.8 0.13 90)",
  "oklch(0.7 0.05 280)",
];

export function Donut({
  items,
  size = 128,
}: {
  items: Array<{ label: string; count: number }>;
  size?: number;
}) {
  const total = items.reduce((a, i) => a + i.count, 0);
  const r = 44;
  const c = 2 * Math.PI * r;
  let offset = 0;

  if (!total) return <p className="mt-5 text-xs text-foreground/35">Brak danych dla wybranego okresu.</p>;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 120 120" style={{ width: size, height: size }} className="shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" className="text-border/60" strokeWidth="14" />
        {items.map((item, i) => {
          const len = (item.count / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={item.label}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="min-w-[150px] flex-1 space-y-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="flex-1 truncate text-foreground/70">{item.label}</span>
            <span className="font-mono text-foreground/85">{item.count}</span>
            <span className="w-12 text-right font-mono text-[11px] text-foreground/40">
              {`${((item.count / total) * 100).toFixed(1).replace(".", ",")}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Bar list ------------------------------ */

export function BarList({
  items,
  showShare,
  total,
  className,
}: {
  items: Array<{ label: string; count: number; note?: string }>;
  showShare?: boolean;
  total?: number;
  className?: string;
}) {
  if (!items.length) return <p className="mt-5 text-xs text-foreground/35">Brak danych dla wybranego okresu.</p>;
  const max = Math.max(1, ...items.map((i) => i.count));
  const sum = total ?? items.reduce((a, i) => a + i.count, 0);
  return (
    <ul className={cn("mt-4 space-y-2.5", className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-xs">
          <span className="w-[38%] truncate text-foreground/70" title={item.label}>
            {item.label}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/50">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${(item.count / max) * 100}%`,
                background: "linear-gradient(90deg, oklch(0.66 0.16 275), oklch(0.74 0.17 320))",
              }}
            />
          </span>
          <span className="w-12 shrink-0 text-right font-mono text-foreground/85">{item.count}</span>
          {showShare && (
            <span className="w-12 shrink-0 text-right font-mono text-[11px] text-foreground/40">
              {sum ? `${((item.count / sum) * 100).toFixed(1).replace(".", ",")}%` : "—"}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
