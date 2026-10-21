"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "lib";
import { Button } from "../button";

export function StaffFormFileUpload({
  id,
  fileName,
  url,
  label = "Choose file",
  hint,
  error,
  accept = ".pdf,.jpg,.jpeg,.png",
  onSelect,
  onClear,
}: {
  id: string;
  fileName?: string;
  url?: string;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  onSelect: (file: File) => void;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  if (url) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-cf-surface-inset px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm text-cf-ink">
            {fileName || "Uploaded file"}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View
          </a>
          {onClear && (
            <Button
              type="button"
              onClick={onClear}
              aria-label="Remove file"
              className="text-cf-ink-40 transition-colors hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-lg border border-dashed px-4 py-3 text-sm transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-cf-surface-inset",
          error && "border-destructive/40"
        )}
      >
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center gap-2 text-muted-foreground"
        >
          <span className="font-semibold text-primary">{label}</span>
          <span>or drag and drop</span>
          <input
            id={id}
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
