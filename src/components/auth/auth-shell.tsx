import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const POINTS = [
  "Resume score with a transparent breakdown",
  "Skills extraction and missing-keyword detection",
  "Prioritised, copy-ready rewrite suggestions",
];

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {description && <div className="mt-2 text-sm text-muted-foreground">{description}</div>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </main>
      </div>
      <aside className="relative hidden overflow-hidden bg-gradient-navy text-navy-foreground lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
        <div
          className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-muted">ResumeIQ</p>
          <p className="mt-4 text-3xl font-semibold leading-tight">
            A crew of specialist agents, reviewing every line of your resume.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-navy-foreground/85">
                <CheckCircle2 className="size-4 text-primary-glow" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="relative my-6 flex items-center" role="separator">
      <span className="h-px flex-1 bg-border" />
      <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
