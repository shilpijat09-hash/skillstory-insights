import { uploadResume, deleteResumes } from "@/services/storage";
import type { Analysis, NewAnalysisInput } from "@/types/analysis";
import { generateMockReport } from "./mock-engine";
import type { AnalysisProvider } from "./provider";
import { analysesRepository, reportToJson } from "./repository";
import { removeAllAnalyses, removeAnalysis, requireUserId } from "./shared";
import { MOCK_PIPELINE_MS, computeProgress } from "./stages";

/**
 * Prototype provider: real upload to private storage + real database record,
 * but the report itself comes from the mock engine (clearly labelled in the UI).
 */
export const mockAnalysisProvider: AnalysisProvider = {
  engine: "mock",

  async submit(input: NewAnalysisInput) {
    const userId = await requireUserId();
    const resumePath = await uploadResume(userId, input.file);
    try {
      return await analysesRepository.insert({
        user_id: userId,
        job_title: input.jobTitle.trim(),
        company: input.company?.trim() || null,
        job_description: input.jobDescription.trim(),
        file_name: input.file.name,
        file_size: input.file.size,
        file_type: input.file.type || "application/octet-stream",
        resume_path: resumePath,
        status: "processing",
        engine: "mock",
      });
    } catch (err) {
      await deleteResumes([resumePath]).catch(() => undefined);
      throw err;
    }
  },

  async getAnalysis(id: string) {
    const analysis = await analysesRepository.get(id);
    if (!analysis) return null;
    if (analysis.status !== "queued" && analysis.status !== "processing") return analysis;

    const elapsed = Date.now() - new Date(analysis.createdAt).getTime();
    if (elapsed < MOCK_PIPELINE_MS) return analysis;

    const report = generateMockReport({
      jobTitle: analysis.jobTitle,
      jobDescription: analysis.jobDescription,
      fileName: analysis.fileName,
    });
    const completed = await analysesRepository.updateIfStatus(id, ["queued", "processing"], {
      status: "completed",
      score: report.overallScore,
      report: reportToJson(report),
      completed_at: new Date().toISOString(),
    });
    return completed ?? (await analysesRepository.get(id));
  },

  getProgress(analysis: Analysis) {
    if (analysis.status === "completed") return computeProgress(MOCK_PIPELINE_MS);
    return computeProgress(Date.now() - new Date(analysis.createdAt).getTime());
  },

  list: () => analysesRepository.list(),
  remove: removeAnalysis,
  removeAll: removeAllAnalyses,
};
