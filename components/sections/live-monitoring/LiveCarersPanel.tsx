import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarStatus,
  AvatarWrap,
} from "@/components/ui";
import { Users } from "lucide-react";
import { mockLiveCarersOnShift, carerLiveStatusLabelMap, carerLiveStatusToneMap } from "utils";

function LiveCarersPanel() {
  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">Carers On Shift</CardTitle>
        </div>
        <Badge variant="pastel-zinc" shape="pill">
          {mockLiveCarersOnShift.length} on duty
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-3">
          {mockLiveCarersOnShift.map((carer) => (
            <div key={carer.id} className="flex items-center gap-3">
              <AvatarWrap>
                <Avatar size="sm">
                  <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-[11px] font-medium">
                    {carer.initials}
                  </AvatarFallback>
                </Avatar>
                <AvatarStatus tone={carerLiveStatusToneMap[carer.status]} />
              </AvatarWrap>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cf-ink">{carer.name}</p>
                <p className="truncate text-xs text-cf-ink-60">{carer.detail}</p>
              </div>

              <span className="shrink-0 text-[11px] font-medium text-cf-ink-40">
                {carerLiveStatusLabelMap[carer.status]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default LiveCarersPanel;