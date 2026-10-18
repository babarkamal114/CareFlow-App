"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "lib";
import { Button } from "../button";

export function StaffFormTagInput({
  id,
  values,
  suggestions = [],
  placeholder,
  error,
  onChange,
}: {
  id: string;
  values: string[];
  suggestions?: readonly string[];
  placeholder?: string;
  error?: string;
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addValue = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    const exists = values.some(
      (existing) => existing.toLowerCase() === value.toLowerCase()
    );
    if (!exists) onChange([...values, value]);
    setDraft("");
  };

  const availableSuggestions = suggestions.filter(
    (suggestion) =>
      !values.some(
        (existing) => existing.toLowerCase() === suggestion.toLowerCase()
      )
  );

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
              onClick={() =>
                onChange(values.filter((item) => item !== value))
              }
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
          onBlur={() => addValue(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addValue(draft);
            }
            if (event.key === "Backspace" && draft === "" && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
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
