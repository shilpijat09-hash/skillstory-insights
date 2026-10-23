import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import type { Analysis, AnalysisReport } from "@/types/analysis";

type Row = Database["public"]["Tables"]["analyses"]["Row"];
type Insert = Database["public"]["Tables"]["analyses"]["Insert"];
type Update = Database["public"]["Tables"]["analyses"]["Update"];

export function rowToAnalysis(row: Row): Analysis {
  return {
    id: row.id,
    jobTitle: row.job_title,
    company: row.company,
    jobDescription: row.job_description,
    fileName: row.file_name,
    fileSize: row.file_size,
    fileType: row.file_type,
    resumePath: row.resume_path,
    status: row.status as Analysis["status"],
    engine: row.engine as Analysis["engine"],
    score: row.score,
    report: (row.report as unknown as AnalysisReport | null) ?? null,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    isSample: false,
  };
}

export const reportToJson = (report: AnalysisReport) => report as unknown as Json;

/** Thin data-access layer over the `analyses` table (RLS scopes rows to the signed-in user). */
export const analysesRepository = {
  async list(): Promise<Analysis[]> {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToAnalysis);
  },

  async get(id: string): Promise<Analysis | null> {
    const { data, error } = await supabase.from("analyses").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToAnalysis(data) : null;
  },

  async insert(values: Insert): Promise<Analysis> {
    const { data, error } = await supabase.from("analyses").insert(values).select("*").single();
    if (error) throw new Error(error.message);
    return rowToAnalysis(data);
  },

  /** Updates only while the row is still in one of `fromStatuses` (prevents double completion). */
  async updateIfStatus(id: string, fromStatuses: Analysis["status"][], values: Update): Promise<Analysis | null> {
    const { data, error } = await supabase
      .from("analyses")
      .update(values)
      .eq("id", id)
      .in("status", fromStatuses)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToAnalysis(data) : null;
  },

  async update(id: string, values: Update): Promise<void> {
    const { error } = await supabase.from("analyses").update(values).eq("id", id);
    if (error) throw new Error(error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("analyses").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
