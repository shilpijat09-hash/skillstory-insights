import type { AnalysisProgress, ProcessingStage } from "@/types/analysis";

/** Mirrors the CrewAI crew the FastAPI backend will run. */
export const PROCESSING_STAGES: ProcessingStage[] = [
  {
    id: "intake",
    label: "Securing your upload",
    description: "Storing the file privately and validating its format.",
    agent: "Intake",
    weight: 1,
  },
  {
    id: "parse",
    label: "Parsing resume structure",
    description: "Reading sections, roles, dates and bullet points.",
    agent: "Resume Parser Agent",
    weight: 2,
  },
  {
    id: "skills",
    label: "Extracting skills & experience",
    description: "Identifying technical, tool, domain and soft skills.",
    agent: "Skills Analyst Agent",
    weight: 2,
  },
  {
    id: "match",
    label: "Matching against the job description",
    description: "Comparing your profile with the role's requirements and keywords.",
    agent: "ATS Matcher Agent",
    weight: 2.5,
  },
  {
    id: "score",
    label: "Scoring & benchmarking",
    description: "Rating ATS compatibility, impact, formatting and clarity.",
    agent: "Scoring Agent",
    weight: 1.5,
  },
  {
    id: "feedback",
    label: "Writing actionable feedback",
    description: "Drafting prioritised fixes and rewrite examples.",
    agent: "Career Coach Agent",
    weight: 2,
  },
];

/** Total duration of the simulated (mock) pipeline. */
export const MOCK_PIPELINE_MS = 14_000;

export function computeProgress(
  elapsedMs: number,
  totalMs: number = MOCK_PIPELINE_MS,
  stages: ProcessingStage[] = PROCESSING_STAGES,
): AnalysisProgress {
  const elapsed = Math.max(0, elapsedMs);
  if (elapsed >= totalMs) {
    return { stageIndex: stages.length - 1, percent: 100, done: true };
  }
  const totalWeight = stages.reduce((sum, s) => sum + s.weight, 0);
  const position = (elapsed / totalMs) * totalWeight;
  let acc = 0;
  let stageIndex = stages.length - 1;
  for (let i = 0; i < stages.length; i++) {
    acc += stages[i].weight;
    if (position < acc) {
      stageIndex = i;
      break;
    }
  }
  const percent = Math.min(99, Math.floor((elapsed / totalMs) * 100));
  return { stageIndex, percent, done: false };
}
