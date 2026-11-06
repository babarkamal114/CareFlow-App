"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "lib";
import type { ScheduleSelectOption } from "types";

interface ScheduleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ScheduleSelectOption[];
  placeholder?: string;
  size?: "sm" | "default";
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export function ScheduleSelect({
  value,
  onValueChange,
  options,
  placeholder,
  size = "default",
  disabled,
  invalid,
  id,
  className,
  "aria-label": ariaLabel,
}: ScheduleSelectProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <Select
      value={value === "" ? null : value}
      onValueChange={(next) => onValueChange(next ?? "")}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn("w-full", className)}
      >
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}