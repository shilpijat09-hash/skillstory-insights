import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ReportView } from "@/components/report/report-view";
import { EngineNotice } from "@/components/report/engine-notice";
import { SAMPLE_ANALYSES } from "@/data/sample-analyses";
import { formatBytes } from "@/lib/file-validation";

export const Route = createFileRoute("/sample-report")({
  head: () => ({
    meta: [
      { title: "Sample resume report — ResumeIQ" },
      {
        name: "description",
        content: "See what a ResumeIQ review looks like: score breakdown, extracted skills, missing keywords and rewrites.",
      },
      { property: "og:title", content: "Sample resume report — ResumeIQ" },
      { property: "og:description", content: "An illustrative ResumeIQ report for a Senior Frontend Engineer application." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SampleReportPage,
});

function SampleReportPage() {
  const sample = SAMPLE_ANALYSES[0];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Sample report</p>
            <h1 className="mt-1 text-3xl font-semibold">{sample.jobTitle}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" aria-hidden="true" />
              {sample.fileName} · {formatBytes(sample.fileSize)} · {sample.company}
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/signup">
              Analyze your resume <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <EngineNotice source="sample" className="mb-6" />
        <ReportView report={sample.report!} />
      </main>
      <SiteFooter />
    </div>
  );
}
