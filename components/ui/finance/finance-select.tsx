"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface FinanceSelectProps<T extends string> {
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function FinanceSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select…",
  id,
  invalid,
  size = "default",
  className = "w-full",
}: FinanceSelectProps<T>) {
  const selected = options.find((o) => o.value === value);

  return (
    <Select
      value={value === "" ? null : value}
      onValueChange={(next) => {
        if (next) onChange(next as T);
      }}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={invalid}
        className={`border-cf-border bg-cf-surface text-cf-ink ${className}`}
      >
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="border-cf-border bg-cf-surface">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}