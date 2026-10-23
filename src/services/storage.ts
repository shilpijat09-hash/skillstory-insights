import { supabase } from "@/integrations/supabase/client";
import { RESUME_BUCKET } from "@/config/app";
import { getExtension } from "@/lib/file-validation";

/** Uploads a resume into the private bucket under `<userId>/`. Returns the object path. */
export async function uploadResume(userId: string, file: File): Promise<string> {
  const path = `${userId}/${crypto.randomUUID()}${getExtension(file.name)}`;
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

export async function deleteResumes(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(RESUME_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

/** Short-lived signed URL so the owner can download their original file. */
export async function getResumeDownloadUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Could not create download link.");
  return data.signedUrl;
}
