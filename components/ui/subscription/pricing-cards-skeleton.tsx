import { Skeleton } from "@/components/ui";

export function PricingCardsSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64 rounded-full bg-cf-surface-muted" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-2xl border border-cf-border-light bg-cf-surface p-6"
          >
            {index === 1 && (
              <Skeleton className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-cf-surface-muted" />
            )}

            <Skeleton className="h-5 w-28 rounded bg-cf-surface-muted" />
            <Skeleton className="mt-2 h-3 w-36 rounded bg-cf-surface-muted" />

            <div className="mt-5 flex h-10 items-baseline gap-1">
              <Skeleton className="h-8 w-20 rounded bg-cf-surface-muted" />
            </div>

            <div className="mt-4 space-y-2 border-t border-cf-border-light pt-4">
              <Skeleton className="h-3 w-32 rounded bg-cf-surface-muted" />
              <Skeleton className="h-3 w-36 rounded bg-cf-surface-muted" />
              <Skeleton className="h-3 w-28 rounded bg-cf-surface-muted" />
              <Skeleton className="h-3 w-32 rounded bg-cf-surface-muted" />
            </div>

            <ul className="mt-5 flex-1 space-y-2.5">
              {Array.from({ length: 4 }).map((_, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded bg-cf-surface-muted" />
                  <Skeleton className="h-3 w-40 rounded bg-cf-surface-muted" />
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Skeleton className="h-10 w-full rounded-md bg-cf-surface-muted" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="mx-auto mt-8 h-14 w-full max-w-3xl rounded-xl bg-cf-surface-muted" />
    </div>
  );
}