import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileSearch,
  Gauge,
  KeyRound,
  ListChecks,
  Lock,
  ScanText,
  Sparkles,
  Tags,
  UploadCloud,
  Wand2,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeIQ — AI resume review by a crew of agents" },
      {
        name: "description",
        content:
          "Upload your resume and a job description. ResumeIQ scores it, extracts skills, flags missing keywords and writes actionable fixes.",
      },
      { property: "og:title", content: "ResumeIQ — AI resume review by a crew of agents" },
      {
        property: "og:description",
        content: "Resume score, extracted skills, missing keywords and copy-ready rewrites for every job you apply to.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Gauge, title: "Resume score", text: "A 0–100 score with a transparent breakdown across keywords, ATS, impact, clarity and formatting." },
  { icon: Tags, title: "Skills extraction", text: "Technical, tool, domain and soft skills — highlighted when they match the role." },
  { icon: KeyRound, title: "Missing keywords", text: "The terms the job description asks for that your resume doesn't evidence, ranked by importance." },
  { icon: ListChecks, title: "Strengths & weaknesses", text: "A candid read on what already works and what will get you filtered out." },
  { icon: Wand2, title: "Actionable rewrites", text: "Prioritised fixes with before / after examples you can copy straight into your resume." },
  { icon: Lock, title: "Private by default", text: "Files live in private, per-user storage. Only you can read your resumes and reports." },
];

const STEPS = [
  { icon: UploadCloud, title: "Upload & target", text: "Drop in a PDF or DOCX and paste the job description you're applying for." },
  { icon: Bot, title: "Agents get to work", text: "Specialist agents parse, extract, match and score — each focused on one job." },
  { icon: FileSearch, title: "Get your report", text: "Review your score, gaps and rewrites, then come back to compare versions." },
];

const AGENTS = [
  { name: "Resume Parser", role: "Reads structure, sections, roles and dates from PDF or DOCX." },
  { name: "Skills Analyst", role: "Extracts and categorises skills and experience signals." },
  { name: "ATS Matcher", role: "Compares your resume to the job description, keyword by keyword." },
  { name: "Scoring Agent", role: "Rates compatibility, impact, clarity and formatting." },
  { name: "Career Coach", role: "Turns findings into prioritised, copy-ready improvements." },
];

function Landing() {
  const { session } = useAuth();
  const primaryTo = session ? "/upload" : "/signup";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 md:pt-24">
            <div className="mx-auto max-w-3xl text-center animate-fade-up">
              <a
                href="#agents"
                className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur hover:text-foreground"
              >
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                Multi-agent resume review, built on CrewAI
                <ArrowRight className="size-3" aria-hidden="true" />
              </a>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Know exactly why your resume <span className="text-gradient-violet">gets filtered out.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                ResumeIQ reviews your resume against the job you want — scoring it, mapping your skills, flagging missing
                keywords and writing the fixes for you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="hero" size="xl" asChild>
                  <Link to={primaryTo}>
                    Analyze my resume <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/sample-report">View a sample report</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">PDF or DOCX · Private storage · No credit card</p>
            </div>
            <div className="mt-16 animate-fade-up [animation-delay:150ms]">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* Checks strip */}
        <section aria-label="What gets checked" className="border-y bg-muted/30">
          <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
            {["ATS parsing", "Keyword coverage", "Quantified impact", "Formatting", "Clarity & length", "Role alignment"].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <ScanText className="size-4 text-primary" aria-hidden="true" /> {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">Features</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Everything a recruiter sees in seven seconds — and more.</h2>
              <p className="mt-4 text-muted-foreground">
                One report that tells you where you stand, what's missing, and exactly what to change.
              </p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="group bg-card p-7 transition-colors hover:bg-muted/40">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform group-hover:scale-105">
                    <f.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">From upload to action plan in three steps.</h2>
            </div>
            <ol className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border bg-card p-7 shadow-card">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-gradient-violet text-primary-foreground shadow-glow">
                    <s.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Agents */}
        <section id="agents" className="relative scroll-mt-20 overflow-hidden bg-gradient-navy py-24 text-navy-foreground">
          <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
          <div className="absolute -left-40 top-10 size-[28rem] rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary-glow">The crew</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Specialists, not one generic prompt.</h2>
              <p className="mt-4 leading-relaxed text-navy-muted">
                Each agent owns one part of the review and hands its findings to the next. The result is a report that's
                more thorough, more consistent and easier to act on.
              </p>
              <Button variant="hero" size="lg" className="mt-8" asChild>
                <Link to={primaryTo}>
                  Try it on your resume <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <ol className="space-y-3">
              {AGENTS.map((a, i) => (
                <li
                  key={a.name}
                  className="flex items-start gap-4 rounded-xl border border-navy-foreground/10 bg-navy-foreground/5 p-4 backdrop-blur"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/25 font-mono text-xs text-navy-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{a.name} Agent</p>
                    <p className="mt-0.5 text-sm text-navy-muted">{a.role}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-semibold sm:text-5xl">Your next application deserves a second opinion.</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Create a free account, upload your resume and see where you stand in minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to={primaryTo}>
                  {session ? "Start a new analysis" : "Create free account"} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              {!session && (
                <Button variant="ghost" size="xl" asChild>
                  <Link to="/auth">I already have an account</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
