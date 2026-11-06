import type { ElementType } from "react";
import { Badge } from "@/components/ui";
import { AlertCircle, Calendar, Clock, FileText, Shield, User, Wifi } from "lucide-react";
import type { LiveAttentionRowProps } from "types";

const attentionIcons: Record<string, ElementType> = {
  Clock,
  User,
  Shield,
  FileText,
  Calendar,
  Wifi,
};

export function LiveAttentionRow({ item, config }: LiveAttentionRowProps) {
  const Icon = attentionIcons[config.icon] ?? AlertCircle;

  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-cf-surface-muted/50 transition-colors">
      <div className="flex-shrink-0 text-cf-ink-60 mt-0.5">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-cf-ink">{item.title}</p>
          {config.priority === "high" && (
            <Badge variant={config.badgeVariant} badgeSize="sm">
              Urgent
            </Badge>
          )}
        </div>
        <p className="text-xs text-cf-ink-60">{item.description}</p>
        <p className="text-[10px] text-cf-ink-40 mt-0.5">{item.detail}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-cf-ink-40">{item.time}</p>
      </div>
    </div>
  );
}
