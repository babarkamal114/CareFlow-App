"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { getAvailableSuggestions, includesIgnoreCase } from "utils";

export function useTagInput(
  values: string[],
  suggestions: readonly string[],
  onChange: (values: string[]) => void
) {
  const [draft, setDraft] = useState("");

  const addValue = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (!includesIgnoreCase(values, value)) onChange([...values, value]);
    setDraft("");
  };

  const removeValue = (value: string) => onChange(values.filter((item) => item !== value));

  const handleBlur = () => addValue(draft);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addValue(draft);
    }
    if (event.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const availableSuggestions = getAvailableSuggestions(suggestions, values);

  return { draft, setDraft, addValue, removeValue, handleBlur, handleKeyDown, availableSuggestions };
}
