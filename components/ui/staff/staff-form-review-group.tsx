'use client';

import { Button } from '@/components/ui';

export function StaffFormReviewGroup({
  title,
  stepNumber,
  onEdit,
  children,
}: {
  title: string;
  stepNumber?: number;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        {onEdit && stepNumber !== undefined ? (
          <Button
            variant="link"
            size="xs"
            onClick={onEdit}
            className="text-xs font-semibold"
          >
            Edit step {stepNumber}
          </Button>
        ) : null}
      </div>
      <div className="divide-y divide-border rounded-lg border border-border px-4">
        {children}
      </div>
    </div>
  );
}