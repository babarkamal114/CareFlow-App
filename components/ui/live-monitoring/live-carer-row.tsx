import { Avatar, AvatarFallback, AvatarStatus, AvatarWrap } from "@/components/ui";
import type { LiveCarerRowProps } from "types";

export function LiveCarerRow({ carer, statusLabel, tone }: LiveCarerRowProps) {
  return (
    <div className="flex items-center gap-3">
      <AvatarWrap>
        <Avatar size="sm">
          <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-[11px] font-medium">
            {carer.initials}
          </AvatarFallback>
        </Avatar>
        <AvatarStatus tone={tone} />
      </AvatarWrap>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-cf-ink">{carer.name}</p>
        <p className="truncate text-xs text-cf-ink-60">{carer.detail}</p>
      </div>

      <span className="shrink-0 text-[11px] font-medium text-cf-ink-40">{statusLabel}</span>
    </div>
  );
}
