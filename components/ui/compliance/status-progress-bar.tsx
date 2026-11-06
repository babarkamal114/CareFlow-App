import { TONE_BAR, type Tone } from "utils";

interface StatusProgressBarProps {
  value: number;
  tone: Tone;
  className?: string;
}

/** Token-coloured progress bar (replaces inline hex / bg-green-500 bars). */
export function StatusProgressBar({ value, tone, className = "h-1.5" }: StatusProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-cf-border ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-300 ${TONE_BAR[tone]}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
