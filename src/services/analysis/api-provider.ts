/**
 * FastAPI + CrewAI provider (activated when VITE_RESUMEIQ_API_URL is set).
 *
 * Flow (see docs/backend-contract.md):
 *  1. Browser uploads the resume to private storage and creates an `analyses`
 *     row with status "queued" and engine "crewai".
 *  2. Browser calls POST {API}/v1/analyses with the user's access token.
 *  3. The backend verifies the token, downloads the file, runs the crew and
 *     writes status / score / report back to the row with its own server key.
 *  4. The browser polls the row until it is "completed" or "failed".
 *
 * No secrets live in the browser: only the public API URL and the user's own
 * short-lived session token are used.
 */
import { supabase } from "@/integrations/supabase/client";
import { ANALYSIS_API_URL } from "@/config/app";
import { uploadResume } from "@/services/storage";
import type { Analysis, NewAnalysisInput } from "@/types/analysis";
import type { AnalysisProvider } from "./provider";
import { analysesRepository } from "./repository";
import { removeAllAnalyses, removeAnalysis, requireUserId } from "./shared";
import { PROCESSING_STAGES, computeProgress } from "./stages";

const EXPECTED_DURATION_MS = 90_000;

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export const apiAnalysisProvider: AnalysisProvider = {
  engine: "crewai",

  async submit(input: NewAnalysisInput) {
    if (!ANALYSIS_API_URL) throw new Error("The analysis service is not configured.");
    const userId = await requireUserId();
    const resumePath = await uploadResume(userId, input.file);
    const analysis = await analysesRepository.insert({
      user_id: userId,
      job_title: input.jobTitle.trim(),
      company: input.company?.trim() || null,
      job_description: input.jobDescription.trim(),
      file_name: input.file.name,
      file_size: input.file.size,
      file_type: input.file.type || "application/octet-stream",
      resume_path: resumePath,
      status: "queued",
      engine: "crewai",
    });

    try {
      const res = await fetch(`${ANALYSIS_API_URL.replace(/\/$/, "")}/v1/analyses`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ analysis_id: analysis.id }),
      });
      if (!res.ok) throw new Error(`Analysis service responded with ${res.status}`);
    } catch {
      await analysesRepository.update(analysis.id, {
        status: "failed",
        error_message: "We couldn't reach the analysis service. Please try again later.",
      });
      return { ...analysis, status: "failed" };
    }
    return analysis;
  },

  getAnalysis: (id: string) => analysesRepository.get(id),

  getProgress(analysis: Analysis) {
    if (analysis.status === "completed") {
      return { stageIndex: PROCESSING_STAGES.length - 1, percent: 100, done: true };
    }
    // Estimated until the backend exposes per-stage progress; never reports done early.
    const p = computeProgress(Date.now() - new Date(analysis.createdAt).getTime(), EXPECTED_DURATION_MS);
    return { stageIndex: Math.min(p.stageIndex, PROCESSING_STAGES.length - 1), percent: Math.min(p.percent, 95), done: false };
  },

  list: () => analysesRepository.list(),
  remove: removeAnalysis,
  removeAll: removeAllAnalyses,
};
