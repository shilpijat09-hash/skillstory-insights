export const APP_NAME = "ResumeIQ";

export const UPLOAD_LIMITS = {
  maxBytes: 10 * 1024 * 1024,
  acceptedMimeTypes: {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  } as Record<string, string>,
  acceptedExtensions: [".pdf", ".docx"],
} as const;

export const JOB_DESCRIPTION_MIN_CHARS = 80;
export const JOB_DESCRIPTION_MAX_CHARS = 8000;

/** Supabase Storage bucket for uploaded resumes (private, one folder per user). */
export const RESUME_BUCKET = "resumes";

/**
 * Base URL of the future FastAPI + CrewAI backend. Public, non-secret value.
 * When unset, the app runs the clearly-labelled mock engine instead.
 */
export const ANALYSIS_API_URL: string | undefined =
  (import.meta.env.VITE_RESUMEIQ_API_URL as string | undefined) || undefined;
