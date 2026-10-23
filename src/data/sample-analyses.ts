/**
 * Illustrative sample reports for the prototype. Clearly labelled "Sample" in
 * the UI. People and companies are fictional.
 */
import type { Analysis, AnalysisReport, ScoreBreakdownItem } from "@/types/analysis";

const AGENTS = ["Resume Parser Agent", "Skills Analyst Agent", "ATS Matcher Agent", "Scoring Agent", "Career Coach Agent"];

function breakdown(k: number, ats: number, impact: number, clarity: number, formatting: number): ScoreBreakdownItem[] {
  return [
    { key: "keywords", label: "Keyword match", score: k, description: "Coverage of skills and terms requested in the job description." },
    { key: "ats", label: "ATS compatibility", score: ats, description: "How reliably applicant tracking systems can parse the document." },
    { key: "impact", label: "Impact & metrics", score: impact, description: "Use of measurable outcomes and strong action verbs." },
    { key: "clarity", label: "Clarity & concision", score: clarity, description: "Readability, bullet length and scannability." },
    { key: "formatting", label: "Formatting", score: formatting, description: "Consistent structure, dates, headings and spacing." },
  ];
}

const frontendReport: AnalysisReport = {
  summary:
    "Strong match for a senior frontend role. The resume shows deep React and TypeScript experience with clear ownership of a design system. Impact is well quantified in recent roles, but accessibility, testing strategy and GraphQL — all named in the job description — are under-represented.",
  overallScore: 82,
  scoreBreakdown: breakdown(78, 91, 84, 80, 88),
  skills: [
    { name: "React", category: "technical", matchesJob: true },
    { name: "TypeScript", category: "technical", matchesJob: true },
    { name: "Next.js", category: "technical", matchesJob: true },
    { name: "Performance Optimization", category: "technical", matchesJob: true },
    { name: "Design Systems", category: "domain", matchesJob: true },
    { name: "CI/CD", category: "tools", matchesJob: true },
    { name: "Figma", category: "tools", matchesJob: true },
    { name: "Leadership", category: "soft", matchesJob: true },
    { name: "Collaboration", category: "soft", matchesJob: true },
    { name: "Node.js", category: "technical", matchesJob: false },
    { name: "Storybook", category: "tools", matchesJob: false },
    { name: "Mentoring", category: "soft", matchesJob: false },
  ],
  strengths: [
    { title: "Quantified frontend impact", detail: "Bullets like \"cut LCP from 4.1s to 1.6s across 30 routes\" give recruiters concrete evidence of seniority." },
    { title: "Design system ownership", detail: "Leading a 60-component library maps directly to the role's platform responsibilities." },
    { title: "Clean, single-column layout", detail: "Standard headings and no tables or text boxes — parses cleanly in common ATS." },
  ],
  weaknesses: [
    { title: "Accessibility barely mentioned", detail: "The posting lists WCAG 2.2 compliance as a core requirement; the resume mentions a11y once, without outcomes." },
    { title: "Testing strategy is implicit", detail: "No mention of Jest, Testing Library or Playwright despite \"strong testing culture\" in the description." },
    { title: "Summary is generic", detail: "The opening line doesn't name the target role or your strongest differentiator." },
  ],
  missingKeywords: [
    { keyword: "Accessibility (WCAG)", importance: "high", suggestion: "Add a bullet on an a11y audit or fix, with the compliance level achieved." },
    { keyword: "GraphQL", importance: "high", suggestion: "If you used Apollo or Relay, name it next to the data-layer work you describe." },
    { keyword: "Testing", importance: "medium", suggestion: "Mention your testing stack and a coverage or regression outcome." },
    { keyword: "Micro-frontends", importance: "low", suggestion: "Only add if you have hands-on experience; otherwise skip." },
  ],
  feedback: [
    {
      id: "s1-1",
      section: "Experience",
      priority: "high",
      title: "Turn accessibility work into a measurable win",
      detail: "Accessibility is a must-have for this role. Show it with a concrete outcome.",
      example: {
        before: "Worked on accessibility improvements.",
        after: "Led WCAG 2.2 AA remediation of checkout, resolving 140+ axe violations and raising Lighthouse a11y score from 72 to 98.",
      },
    },
    {
      id: "s1-2",
      section: "Skills",
      priority: "high",
      title: "Mirror the job's data-layer keywords",
      detail: "The posting says GraphQL four times. If you've used it, list it in Skills and in the relevant bullet.",
    },
    {
      id: "s1-3",
      section: "Summary",
      priority: "medium",
      title: "Rewrite the summary for this role",
      detail: "Lead with title, years and a signature achievement.",
      example: {
        before: "Passionate developer who loves building great user experiences.",
        after: "Senior Frontend Engineer, 7 years in React/TypeScript; built the design system now used by 9 product teams.",
      },
    },
    {
      id: "s1-4",
      section: "Experience",
      priority: "medium",
      title: "Name your testing stack",
      detail: "Add one bullet on testing practice — tools, coverage, or a reduction in production regressions.",
    },
    {
      id: "s1-5",
      section: "Formatting",
      priority: "low",
      title: "Align date formats",
      detail: "Two roles use \"2021–2023\" while others use \"Mar 2021 – Jun 2023\". Pick one.",
    },
  ],
  meta: { engine: "sample", generatedAt: "2026-10-18T09:24:00.000Z", agents: AGENTS },
};

const pmReport: AnalysisReport = {
  summary:
    "Solid product background but the resume reads as a generalist PM rather than a growth specialist. Experimentation, funnel metrics and lifecycle tooling — the heart of this role — need to be far more visible.",
  overallScore: 68,
  scoreBreakdown: breakdown(61, 86, 63, 72, 81),
  skills: [
    { name: "Product Strategy", category: "domain", matchesJob: true },
    { name: "Stakeholder Management", category: "soft", matchesJob: true },
    { name: "SQL", category: "technical", matchesJob: true },
    { name: "Jira", category: "tools", matchesJob: true },
    { name: "Agile", category: "domain", matchesJob: true },
    { name: "User Research", category: "domain", matchesJob: false },
    { name: "Figma", category: "tools", matchesJob: false },
    { name: "Communication", category: "soft", matchesJob: true },
  ],
  strengths: [
    { title: "Cross-functional leadership", detail: "Evidence of leading squads of 8–12 across design, engineering and data." },
    { title: "Data fluency", detail: "SQL and dashboard ownership signal you can self-serve analysis." },
    { title: "ATS-friendly structure", detail: "Clear headings and consistent bullets parse reliably." },
  ],
  weaknesses: [
    { title: "Few growth metrics", detail: "Activation, retention and conversion numbers are mostly absent." },
    { title: "No experimentation evidence", detail: "The role centres on A/B testing; the resume doesn't mention a single experiment." },
    { title: "Responsibilities over outcomes", detail: "Many bullets start with \"Responsible for\" rather than a result." },
  ],
  missingKeywords: [
    { keyword: "A/B Testing", importance: "high", suggestion: "Describe an experiment you ran, its hypothesis and lift." },
    { keyword: "Amplitude", importance: "high", suggestion: "Name the analytics tools you used for funnel analysis." },
    { keyword: "Lifecycle marketing", importance: "medium", suggestion: "Mention onboarding or re-engagement flows you owned." },
    { keyword: "PLG", importance: "medium", suggestion: "Reference product-led growth initiatives if applicable." },
  ],
  feedback: [
    {
      id: "s2-1",
      section: "Experience",
      priority: "high",
      title: "Lead every bullet with a growth metric",
      detail: "Growth hiring managers scan for activation, conversion and retention numbers.",
      example: {
        before: "Responsible for the onboarding experience.",
        after: "Rebuilt onboarding checklist; activation +17 pts and 30-day retention +6 pts across 40k signups.",
      },
    },
    { id: "s2-2", section: "Experience", priority: "high", title: "Add an experimentation bullet", detail: "Show your test velocity and a winning experiment with its measured lift." },
    { id: "s2-3", section: "Skills", priority: "medium", title: "List your analytics stack", detail: "Amplitude, Mixpanel, Looker — name what you've actually used." },
    { id: "s2-4", section: "Summary", priority: "low", title: "Position yourself as a growth PM", detail: "Swap \"product manager\" for \"growth product manager\" if accurate." },
  ],
  meta: { engine: "sample", generatedAt: "2026-10-12T15:02:00.000Z", agents: AGENTS },
};

const dataReport: AnalysisReport = {
  summary:
    "The resume is a weak match today. It emphasises spreadsheet reporting, while the posting asks for SQL, Python and BI tooling in a healthcare context. Formatting issues (a two-column template) may also hurt ATS parsing.",
  overallScore: 54,
  scoreBreakdown: breakdown(46, 58, 52, 61, 55),
  skills: [
    { name: "Excel", category: "tools", matchesJob: true },
    { name: "Data Analysis", category: "technical", matchesJob: true },
    { name: "Communication", category: "soft", matchesJob: true },
    { name: "Tableau", category: "tools", matchesJob: true },
    { name: "Statistics", category: "technical", matchesJob: false },
    { name: "Problem Solving", category: "soft", matchesJob: false },
  ],
  strengths: [
    { title: "Reporting experience", detail: "Three years building weekly KPI reports for leadership." },
    { title: "Stakeholder communication", detail: "Evidence of presenting findings to non-technical audiences." },
    { title: "Tableau exposure", detail: "Dashboard work maps partially to the BI requirements." },
  ],
  weaknesses: [
    { title: "Two-column layout", detail: "Many ATS read columns left-to-right across both, scrambling your content." },
    { title: "SQL and Python missing", detail: "Both are listed as required; neither appears on the resume." },
    { title: "No domain signal", detail: "No healthcare, clinical or HIPAA-related experience is mentioned." },
  ],
  missingKeywords: [
    { keyword: "SQL", importance: "high", suggestion: "If you query databases at all, say so with an example query outcome." },
    { keyword: "Python", importance: "high", suggestion: "Mention pandas or notebooks if you've used them, even in projects." },
    { keyword: "HIPAA", importance: "medium", suggestion: "Note any experience handling sensitive or regulated data." },
    { keyword: "Power BI", importance: "low", suggestion: "Optional — Tableau experience transfers; mention willingness." },
  ],
  feedback: [
    { id: "s3-1", section: "Formatting", priority: "high", title: "Switch to a single-column template", detail: "This is the quickest win for ATS parsing reliability." },
    {
      id: "s3-2",
      section: "Experience",
      priority: "high",
      title: "Show technical depth behind your reports",
      detail: "Explain how data was sourced and transformed, not just that a report existed.",
      example: {
        before: "Created weekly reports for management.",
        after: "Automated weekly KPI pipeline (SQL + Tableau), cutting reporting time from 6 hours to 40 minutes.",
      },
    },
    { id: "s3-3", section: "Projects", priority: "medium", title: "Add a portfolio project", detail: "A public SQL/Python analysis on a health dataset would close the domain gap." },
  ],
  meta: { engine: "sample", generatedAt: "2026-10-03T11:40:00.000Z", agents: AGENTS },
};

const uxReport: AnalysisReport = {
  summary:
    "Good alignment with a product-focused UX role. Research and Figma craft come through clearly. Strengthen the link between design decisions and business outcomes, and reference design systems work explicitly.",
  overallScore: 76,
  scoreBreakdown: breakdown(74, 82, 68, 81, 79),
  skills: [
    { name: "Figma", category: "tools", matchesJob: true },
    { name: "User Research", category: "domain", matchesJob: true },
    { name: "Collaboration", category: "soft", matchesJob: true },
    { name: "Accessibility", category: "technical", matchesJob: true },
    { name: "Communication", category: "soft", matchesJob: true },
    { name: "HTML", category: "technical", matchesJob: false },
    { name: "CSS", category: "technical", matchesJob: false },
  ],
  strengths: [
    { title: "Research-led process", detail: "Clear evidence of interviews and usability testing feeding design decisions." },
    { title: "Accessibility awareness", detail: "Mentions contrast and keyboard-navigation fixes — relevant to the role." },
    { title: "Concise bullets", detail: "Most bullets fit on one line and are easy to scan." },
  ],
  weaknesses: [
    { title: "Outcomes are qualitative", detail: "\"Improved the experience\" appears several times without a metric." },
    { title: "Design systems implied, not stated", detail: "The role names design systems explicitly; the resume doesn't." },
    { title: "Portfolio link buried", detail: "Your portfolio URL sits in the footer instead of the header." },
  ],
  missingKeywords: [
    { keyword: "Design Systems", importance: "high", suggestion: "Describe components or tokens you contributed to." },
    { keyword: "Prototyping", importance: "medium", suggestion: "Mention interactive prototypes used to validate flows." },
    { keyword: "A/B Testing", importance: "low", suggestion: "Reference any experiments that validated a design." },
  ],
  feedback: [
    {
      id: "s4-1",
      section: "Experience",
      priority: "high",
      title: "Attach a metric to each design outcome",
      detail: "Even directional numbers help: task success, time-on-task, conversion.",
      example: {
        before: "Improved the checkout experience.",
        after: "Redesigned checkout after 12 usability sessions; task success 71% → 93%, drop-off −22%.",
      },
    },
    { id: "s4-2", section: "Header", priority: "medium", title: "Move your portfolio link to the top", detail: "Recruiters look for it in the first few seconds." },
    { id: "s4-3", section: "Skills", priority: "medium", title: "Name design systems explicitly", detail: "List the systems you've built or maintained." },
  ],
  meta: { engine: "sample", generatedAt: "2026-09-27T08:15:00.000Z", agents: AGENTS },
};

function sample(
  id: string,
  jobTitle: string,
  company: string,
  fileName: string,
  fileSize: number,
  report: AnalysisReport,
  jobDescription: string,
): Analysis {
  return {
    id,
    jobTitle,
    company,
    jobDescription,
    fileName,
    fileSize,
    fileType: fileName.endsWith(".pdf")
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    resumePath: null,
    status: "completed",
    engine: "mock",
    score: report.overallScore,
    report,
    errorMessage: null,
    createdAt: report.meta.generatedAt,
    completedAt: report.meta.generatedAt,
    isSample: true,
  };
}

export const SAMPLE_ANALYSES: Analysis[] = [
  sample(
    "sample-frontend",
    "Senior Frontend Engineer",
    "Northwind Labs",
    "alex-morgan-resume.pdf",
    184_320,
    frontendReport,
    "We're hiring a Senior Frontend Engineer to own our React + TypeScript platform. You'll lead our design system, champion accessibility (WCAG 2.2), work with GraphQL APIs and keep a strong testing culture.",
  ),
  sample(
    "sample-pm",
    "Product Manager, Growth",
    "Brightline",
    "jordan-lee-pm.docx",
    96_256,
    pmReport,
    "Own activation and retention for our self-serve funnel. Run a high-velocity A/B testing program, partner with lifecycle marketing and use Amplitude and SQL to find growth levers.",
  ),
  sample(
    "sample-ux",
    "Product Designer (UX)",
    "Lumen Studio",
    "sam-rivera-portfolio-cv.pdf",
    412_672,
    uxReport,
    "Design end-to-end product experiences in Figma, lead user research, contribute to our design system and partner closely with engineering on accessible, prototyped solutions.",
  ),
  sample(
    "sample-data",
    "Data Analyst",
    "Harbor Health",
    "priya-shah-resume.pdf",
    151_552,
    dataReport,
    "Analyse clinical and operational data with SQL and Python, build Power BI / Tableau dashboards and work within HIPAA guidelines to support care teams.",
  ),
];

export const isSampleId = (id: string) => id.startsWith("sample-");

export const getSampleAnalysis = (id: string) => SAMPLE_ANALYSES.find((a) => a.id === id) ?? null;
