import { Badge, Card, LiveMapPanel } from "@/components/ui";
import type { DashboardMapMarker } from "utils";

interface DashboardLiveMapSectionProps {
  markers: DashboardMapMarker[];
  /** Visits happening right now */
  activeCount: number;
}

/** Map of today's visits, coloured by status. */
export function DashboardLiveMapSection({ markers, activeCount }: DashboardLiveMapSectionProps) {
  return (
    <Card variant="elevated" className="h-full w-full gap-0 py-0">
      <div className="flex items-center justify-between border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-cf-ink">Live Map</h2>
        <Badge variant="softInfo" shape="pill">
          {activeCount} active
        </Badge>
      </div>
      <div className="flex-1 p-4">
        <LiveMapPanel markers={markers} />
      </div>
    </Card>
  );
}