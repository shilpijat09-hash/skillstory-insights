import { useState } from "react";
import { ArrowRight, Check, CheckCircle2, Copy, Lightbulb, Minus, Plus, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreRing } from "@/components/report/score-ring";
import { cn } from "@/lib/utils";
import { scoreTone } from "@/lib/score";
import type { AnalysisReport, FeedbackItem, Priority, SkillCategory } from "@/types/analysis";

const priorityVariant: Record<Priority, "destructive" | "warning" | "muted"> = {
  high: "destructive",
  medium: "warning",
  low: "muted",
};

const barTone = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
} as const;

const categoryLabel: Record<SkillCategory, string> = {
  technical: "Technical",
  tools: "Tools & platforms",
  domain: "Domain",
  soft: "Soft skills",
};

function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 className="text-base font-semibold">{children}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function ScoreOverview({ report }: { report: AnalysisReport }) {
  return (
    <Card className="grid gap-8 p-6 shadow-card md:grid-cols-[auto_1fr] md:p-8">
      <div className="flex flex-col items-center gap-3 md:border-r md:pr-8">
        <ScoreRing score={report.overallScore} size={164} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overall score</p>
      </div>
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-foreground/85">{report.summary}</p>
        <ul className="space-y-3.5" aria-label="Score breakdown">
          {report.scoreBreakdown.map((item) => (
            <li key={item.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="font-semibold tabular-nums">{item.score}</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={item.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={item.label}
              >
                <div
                  className={cn("h-full rounded-full transition-[width] duration-700", barTone[scoreTone(item.score)])}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function SkillsPanel({ report }: { report: AnalysisReport }) {
  const groups = (Object.keys(categoryLabel) as SkillCategory[])
    .map((cat) => ({ cat, skills: report.skills.filter((s) => s.category === cat) }))
    .filter((g) => g.skills.length > 0);
  const matched = report.skills.filter((s) => s.matchesJob).length;

  return (
    <Card className="p-6 shadow-card">
      <SectionTitle hint={`${matched} of ${report.skills.length} match the job`}>Extracted skills</SectionTitle>
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.cat}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{categoryLabel[g.cat]}</p>
            <ul className="flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <li
                  key={s.name}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium",
                    s.matchesJob ? "border-primary/20 bg-accent text-accent-foreground" : "bg-background text-foreground/80",
                  )}
                >
                  {s.matchesJob && <Check className="size-3" aria-hidden="true" />}
                  {s.name}
                  {s.matchesJob && <span className="sr-only">(matches job)</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MissingKeywordsPanel({ report }: { report: AnalysisReport }) {
  return (
    <Card className="p-6 shadow-card">
      <SectionTitle hint={`${report.missingKeywords.length} found`}>Missing keywords</SectionTitle>
      {report.missingKeywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">No important keywords are missing. Nice work.</p>
      ) : (
        <ul className="divide-y">
          {report.missingKeywords.map((k) => (
            <li key={k.keyword} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium">{k.keyword}</span>
                <Badge variant={priorityVariant[k.importance]} className="capitalize">
                  {k.importance}
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{k.suggestion}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function InsightCard({ kind, report }: { kind: "strengths" | "weaknesses"; report: AnalysisReport }) {
  const items = report[kind];
  const isStrength = kind === "strengths";
  const Icon = isStrength ? CheckCircle2 : TriangleAlert;
  return (
    <Card className="p-6 shadow-card">
      <SectionTitle>{isStrength ? "Strengths" : "Weaknesses"}</SectionTitle>
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.title} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                isStrength ? "bg-success-soft text-success" : "bg-warning-soft text-warning-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">{i.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{i.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!item.example) return;
    try {
      await navigator.clipboard.writeText(item.example.after);
      setCopied(true);
      toast.success("Rewrite copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  };
  return (
    <li className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={priorityVariant[item.priority]} className="capitalize">
          {item.priority} priority
        </Badge>
        <Badge variant="outline">{item.section}</Badge>
      </div>
      <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
      {item.example && (
        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <div className="rounded-lg border border-destructive/15 bg-destructive-soft p-3">
            <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-destructive">
              <Minus className="size-3" aria-hidden="true" /> Before
            </p>
            <p className="text-sm text-foreground/80">{item.example.before}</p>
          </div>
          <ArrowRight className="mx-auto hidden size-4 self-center text-muted-foreground md:block" aria-hidden="true" />
          <div className="relative rounded-lg border border-success/20 bg-success-soft p-3 pr-10">
            <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-success">
              <Plus className="size-3" aria-hidden="true" /> After
            </p>
            <p className="text-sm text-foreground">{item.example.after}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1.5 top-1.5 size-7"
              onClick={copy}
              aria-label="Copy suggested rewrite"
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

export function FeedbackPanel({ report }: { report: AnalysisReport }) {
  const [filter, setFilter] = useState<"all" | Priority>("all");
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  const items = report.feedback
    .filter((f) => filter === "all" || f.priority === filter)
    .sort((a, b) => order[a.priority] - order[b.priority]);

  return (
    <section aria-labelledby="feedback-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="feedback-title" className="flex items-center gap-2 text-base font-semibold">
          <Lightbulb className="size-4 text-primary" aria-hidden="true" /> Actionable feedback
        </h2>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="h-8">
            {(["all", "high", "medium", "low"] as const).map((p) => (
              <TabsTrigger key={p} value={p} className="h-6 px-2.5 text-xs capitalize">
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No {filter} priority items in this report.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <FeedbackCard key={f.id} item={f} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function ReportView({ report }: { report: AnalysisReport }) {
  return (
    <div className="space-y-6">
      <ScoreOverview report={report} />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback
            <span className="ml-1.5 rounded bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
              {report.feedback.length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <InsightCard kind="strengths" report={report} />
            <InsightCard kind="weaknesses" report={report} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <SkillsPanel report={report} />
            <MissingKeywordsPanel report={report} />
          </div>
          <FeedbackPanel report={report} />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackPanel report={report} />
        </TabsContent>
      </Tabs>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Reviewed by: {report.meta.agents.join(" · ")}
      </p>
    </div>
  );
}
