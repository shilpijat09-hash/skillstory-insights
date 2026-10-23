import { ANALYSIS_API_URL } from "@/config/app";
import { apiAnalysisProvider } from "./api-provider";
import { mockAnalysisProvider } from "./mock-provider";
import type { AnalysisProvider } from "./provider";

/** The active engine: CrewAI backend when configured, otherwise the labelled mock engine. */
export const analysisProvider: AnalysisProvider = ANALYSIS_API_URL ? apiAnalysisProvider : mockAnalysisProvider;

export const isMockEngine = analysisProvider.engine === "mock";

export { PROCESSING_STAGES, computeProgress } from "./stages";
export type { AnalysisProvider } from "./provider";
