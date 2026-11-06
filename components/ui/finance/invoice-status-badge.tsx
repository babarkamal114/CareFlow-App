import { Badge } from "@/components/ui";
import type { InvoiceStatus } from "types";
import { INVOICE_STATUS_LABEL, INVOICE_STATUS_VARIANT } from "utils";

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant={INVOICE_STATUS_VARIANT[status]} shape="pill" badgeSize="md" dot>
      {INVOICE_STATUS_LABEL[status]}
    </Badge>
  );
}