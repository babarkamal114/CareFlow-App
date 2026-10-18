interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-cf-ink">
          Step {current} of {total}
        </span>
        <span className="text-xs font-medium text-cf-ink-60">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cf-surface-muted">
        <div
          className="h-full bg-cf-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}