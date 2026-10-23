import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FileText, Info } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateAnalysis } from "@/hooks/use-analyses";
import { requireAuthenticated } from "@/lib/route-auth";
import { JOB_DESCRIPTION_MIN_CHARS, JOB_DESCRIPTION_MAX_CHARS } from "@/config/app";
import { validateResumeFile } from "@/lib/file-validation";
import { isMockEngine } from "@/services/analysis";

export const Route = createFileRoute("/_authenticated/upload")({ ssr: false, beforeLoad: requireAuthenticated, component: UploadPage });
const schema = z.object({ jobTitle: z.string().trim().min(2, "Enter the target job title.").max(120), company: z.string().trim().max(120), jobDescription: z.string().trim().min(JOB_DESCRIPTION_MIN_CHARS, `Add at least ${JOB_DESCRIPTION_MIN_CHARS} characters from the job description.`).max(JOB_DESCRIPTION_MAX_CHARS, "Job description is too long.") });

function UploadPage() {
  const navigate = useNavigate();
  const create = useCreateAnalysis();
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState({ jobTitle: "", company: "", jobDescription: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!file) return setError("Choose a PDF or DOCX resume to continue.");
    const checked = validateResumeFile(file); if (!checked.ok) return setError(checked.error);
    const parsed = schema.safeParse(values); if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check the form fields.");
    setSubmitting(true);
    try {
      const result = await create.mutateAsync({ file, ...parsed.data });
      await navigate({ to: "/analyses/$analysisId", params: { analysisId: result.id } });
    } catch (e) { setError(e instanceof Error ? e.message : "We couldn't start the review. Please try again."); }
    finally { setSubmitting(false); }
  }
  return <AppShell><PageHeader eyebrow={<Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft size={14}/> Dashboard</Link>} title="Start a resume review" description="Choose a resume and tell us about the role you’re targeting." />
    {isMockEngine ? <Alert className="mb-6 border-warning/40 bg-warning-soft"><Info className="size-4 text-warning-foreground"/><AlertDescription className="text-warning-foreground"><strong>Demo mode:</strong> the mock engine does not read your resume or provide AI analysis. It creates a clearly labeled demo report from the job description. A connected CrewAI service is required for a real resume review.</AlertDescription></Alert> : <Alert className="mb-6"><Info className="size-4"/><AlertDescription>A CrewAI API URL is configured. The upload will be sent to that service; successful analysis still depends on the backend being available and configured.</AlertDescription></Alert>}
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_0.8fr]" noValidate>
      <Card className="space-y-6 p-5 sm:p-7"><div><h2 className="font-semibold">Resume file</h2><p className="mb-3 mt-1 text-sm text-muted-foreground">PDF or DOCX, up to 10 MB. Your upload requires configured Supabase Storage.</p><FileDropzone file={file} onFileChange={setFile} error={error.startsWith("Only PDF") || error.startsWith("File is too large") ? error : null} onError={(message) => setError(message ?? "")} disabled={submitting}/></div>
        <div className="space-y-2"><Label htmlFor="job-title">Target job title</Label><Input id="job-title" value={values.jobTitle} onChange={(e) => setValues({ ...values, jobTitle: e.target.value })} placeholder="e.g. Product Designer" maxLength={120}/></div>
        <div className="space-y-2"><Label htmlFor="company">Company <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="company" value={values.company} onChange={(e) => setValues({ ...values, company: e.target.value })} placeholder="e.g. Acme Inc." maxLength={120}/></div>
        <div className="space-y-2"><div className="flex items-baseline justify-between"><Label htmlFor="job-description">Job description</Label><span className="text-xs text-muted-foreground">{values.jobDescription.length}/{JOB_DESCRIPTION_MAX_CHARS}</span></div><Textarea id="job-description" rows={9} maxLength={JOB_DESCRIPTION_MAX_CHARS} value={values.jobDescription} onChange={(e) => setValues({ ...values, jobDescription: e.target.value })} placeholder="Paste the job description so we can compare its requirements…"/><p className="text-xs text-muted-foreground">At least {JOB_DESCRIPTION_MIN_CHARS} characters.</p></div>
        {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" asChild><Link to="/dashboard">Cancel</Link></Button><Button type="submit" disabled={submitting}>{submitting ? "Starting…" : "Continue to review"}<ArrowRight/></Button></div>
      </Card>
      <div className="space-y-4"><Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-accent p-2 text-primary"><FileText/></div><div><h3 className="font-medium">What you’ll need</h3><p className="text-sm text-muted-foreground">A resume and the target role details</p></div></div><ul className="mt-5 list-inside list-disc space-y-2 text-sm text-muted-foreground"><li>A PDF or DOCX resume under 10 MB</li><li>The job title you’re applying for</li><li>A full job description</li></ul></Card><Card className="p-5"><h3 className="font-medium">Your data</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Files are stored in your private Supabase bucket when configured. Do not upload sensitive information until you have confirmed your project’s storage and privacy setup.</p></Card></div>
    </form></AppShell>;
}
