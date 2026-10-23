import { supabase } from "@/integrations/supabase/client";
import { deleteResumes } from "@/services/storage";
import type { Analysis } from "@/types/analysis";
import { analysesRepository } from "./repository";

export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Your session has expired. Please sign in again.");
  return data.user.id;
}

export async function removeAnalysis(analysis: Analysis): Promise<void> {
  await analysesRepository.remove(analysis.id);
  if (analysis.resumePath) {
    // The record is already gone; a leftover file is not worth failing the action for.
    await deleteResumes([analysis.resumePath]).catch(() => undefined);
  }
}

export async function removeAllAnalyses(): Promise<number> {
  const all = await analysesRepository.list();
  for (const a of all) await analysesRepository.remove(a.id);
  await deleteResumes(all.map((a) => a.resumePath).filter((p): p is string => !!p)).catch(() => undefined);
  return all.length;
}
