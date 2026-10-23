import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-violet shadow-glow",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4 text-primary-foreground" fill="none">
        <path d="M7 4h7l4 4v12H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 12h5M10 15.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18.5" cy="5.5" r="2" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ to = "/", className, compact = false }: { to?: string; className?: string; compact?: boolean }) {
  return (
    <Link
      to={to}
      className={cn("inline-flex items-center gap-2 rounded-md font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      aria-label="ResumeIQ home"
    >
      <LogoMark />
      {!compact && (
        <span className="text-[15px]">
          Resume<span className="text-primary">IQ</span>
        </span>
      )}
    </Link>
  );
}
