import type { ComplianceStatus } from "lib";
import { Badge, type BadgeProps } from "@/components/ui";

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; variant: string; dot: string }> = {
  clear: { 
    label: "All clear", 
    variant: "softSuccess",
    dot: "bg-[var(--cf-success)]" 
  },
  expiring: { 
    label: "Expiring soon", 
    variant: "softWarning",
    dot: "bg-[var(--cf-warning)]" 
  },
  expired: { 
    label: "Expired", 
    variant: "softDanger",
    dot: "bg-[var(--cf-error)]" 
  },
};

export function ComplianceIndicator({
  status,
  showLabel = true,
}: {
  status: ComplianceStatus;
  showLabel?: boolean;
}) {
  const cfg = STATUS_CONFIG[status];
  
  return (
    <Badge 
      variant={cfg.variant as BadgeProps['variant']}
      shape={'pill'}
      badgeSize={'md'}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {showLabel ? cfg.label : null}
    </Badge>
  );
}