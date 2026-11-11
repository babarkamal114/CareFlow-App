import { Skeleton } from "@/components/ui";

export function StatCardSkeleton() {
  return (
    <div className="h-full w-full rounded-xl cf-glass-panel" aria-hidden="true">
      <div className="flex flex-col gap-4 px-4 py-4">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}