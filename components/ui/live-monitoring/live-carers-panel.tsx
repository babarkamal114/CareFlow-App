import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Users } from "lucide-react";
import type { LiveCarersPanelProps } from "types";

export function LiveCarersPanel({ onDutyCount, children }: LiveCarersPanelProps) {
  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">Carers On Shift</CardTitle>
        </div>
        <Badge variant="pastel-zinc" shape="pill">
          {onDutyCount} on duty
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-3">{children}</div>
      </CardContent>
    </Card>
  );
}
