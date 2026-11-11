import Link from "next/link";
import { Eye } from "lucide-react";
import { Button, Card, Badge} from "@/components/ui";
import { LiveMapPanel } from "ui/dashboard/live-map-panel";
import type { DashboardMapMarker } from "utils";

interface DashboardLiveMapSectionProps {
  markers: DashboardMapMarker[];
  activeCount: number;
}

export function DashboardLiveMapSection({ markers, activeCount }: DashboardLiveMapSectionProps) {
  return (
    <Card variant="elevated" className="h-full w-full gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-cf-ink">Live Map</h2>
        <div className="flex items-center gap-2">
          <Badge variant="softInfo" shape="pill">
            {activeCount} active
          </Badge>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/live-monitoring" />}>
            <Eye />
            View live monitoring
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <LiveMapPanel markers={markers} />
      </div>
    </Card>
  );
}