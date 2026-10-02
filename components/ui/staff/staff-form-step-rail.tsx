"use client";

import { cn } from "lib";
import type { StaffFormStep } from "types";
import { Button } from "../button";

export function StaffFormStepRail({
  steps,
  current,
  onSelect,
}: {
  steps: StaffFormStep[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Add staff progress" className="space-y-1">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;

        return (
          <Button
            key={step.id}
            type="button"
            variant="ghost"
            onClick={() => onSelect(stepNumber)}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              isActive
                ? "bg-cf-surface-inset"
                : "hover:bg-cf-surface-inset/60"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isDone
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-cf-ink-40"
              )}
            >
              {stepNumber}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate text-sm font-semibold",
                  isActive ? "text-cf-ink" : "text-cf-ink-70"
                )}
              >
                {step.title}
              </span>
              <span className="block truncate text-xs text-cf-ink-50">
                {step.description}
              </span>
            </span>
          </Button>
        );
      })}
    </nav>
  );
}
