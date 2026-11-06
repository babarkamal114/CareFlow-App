"use client";

import { cn } from "lib";

export function StaffFormStepDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, index) => index + 1).map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            n === current
              ? "w-5 bg-primary"
              : n < current
                ? "w-3 bg-primary/35"
                : "w-3 bg-border"
          )}
        />
      ))}
    </div>
  );
}
