import { useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UPLOAD_LIMITS } from "@/config/app";
import { formatBytes, validateResumeFile } from "@/lib/file-validation";
import { cn } from "@/lib/utils";

export function FileDropzone({
  file,
  onFileChange,
  error,
  onError,
  disabled,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string | null;
  onError: (message: string | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const descId = useId();
  const errId = useId();

  const accept = (f: File | undefined) => {
    if (!f) return;
    const result = validateResumeFile(f);
    if (!result.ok) {
      onError(result.error);
      return;
    }
    onError(null);
    onFileChange(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files.length > 1) {
      onError("Please upload one resume at a time.");
      return;
    }
    accept(e.dataTransfer.files[0]);
  };

  const openPicker = () => !disabled && inputRef.current?.click();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const acceptAttr = [...UPLOAD_LIMITS.acceptedExtensions, ...Object.keys(UPLOAD_LIMITS.acceptedMimeTypes)].join(",");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)} · {file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"} · Selected
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={openPicker} disabled={disabled}>
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onFileChange(null)}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
          >
            <X />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-describedby={`${descId}${error ? ` ${errId}` : ""}`}
          aria-invalid={!!error}
          aria-disabled={disabled}
          onClick={openPicker}
          onKeyDown={onKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            dragging ? "border-primary bg-accent/70" : "border-input bg-muted/30 hover:border-primary/50 hover:bg-accent/30",
            error && "border-destructive/50 bg-destructive-soft/50",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div
            className={cn(
              "mb-4 flex size-12 items-center justify-center rounded-xl bg-background text-primary shadow-card transition-transform",
              dragging && "scale-110",
            )}
          >
            <UploadCloud className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">
            {dragging ? "Drop your resume here" : (
              <>
                <span className="text-primary">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p id={descId} className="mt-1 text-xs text-muted-foreground">
            PDF or DOCX, up to {formatBytes(UPLOAD_LIMITS.maxBytes)}
          </p>
        </div>
      )}
      {error && (
        <p id={errId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
