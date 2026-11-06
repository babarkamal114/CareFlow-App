"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface MedSelectProps<T extends string> {
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MedSelect<T extends string>({ value, options, onChange, placeholder = "Select…", id, invalid, disabled, className = "w-full" }: MedSelectProps<T>) {
  const selected = options.find((o) => o.value === value);
  return (
    <Select value={value === "" ? null : value} disabled={disabled} onValueChange={(next) => next && onChange(next as T)}>
      <SelectTrigger id={id} aria-invalid={invalid} className={`border-cf-border bg-cf-surface text-cf-ink ${className}`}>
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="border-cf-border bg-cf-surface">
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
