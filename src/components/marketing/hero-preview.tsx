import { Check, FileText, Loader2 } from "lucide-react";
import { ScoreRing } from "@/components/report/score-ring";

const bars = [
  { label: "Keyword match", value: 78 },
  { label: "ATS compatibility", value: 91 },
  { label: "Impact & metrics", value: 84 },
];

/** Decorative product preview for the landing hero (sample data). */
export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl" aria-hidden="true">
      <div className="absolute -inset-x-10 -top-10 bottom-0 bg-gradient-hero blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-elevated">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">resumeiq.app/analyses/senior-frontend-engineer</span>
        </div>
        <div className="grid gap-0 md:grid-cols-[1.25fr_1fr]">
          <div className="space-y-6 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Senior Frontend Engineer</p>
                <p className="text-xs text-muted-foreground">alex-morgan-resume.pdf · Northwind Labs</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ScoreRing score={82} size={120} stroke={9} />
              <div className="flex-1 space-y-3">
                {bars.map((b) => (
                  <div key={b.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="font-semibold tabular-nums">{b.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-violet" style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Missing keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {["Accessibility (WCAG)", "GraphQL", "Testing"].map((k) => (
                  <span key={k} className="rounded-md border border-destructive/20 bg-destructive-soft px-2 py-1 font-mono text-[11px] text-destructive">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t bg-muted/30 p-6 md:border-l md:border-t-0 md:p-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Agent crew</p>
            <ul className="space-y-3">
              {[
                { a: "Resume Parser", s: "done" },
                { a: "Skills Analyst", s: "done" },
                { a: "ATS Matcher", s: "done" },
                { a: "Career Coach", s: "running" },
              ].map(({ a, s }) => (
                <li key={a} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm">
                  <span
                    className={
                      s === "done"
                        ? "flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        : "flex size-5 items-center justify-center rounded-full border border-primary text-primary"
                    }
                  >
                    {s === "done" ? <Check className="size-3" /> : <Loader2 className="size-3 animate-spin" />}
                  </span>
                  <span className="font-medium">{a}</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">{s === "done" ? "complete" : "writing…"}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg border border-success/20 bg-success-soft p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Suggested rewrite</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground">
                Led WCAG 2.2 AA remediation of checkout, raising Lighthouse a11y score from 72 to 98.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
