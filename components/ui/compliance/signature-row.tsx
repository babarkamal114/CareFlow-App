import { Badge, Button } from "@/components/ui";
import type { SignatureItem } from "types";
import { formatDueLabel, formatStamp, SIGNATURE_STATUS_CONFIG, SIGNATURE_TYPE_STYLE, TONE_TEXT } from "utils";

interface SignatureRowProps {
  item: SignatureItem;
  asOf: Date;
  onSign: (id: string) => void;
}

export function SignatureRow({ item, asOf, onSign }: SignatureRowProps) {
  const cfg = SIGNATURE_STATUS_CONFIG[item.status];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-cf-border bg-cf-surface p-3 transition-colors hover:bg-cf-surface-muted">
      <Icon className={`h-4 w-4 flex-shrink-0 ${TONE_TEXT[cfg.tone]}`} />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-cf-ink">{item.document}</p>
          <span className={`flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${SIGNATURE_TYPE_STYLE[item.type]}`}>{item.type}</span>
        </div>
        <p className="text-xs text-cf-ink-60">{item.patient}</p>
        <p className="mt-0.5 text-xs text-cf-ink-40">
          {item.status === "signed" && item.signedAt
            ? `Signed by ${item.signedBy ?? item.assignedTo} · ${formatStamp(item.signedAt, asOf)}`
            : `Assigned to ${item.assignedTo} · Due ${formatDueLabel(item.dueDate, asOf)}`}
        </p>
      </div>
      {item.status === "signed" ? (
        <Badge variant={cfg.badge} badgeSize="sm" shape="pill">Signed</Badge>
      ) : (
        <Button size="sm" variant={item.status === "overdue" ? "destructive" : "brandOutline"} className="flex-shrink-0 text-xs" onClick={() => onSign(item.id)}>
          Sign now
        </Button>
      )}
    </div>
  );
}
