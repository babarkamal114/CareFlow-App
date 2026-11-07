"use client";

import { X } from "lucide-react";
import { cn } from "lib";
import { Button } from "../button";
import type { StaffFormTagInputProps } from "types";
import { useTagInput } from "hooks";

export function StaffFormTagInput({
  id,
  values,
  suggestions = [],
  placeholder,
  error,
  onChange,
}: StaffFormTagInputProps) {
  const { draft, setDraft, addValue, removeValue, handleBlur, handleKeyDown, availableSuggestions } =
    useTagInput(values, suggestions, onChange);

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-cf-surface-inset px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
          error && "border-destructive"
        )}
      >
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {value}
            <Button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => removeValue(value)}
              className="transition-colors hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={values.length === 0 ? placeholder : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-cf-ink outline-none placeholder:text-cf-ink-40"
        />
      </div>

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              onClick={() => addValue(suggestion)}
              className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              + {suggestion}
            </Button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
