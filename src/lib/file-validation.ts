import { UPLOAD_LIMITS } from "@/config/app";

export type FileValidationResult = { ok: true } | { ok: false; error: string };

export function getExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

/** Accept PDF and DOCX resumes up to 10 MB. */
export function validateResumeFile(file: Pick<File, "name" | "size" | "type">): FileValidationResult {
  const ext = getExtension(file.name);
  const extOk = (UPLOAD_LIMITS.acceptedExtensions as readonly string[]).includes(ext);
  // Some browsers report DOCX as an empty or generic type; the extension is then decisive.
  const genericType = !file.type || file.type === "application/octet-stream";
  const typeOk = genericType || file.type in UPLOAD_LIMITS.acceptedMimeTypes;

  if (!extOk || !typeOk) {
    return { ok: false, error: "Only PDF or DOCX files are supported." };
  }
  if (file.size === 0) {
    return { ok: false, error: "This file is empty. Please choose another one." };
  }
  if (file.size > UPLOAD_LIMITS.maxBytes) {
    return { ok: false, error: `File is too large. Maximum size is ${formatBytes(UPLOAD_LIMITS.maxBytes)}.` };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
}
