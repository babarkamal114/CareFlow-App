import { Skeleton } from "@/components/ui";

/** Placeholder for a drawer tab body while its data loads. */
export function PatientDrawerSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-lg border border-cf-border p-4"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}