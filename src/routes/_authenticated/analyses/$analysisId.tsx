import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { formatBytes } from "@/lib/file-validation";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { EngineNotice } from "@/components/report/engine-notice";
import { ReportView } from "@/components/report/report-view";
import { StageTimeline } from "@/components/analysis/stage-timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAnalysis } from "@/hooks/use-analyses";
import { requireAuthenticated } from "@/lib/route-auth";
import { PROCESSING_STAGES, analysisProvider } from "@/services/analysis";
import { SourceBadge, StatusBadge } from "@/components/report/status-badge";

export const Route = createFileRoute("/_authenticated/analyses/$analysisId")({ ssr: false, beforeLoad: requireAuthenticated, component: AnalysisPage });
function AnalysisPage() {
  const { analysisId } = Route.useParams();
  const query = useAnalysis(analysisId, { poll: true }); const analysis = query.data;
  if (query.isLoading) return <AppShell><Card role="status" className="p-8">Loading this analysis…</Card></AppShell>;
  if (query.isError) return <AppShell><Card className="p-6"><h1 className="font-semibold">Couldn’t load this analysis</h1><p className="mt-2 text-sm text-destructive">{(query.error as Error).message}</p><Button className="mt-4" variant="outline" onClick={() => void query.refetch()}>Try again</Button></Card></AppShell>;
  if (!analysis) return <AppShell><Card className="p-8 text-center"><h1 className="font-semibold">Analysis not found</h1><p className="mt-2 text-sm text-muted-foreground">It may have been deleted or may not belong to this account.</p><Button asChild className="mt-4"><Link to="/history">Back to history</Link></Button></Card></AppShell>;
  const progress = analysisProvider.getProgress(analysis);
  return <AppShell><PageHeader eyebrow={<Link to="/history" className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft size={14}/> History</Link>} title={analysis.jobTitle} description={`${analysis.fileName} · ${formatBytes(analysis.fileSize)}${analysis.company ? ` · ${analysis.company}` : ""}`} actions={<><SourceBadge source={analysis.engine}/><StatusBadge status={analysis.status}/></>}/>
    <EngineNotice source={analysis.engine} className="mb-6"/>
    {(analysis.status === "processing" || analysis.status === "queued") && <Card className="mb-6 p-5 sm:p-7"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">{analysis.engine === "mock" ? "Demo completion timer" : "Analysis progress (estimated)"}</h2><p className="text-sm text-muted-foreground">{analysis.engine === "mock" ? "This is a timed demo. The resume content is not being analyzed." : "The backend does not yet provide stage-level progress, so this estimate uses elapsed time."}</p></div><span className="text-sm tabular-nums text-muted-foreground">{progress.percent}%</span></div><div className="mb-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.percent}%` }}/></div>{analysis.engine === "crewai" && <StageTimeline stages={PROCESSING_STAGES} activeIndex={progress.stageIndex} done={false}/>}</Card>}
    {analysis.status === "failed" && <Card className="mb-6 border-destructive/30 p-6"><h2 className="font-semibold text-destructive">Review could not be completed</h2><p className="mt-2 text-sm text-muted-foreground">{analysis.errorMessage || "The analysis service reported an error."}</p><Button className="mt-4" variant="outline" asChild><Link to="/upload"><RotateCcw/> Start a new review</Link></Button></Card>}
    {analysis.report && <ReportView report={analysis.report}/>}
    {analysis.status === "completed" && !analysis.report && <Card className="p-6"><h2 className="font-semibold">Report data is unavailable</h2><p className="mt-2 text-sm text-muted-foreground">The analysis completed without a report payload.</p></Card>}
  </AppShell>;
}
