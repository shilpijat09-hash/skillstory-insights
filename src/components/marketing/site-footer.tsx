import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A crew of AI agents that reviews your resume against the job you actually want.
          </p>
        </div>
        <nav aria-label="Product">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/#features" className="hover:text-primary">Features</a></li>
            <li><a href="/#how-it-works" className="hover:text-primary">How it works</a></li>
            <li><Link to="/sample-report" className="hover:text-primary">Sample report</Link></li>
          </ul>
        </nav>
        <nav aria-label="Account">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/auth" className="hover:text-primary">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-primary">Create account</Link></li>
            <li><Link to="/forgot-password" className="hover:text-primary">Reset password</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} ResumeIQ. Prototype — reports are labelled when they come from the demo engine.
        </p>
      </div>
    </footer>
  );
}
