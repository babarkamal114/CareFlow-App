import { Skeleton } from "@/components/ui";

export function SidebarAgencySectionSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 group-data-[collapsible=icon]:justify-center">
      <Skeleton className="h-[34px] w-[34px] shrink-0 rounded-lg bg-sidebar-accent" />
      <div className="min-w-0 flex-1 space-y-2 group-data-[collapsible=icon]:hidden">
        <Skeleton className="h-3.5 w-3/4 bg-sidebar-accent" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0 rounded-sm bg-sidebar-accent group-data-[collapsible=icon]:hidden" />
    </div>
  );
}
