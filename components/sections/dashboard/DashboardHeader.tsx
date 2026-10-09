export function DashboardHeader() {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-cf-border-light pb-4">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-cf-ink md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-cf-ink-60">Overview of today&apos;s care operations</p>
      </div>
    </header>
  );
}