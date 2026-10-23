import { cn } from "@/lib/utils";
import { scoreLabel, scoreTone } from "@/lib/score";

const toneStroke = {
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
} as const;

export function ScoreRing({
  score,
  size = 148,
  stroke = 10,
  showLabel = true,
  className,
}: {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  const tone = scoreTone(score);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Resume score ${score} out of 100, ${scoreLabel(score)}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", toneStroke[tone])}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold tabular-nums tracking-tight" style={{ fontSize: size * 0.28 }}>
          {score}
        </span>
        {showLabel && <span className="text-xs font-medium text-muted-foreground">{scoreLabel(score)}</span>}
      </div>
    </div>
  );
}

export function ScorePill({ score, className }: { score: number | null; className?: string }) {
  const tone = scoreTone(score);
  const toneClass = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    destructive: "bg-destructive-soft text-destructive",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex min-w-11 items-center justify-center rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums",
        toneClass,
        className,
      )}
    >
      {score ?? "—"}
    </span>
  );
}
