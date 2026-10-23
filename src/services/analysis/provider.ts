import type { Analysis, AnalysisEngine, AnalysisProgress, NewAnalysisInput } from "@/types/analysis";

/**
 * Contract every analysis engine implements. The UI only talks to this
 * interface, so swapping the mock engine for the FastAPI + CrewAI backend
 * requires no component changes.
 */
export interface AnalysisProvider {
  readonly engine: AnalysisEngine;
  /** Uploads the resume and creates an analysis job. */
  submit(input: NewAnalysisInput): Promise<Analysis>;
  /** Returns the latest state of a job (advancing it for the mock engine). */
  getAnalysis(id: string): Promise<Analysis | null>;
  /** Derives the processing stage to display for an in-flight job. */
  getProgress(analysis: Analysis): AnalysisProgress;
  list(): Promise<Analysis[]>;
  remove(analysis: Analysis): Promise<void>;
  removeAll(): Promise<number>;
}
