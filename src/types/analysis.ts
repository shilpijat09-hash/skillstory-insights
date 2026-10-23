/**
 * Domain models for ResumeIQ analyses.
 * These shapes are shared by the mock engine, the Supabase repository and the
 * future FastAPI + CrewAI backend (see docs/backend-contract.md).
 */

export type AnalysisStatus = "queued" | "processing" | "completed" | "failed";

/** Which engine produced (or will produce) the report. */
export type AnalysisEngine = "mock" | "crewai";

/** Where a record comes from, used for labelling in the UI. */
export type AnalysisSource = "sample" | "mock" | "crewai";

export type ScoreDimension = "ats" | "keywords" | "impact" | "formatting" | "clarity";

export type SkillCategory = "technical" | "tools" | "soft" | "domain";

export type Priority = "high" | "medium" | "low";

export interface ScoreBreakdownItem {
  key: ScoreDimension;
  label: string;
  score: number;
  description: string;
}

export interface ExtractedSkill {
  name: string;
  category: SkillCategory;
  /** True when the skill is also requested in the job description. */
  matchesJob: boolean;
}

export interface Insight {
  title: string;
  detail: string;
}

export interface MissingKeyword {
  keyword: string;
  importance: Priority;
  suggestion: string;
}

export interface FeedbackItem {
  id: string;
  section: string;
  priority: Priority;
  title: string;
  detail: string;
  example?: { before: string; after: string };
}

export interface ReportMeta {
  engine: AnalysisEngine | "sample";
  generatedAt: string;
  agents: string[];
  model?: string;
}

export interface AnalysisReport {
  summary: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdownItem[];
  skills: ExtractedSkill[];
  strengths: Insight[];
  weaknesses: Insight[];
  missingKeywords: MissingKeyword[];
  feedback: FeedbackItem[];
  meta: ReportMeta;
}

export interface Analysis {
  id: string;
  jobTitle: string;
  company: string | null;
  jobDescription: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  resumePath: string | null;
  status: AnalysisStatus;
  engine: AnalysisEngine;
  score: number | null;
  report: AnalysisReport | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  isSample: boolean;
}

export interface NewAnalysisInput {
  file: File;
  jobTitle: string;
  company?: string;
  jobDescription: string;
}

export interface ProcessingStage {
  id: string;
  label: string;
  description: string;
  agent: string;
  /** Relative duration weight used by the mock timeline. */
  weight: number;
}

export interface AnalysisProgress {
  stageIndex: number;
  percent: number;
  done: boolean;
}

export function getAnalysisSource(a: Pick<Analysis, "isSample" | "engine">): AnalysisSource {
  return a.isSample ? "sample" : a.engine;
}
