import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle } from "lucide-react";
import type { LiveAttentionPanelProps } from "types";

export function LiveAttentionPanel({ urgentCount, children }: LiveAttentionPanelProps) {
  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">Needs Attention</CardTitle>
        </div>
        <Badge variant="pastel-danger" shape="pill">
          {urgentCount} Urgent
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-cf-border">{children}</div>
      </CardContent>
    </Card>
  );
}
