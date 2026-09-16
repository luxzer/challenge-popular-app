import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface p-5 shadow-[0_1px_2px_rgba(11,37,69,0.06)] ${className}`}>
      {children}
    </div>
  );
}

const TONE_STYLES: Record<string, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-page text-muted",
  navy: "bg-brand-navy-deep/10 text-brand-navy-deep",
};

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-semibold ${TONE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  pct,
  color = "var(--brand-blue)",
  trackColor = "var(--divider)",
  heightClass = "h-2",
}: {
  pct: number;
  color?: string;
  trackColor?: string;
  heightClass?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`w-full overflow-hidden rounded-full ${heightClass}`} style={{ background: trackColor }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export function SegmentedBar({
  segments,
  heightClass = "h-2.5",
}: {
  segments: { pct: number; color: string }[];
  heightClass?: string;
}) {
  return (
    <div className={`flex w-full overflow-hidden rounded-full ${heightClass}`} style={{ background: "var(--divider)" }}>
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
      ))}
    </div>
  );
}

export function ScoreGauge({ score, max, size = 220 }: { score: number; max: number; size?: number }) {
  const r = 90;
  const cx = 100;
  const cy = 100;
  const arcLength = Math.PI * r;
  const fraction = Math.max(0, Math.min(1, score / max));
  const dashOffset = arcLength * (1 - fraction);

  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 200 118" className="mx-auto">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--divider)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--brand-blue-light)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={dashOffset}
      />
      <text x={cx} y={cy - 18} textAnchor="middle" className="fill-ink" style={{ fontSize: 46, fontWeight: 800 }}>
        {score}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" className="fill-muted" style={{ fontSize: 15 }}>
        de {max}
      </text>
    </svg>
  );
}

export function money(amount: number) {
  return `RD$${amount.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;
}

export function moneyCents(amount: number) {
  return `RD$${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Parses a "YYYY-MM-DD" string as a local date, avoiding the UTC-midnight
 * shift that makes `new Date("YYYY-MM-DD")` render as the previous day in
 * negative-UTC-offset timezones. */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}
