import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingStage } from "@/types/analysis";

export function StageTimeline({
  stages,
  activeIndex,
  done,
  failed,
}: {
  stages: ProcessingStage[];
  activeIndex: number;
  done: boolean;
  failed?: boolean;
}) {
  return (
    <ol className="relative space-y-1" aria-label="Processing stages">
      {stages.map((stage, i) => {
        const complete = done || i < activeIndex;
        const active = !done && !failed && i === activeIndex;
        const status = complete ? "completed" : active ? "in progress" : "pending";
        return (
          <li
            key={stage.id}
            className={cn(
              "relative flex gap-4 rounded-xl px-3 py-3 transition-colors",
              active && "bg-accent/60",
            )}
            aria-current={active ? "step" : undefined}
          >
            {i < stages.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[1.45rem] top-11 h-[calc(100%-1.75rem)] w-px",
                  complete ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                complete && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-background text-primary shadow-glow",
                !complete && !active && "bg-background text-muted-foreground",
              )}
            >
              {complete ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : active ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className={cn("text-sm font-medium", !complete && !active && "text-muted-foreground")}>{stage.label}</p>
                <span className="sr-only">— {status}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="font-mono text-[11px] text-foreground/60">{stage.agent}</span>
                <span aria-hidden="true"> · </span>
                {stage.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
