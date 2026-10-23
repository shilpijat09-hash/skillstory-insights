export type ScoreTone = "success" | "warning" | "destructive" | "muted";

export function scoreTone(score: number | null | undefined): ScoreTone {
  if (score == null) return "muted";
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "destructive";
}

export function scoreLabel(score: number | null | undefined): string {
  if (score == null) return "Pending";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Needs work";
  return "Weak match";
}
