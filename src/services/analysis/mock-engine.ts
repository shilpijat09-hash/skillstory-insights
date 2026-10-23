/**
 * MOCK ANALYSIS ENGINE — prototype only.
 *
 * Produces a plausible, deterministic report from the job description so the
 * product workflow can be designed end-to-end. It does NOT read the resume and
 * is NOT AI. Every report it produces is tagged `meta.engine = "mock"` and the
 * UI labels it as a demo. Replace with the FastAPI + CrewAI backend.
 */
import type {
  AnalysisReport,
  ExtractedSkill,
  FeedbackItem,
  Insight,
  MissingKeyword,
  Priority,
  ScoreBreakdownItem,
  SkillCategory,
} from "@/types/analysis";
import { PROCESSING_STAGES } from "./stages";

interface SkillDef {
  name: string;
  category: SkillCategory;
  aliases?: string[];
}

const SKILLS: SkillDef[] = [
  { name: "JavaScript", category: "technical" },
  { name: "TypeScript", category: "technical" },
  { name: "React", category: "technical", aliases: ["react.js", "reactjs"] },
  { name: "Next.js", category: "technical", aliases: ["nextjs"] },
  { name: "Vue", category: "technical", aliases: ["vue.js"] },
  { name: "Node.js", category: "technical", aliases: ["node", "nodejs"] },
  { name: "Python", category: "technical" },
  { name: "Java", category: "technical" },
  { name: "Go", category: "technical", aliases: ["golang"] },
  { name: "SQL", category: "technical", aliases: ["postgresql", "postgres", "mysql"] },
  { name: "GraphQL", category: "technical" },
  { name: "REST APIs", category: "technical", aliases: ["rest", "restful"] },
  { name: "HTML", category: "technical" },
  { name: "CSS", category: "technical", aliases: ["tailwind", "sass"] },
  { name: "Machine Learning", category: "technical", aliases: ["ml"] },
  { name: "Data Analysis", category: "technical", aliases: ["analytics"] },
  { name: "Statistics", category: "technical", aliases: ["statistical"] },
  { name: "Testing", category: "technical", aliases: ["jest", "unit tests", "testing library", "cypress", "playwright"] },
  { name: "Accessibility", category: "technical", aliases: ["a11y", "wcag"] },
  { name: "Performance Optimization", category: "technical", aliases: ["performance", "core web vitals"] },
  { name: "System Design", category: "technical", aliases: ["architecture", "distributed systems"] },
  { name: "AWS", category: "tools", aliases: ["amazon web services"] },
  { name: "GCP", category: "tools", aliases: ["google cloud"] },
  { name: "Azure", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Kubernetes", category: "tools", aliases: ["k8s"] },
  { name: "CI/CD", category: "tools", aliases: ["github actions", "continuous integration"] },
  { name: "Git", category: "tools", aliases: ["github", "gitlab"] },
  { name: "Figma", category: "tools" },
  { name: "Jira", category: "tools" },
  { name: "Tableau", category: "tools" },
  { name: "Power BI", category: "tools" },
  { name: "Excel", category: "tools", aliases: ["spreadsheets"] },
  { name: "Looker", category: "tools" },
  { name: "dbt", category: "tools" },
  { name: "Amplitude", category: "tools", aliases: ["mixpanel"] },
  { name: "Communication", category: "soft", aliases: ["communicate", "communicator"] },
  { name: "Leadership", category: "soft", aliases: ["lead", "leading", "mentor", "mentoring"] },
  { name: "Collaboration", category: "soft", aliases: ["cross-functional", "collaborate"] },
  { name: "Stakeholder Management", category: "soft", aliases: ["stakeholders", "stakeholder"] },
  { name: "Problem Solving", category: "soft", aliases: ["problem-solving"] },
  { name: "Ownership", category: "soft", aliases: ["autonomy", "self-starter"] },
  { name: "Agile", category: "domain", aliases: ["scrum", "kanban"] },
  { name: "Product Strategy", category: "domain", aliases: ["roadmap", "roadmapping"] },
  { name: "A/B Testing", category: "domain", aliases: ["experimentation", "experiments"] },
  { name: "User Research", category: "domain", aliases: ["usability testing", "user interviews"] },
  { name: "Design Systems", category: "domain", aliases: ["design system", "component library"] },
  { name: "SaaS", category: "domain", aliases: ["b2b"] },
  { name: "Healthcare", category: "domain", aliases: ["clinical", "hipaa"] },
  { name: "Fintech", category: "domain", aliases: ["payments", "banking"] },
  { name: "E-commerce", category: "domain", aliases: ["ecommerce", "retail"] },
  { name: "Security", category: "domain", aliases: ["soc 2", "gdpr"] },
];

const FALLBACK_SKILLS = ["Communication", "Collaboration", "Problem Solving", "Stakeholder Management", "Agile"];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

function countMentions(text: string, def: SkillDef): number {
  const terms = [def.name, ...(def.aliases ?? [])];
  let count = 0;
  for (const term of terms) {
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(term.toLowerCase())}(?=$|[^a-z0-9])`, "g");
    count += (text.match(re) ?? []).length;
  }
  return count;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export interface MockEngineInput {
  jobTitle: string;
  jobDescription: string;
  fileName: string;
  generatedAt?: string;
}

export function generateMockReport(input: MockEngineInput): AnalysisReport {
  const jd = input.jobDescription.toLowerCase();
  const rand = seededRandom(hashString(`${input.fileName}|${input.jobTitle}|${jd.length}`));

  const requested = SKILLS.map((def) => ({ def, mentions: countMentions(jd, def) }))
    .filter((s) => s.mentions > 0)
    .sort((a, b) => b.mentions - a.mentions);

  if (requested.length < 4) {
    for (const name of FALLBACK_SKILLS) {
      if (requested.length >= 5) break;
      const def = SKILLS.find((s) => s.name === name)!;
      if (!requested.some((r) => r.def.name === name)) requested.push({ def, mentions: 1 });
    }
  }

  const matched: typeof requested = [];
  const missing: typeof requested = [];
  requested.forEach((r, i) => {
    if (i === 0 || rand() < 0.62) matched.push(r);
    else missing.push(r);
  });
  while (missing.length < 2 && matched.length > 2) missing.push(matched.pop()!);

  const extras = SKILLS.filter((s) => !requested.some((r) => r.def.name === s.name))
    .sort(() => rand() - 0.5)
    .slice(0, 4);

  const skills: ExtractedSkill[] = [
    ...matched.map((m) => ({ name: m.def.name, category: m.def.category, matchesJob: true })),
    ...extras.map((e) => ({ name: e.name, category: e.category, matchesJob: false })),
  ];

  const keywordScore = clamp(Math.round((matched.length / requested.length) * 100), 35, 96);
  const ats = Math.round(70 + rand() * 24);
  const impact = Math.round(48 + rand() * 40);
  const formatting = Math.round(64 + rand() * 30);
  const clarity = Math.round(58 + rand() * 36);

  const scoreBreakdown: ScoreBreakdownItem[] = [
    { key: "keywords", label: "Keyword match", score: keywordScore, description: "Coverage of skills and terms requested in the job description." },
    { key: "ats", label: "ATS compatibility", score: ats, description: "How reliably applicant tracking systems can parse the document." },
    { key: "impact", label: "Impact & metrics", score: impact, description: "Use of measurable outcomes and strong action verbs." },
    { key: "clarity", label: "Clarity & concision", score: clarity, description: "Readability, bullet length and scannability." },
    { key: "formatting", label: "Formatting", score: formatting, description: "Consistent structure, dates, headings and spacing." },
  ];

  const overallScore = Math.round(
    keywordScore * 0.35 + ats * 0.2 + impact * 0.2 + clarity * 0.15 + formatting * 0.1,
  );

  const topMatched = matched.slice(0, 3).map((m) => m.def.name);
  const strengths: Insight[] = [
    {
      title: `Relevant ${topMatched[0] ?? "core"} alignment`,
      detail: `The role emphasises ${topMatched.join(", ") || "core skills"}, which line up with the profile.`,
    },
    {
      title: ats >= 80 ? "Clean, ATS-friendly layout" : "Recognisable section structure",
      detail: "Standard headings (Experience, Education, Skills) make the document easier to parse.",
    },
    {
      title: "Clear career progression",
      detail: `Experience reads as a coherent path toward a ${input.jobTitle} position.`,
    },
  ];

  const missingNames = missing.map((m) => m.def.name);
  const weaknesses: Insight[] = [
    {
      title: "Gaps in requested keywords",
      detail: `The job description mentions ${missingNames.slice(0, 3).join(", ")}, which are not clearly evidenced.`,
    },
    impact < 70
      ? { title: "Too few measurable outcomes", detail: "Several bullets describe responsibilities rather than quantified results." }
      : { title: "Impact could be front-loaded", detail: "The strongest results sit at the end of bullets where recruiters skim past them." },
    clarity < 75
      ? { title: "Dense bullet points", detail: "Some bullets run past two lines, which slows down a 7-second recruiter scan." }
      : { title: "Generic summary", detail: "The opening summary could name the target role and your strongest differentiator." },
  ];

  const missingKeywords: MissingKeyword[] = missing.map((m, i) => {
    const importance: Priority = m.mentions >= 2 ? "high" : i < 2 ? "medium" : "low";
    return {
      keyword: m.def.name,
      importance,
      suggestion: `If you have ${m.def.name} experience, name it explicitly in a bullet with the outcome it produced.`,
    };
  });

  const feedback: FeedbackItem[] = [
    {
      id: "fb-1",
      section: "Experience",
      priority: "high",
      title: "Quantify the outcome of each key bullet",
      detail: "Lead with the result, then the action. Recruiters and ATS rankers weight numbers heavily.",
      example: {
        before: "Responsible for improving the onboarding flow.",
        after: "Redesigned onboarding flow, lifting week-1 activation from 41% to 58% across 12k new users.",
      },
    },
    {
      id: "fb-2",
      section: "Skills",
      priority: missing.length > 2 ? "high" : "medium",
      title: `Surface ${missingNames[0] ?? "requested"} keywords you genuinely have`,
      detail: "Mirror the exact phrasing from the job description where it is truthful — ATS matching is often literal.",
    },
    {
      id: "fb-3",
      section: "Summary",
      priority: "medium",
      title: `Tailor the summary to "${input.jobTitle}"`,
      detail: "Open with the target title, years of experience and one signature achievement.",
      example: {
        before: "Motivated professional seeking new opportunities.",
        after: `${input.jobTitle} with 6 years shipping B2B products; led a redesign that cut churn 18%.`,
      },
    },
    {
      id: "fb-4",
      section: "Formatting",
      priority: formatting < 80 ? "medium" : "low",
      title: "Keep dates and locations consistent",
      detail: "Use one date format (e.g. Jan 2023 – Present) and right-align it on every role.",
    },
    {
      id: "fb-5",
      section: "Experience",
      priority: "low",
      title: "Trim older roles to two bullets",
      detail: "Roles older than ~8 years rarely influence screening; reclaim the space for recent impact.",
    },
  ];

  return {
    summary: `Demo assessment for the ${input.jobTitle} role: the job description highlights ${requested
      .slice(0, 4)
      .map((r) => r.def.name)
      .join(", ")}. This mock engine estimates ${matched.length} of ${requested.length} requested skills are covered and suggests ${feedback.filter((f) => f.priority === "high").length} high-priority fixes.`,
    overallScore,
    scoreBreakdown,
    skills,
    strengths,
    weaknesses,
    missingKeywords,
    feedback,
    meta: {
      engine: "mock",
      generatedAt: input.generatedAt ?? new Date().toISOString(),
      agents: PROCESSING_STAGES.filter((s) => s.agent !== "Intake").map((s) => s.agent),
    },
  };
}
