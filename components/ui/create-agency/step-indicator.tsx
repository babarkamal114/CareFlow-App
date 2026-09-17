import { CheckIcon } from "lucide-react";

interface StepIndicatorProps {
  stepNumber: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  compact?: boolean;
}

export function StepIndicator({
  stepNumber,
  label,
  isActive,
  isCompleted,
  isCurrent,
  compact = false,
}: StepIndicatorProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <div
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
            isCompleted
              ? " text-white"
              : isActive
                ? "bg-emerald-700 text-white "
                : "bg-emerald-600 text-white border border-emerald-500"
          }`}
        >
          {isCompleted ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      {/* Circle Indicator */}
      <div className="flex flex-shrink-0 flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
            isCompleted
              ? "bg-cf-brand-500 text-white"
              : isActive
                ? "bg-emerald-700 text-white "
                : "bg-emerald-600 text-white border border-emerald-500"
          }`}
        >
          {isCompleted ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col pt-1">
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isCompleted || isActive ? "text-white" : "text-white/30"
          }`}
        >
          {label}
        </span>
        {isActive && (
          <span className="mt-1 text-xs text-white/60">
            Current step
          </span>
        )}
      </div>
    </div>
  );
}