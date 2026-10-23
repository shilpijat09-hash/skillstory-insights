import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, FileText, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EngineNotice } from "@/components/report/engine-notice";
import { useAnalyses } from "@/hooks/use-analyses";
import { useAuth, displayName } from "@/hooks/use-auth";
import { requireAuthenticated } from "@/lib/route-auth";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge, SourceBadge } from "@/components/report/status-badge";
import { isMockEngine } from "@/services/analysis";

export const Route = createFileRoute("/_authenticated/dashboard")({ ssr: false, beforeLoad: requireAuthenticated, component: Dashboard });

function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useAnalyses();
  const analyses = data ?? [];
  return <AppShell>
    <PageHeader eyebrow={<span className="text-xs font-semibold uppercase tracking-wider text-primary">Workspace</span>} title={`Welcome back, ${displayName(user, user?.user_metadata?.full_name as string | undefined)}`} description="Your resume review workspace, all in one place." actions={<Button asChild><Link to="/upload"><FilePlus2 /> New analysis</Link></Button>} />
    {isMockEngine && <EngineNotice source="mock" className="mb-6" />}
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat label="Total reviews" value={isLoading ? "—" : String(analyses.length)} hint="Saved to your account" icon={<FileText />} />
      <Stat label="Completed" value={isLoading ? "—" : String(analyses.filter((a) => a.status === "completed").length)} hint="Reports ready to review" icon={<Sparkles />} />
      <Stat label="Latest score" value={isLoading ? "—" : String(analyses.find((a) => a.score !== null)?.score ?? "—")} hint="From your latest completed report" icon={<Sparkles />} />
    </div>
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent analyses</h2><Button variant="ghost" asChild><Link to="/history">View history <ArrowRight /></Link></Button></div>
      {isLoading ? <Card className="p-8 text-sm text-muted-foreground" role="status">Loading your analyses…</Card> : isError ? <Card className="p-6"><p className="text-sm text-destructive">Could not load analyses: {(error as Error).message}</p><Button className="mt-3" variant="outline" onClick={() => void refetch()}>Try again</Button></Card> : analyses.length === 0 ? <Card className="flex flex-col items-center p-10 text-center"><div className="rounded-2xl bg-accent p-3 text-primary"><FilePlus2 /></div><h3 className="mt-4 font-semibold">Your first review starts here</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Add a resume and target job to create a review. Demo results are clearly labeled.</p><Button asChild className="mt-5"><Link to="/upload">Create an analysis</Link></Button></Card> : <div className="space-y-3">{analyses.slice(0, 5).map((a) => <Card key={a.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-medium">{a.jobTitle}</h3><SourceBadge source={a.engine} /><StatusBadge status={a.status} /></div><p className="mt-1 text-sm text-muted-foreground">{a.fileName} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p></div><Button variant="outline" size="sm" asChild><Link to="/analyses/$analysisId" params={{ analysisId: a.id }}>Open report <ArrowRight /></Link></Button></Card>)}</div>}
    </section>
  </AppShell>;
}
function Stat({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) { return <Card className="p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-sm">{label}</span><span className="text-primary">{icon}</span></div><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></Card>; }
