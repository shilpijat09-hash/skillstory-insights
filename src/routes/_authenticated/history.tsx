import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, Search, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, SourceBadge } from "@/components/report/status-badge";
import { useAnalyses, useDeleteAnalysis } from "@/hooks/use-analyses";
import { requireAuthenticated } from "@/lib/route-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({ ssr: false, beforeLoad: requireAuthenticated, component: HistoryPage });
function HistoryPage() {
  const { data, isLoading, isError, error, refetch } = useAnalyses(); const remove = useDeleteAnalysis();
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => (data ?? []).filter((a) => `${a.jobTitle} ${a.company ?? ""} ${a.fileName}`.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || a.status === filter)), [data, search, filter]);
  return <AppShell><PageHeader title="Analysis history" description="Find and revisit your saved resume reviews." actions={<Button asChild><Link to="/upload"><FilePlus2/> New analysis</Link></Button>}/>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input aria-label="Search analyses" className="pl-9" placeholder="Search by role, company, or file…" value={search} onChange={(e) => setSearch(e.target.value)}/></div><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="Filter by status" className="sm:w-48"><SelectValue placeholder="All statuses"/></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="queued">Queued</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select></div>
    {remove.isError && <p role="alert" className="mb-4 text-sm text-destructive">Could not delete the analysis: {(remove.error as Error).message}</p>}
    {isLoading ? <Card role="status" className="p-8 text-sm text-muted-foreground">Loading analysis history…</Card> : isError ? <Card className="p-6"><p className="text-sm text-destructive">History could not be loaded: {(error as Error).message}</p><Button className="mt-3" variant="outline" onClick={() => void refetch()}>Try again</Button></Card> : rows.length === 0 ? <Card className="flex flex-col items-center p-10 text-center"><div className="rounded-2xl bg-accent p-3 text-primary"><Search/></div><h2 className="mt-4 font-semibold">{data?.length ? "No matching reviews" : "No reviews yet"}</h2><p className="mt-1 text-sm text-muted-foreground">{data?.length ? "Try a different search or status filter." : "Your saved reviews will appear here once you create one."}</p>{!data?.length && <Button asChild className="mt-5"><Link to="/upload">Create your first review</Link></Button>}</Card> : <div className="space-y-3">{rows.map((a) => <Card key={a.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-medium">{a.jobTitle}</h2><SourceBadge source={a.engine}/><StatusBadge status={a.status}/></div><p className="mt-1 truncate text-sm text-muted-foreground">{a.company ? `${a.company} · ` : ""}{a.fileName} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>{a.score !== null && <p className="mt-1 text-xs text-muted-foreground">Score: {a.score}/100</p>}</div><div className="flex items-center gap-2"><Button size="sm" variant="outline" asChild><Link to="/analyses/$analysisId" params={{ analysisId: a.id }}>View <ArrowRight/></Link></Button><Button size="icon" variant="ghost" aria-label={`Delete analysis for ${a.jobTitle}`} disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete the analysis for “${a.jobTitle}”?`)) remove.mutate(a, { onSuccess: () => toast.success("Analysis deleted"), onError: (err) => toast.error("Could not delete analysis", { description: err.message }) }); }}><Trash2 className="size-4 text-muted-foreground"/></Button></div></Card>)}</div>}
  </AppShell>;
}
