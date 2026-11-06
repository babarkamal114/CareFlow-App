import { Avatar, AvatarFallback, Badge, TableCell, TableRow } from "@/components/ui";
import { cn } from "lib";
import type { LiveActivityRowProps } from "types";

export function LiveActivityRow({ row }: LiveActivityRowProps) {
  const { visit, timingLabel, statusLabel, badgeVariant } = row;
  const isLive = visit.status === "in-progress";
  const isDelayed = visit.status === "delayed";

  return (
    <TableRow
      className={cn(
        "hover:bg-cf-surface-muted/50",
        isDelayed && "border-l-2 border-l-cf-red-500",
        isLive && "border-l-2 border-l-cf-amber-500",
      )}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
              {visit.patientInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-cf-ink">{visit.patientName}</p>
            <p className="text-xs text-cf-ink-60">{visit.careType}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-cf-ink-60">{visit.carerName}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-cf-ink-60">{visit.scheduledWindow}</span>
      </TableCell>
      <TableCell>
        <Badge shape="pill" dot={isLive} variant={badgeVariant}>
          {statusLabel}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            isDelayed ? "text-cf-red-500" : "text-cf-ink-60",
          )}
        >
          {timingLabel}
        </span>
      </TableCell>
    </TableRow>
  );
}
