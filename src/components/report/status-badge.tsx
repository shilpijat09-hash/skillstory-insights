import { CheckCircle2, CircleDashed, Loader2, XCircle, FlaskConical, Bot, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalysisSource, AnalysisStatus } from "@/types/analysis";

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="success">
          <CheckCircle2 aria-hidden="true" /> Completed
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="violet">
          <Loader2 className="animate-spin" aria-hidden="true" /> Processing
        </Badge>
      );
    case "queued":
      return (
        <Badge variant="muted">
          <CircleDashed aria-hidden="true" /> Queued
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <XCircle aria-hidden="true" /> Failed
        </Badge>
      );
  }
}

export function SourceBadge({ source }: { source: AnalysisSource }) {
  if (source === "sample")
    return (
      <Badge variant="outline">
        <BookOpen aria-hidden="true" /> Sample
      </Badge>
    );
  if (source === "mock")
    return (
      <Badge variant="warning">
        <FlaskConical aria-hidden="true" /> Demo engine
      </Badge>
    );
  return (
    <Badge variant="violet">
      <Bot aria-hidden="true" /> CrewAI
    </Badge>
  );
}
