"use client";

import { Button } from "@/components/ui";

interface TableBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
}

export function TableBulkActions({ selectedCount, onClear, onDelete }: TableBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="border-t border-cf-border-light bg-cf-surface-muted/50 px-4 py-3 flex items-center justify-between">
      <p className="text-sm font-medium text-cf-ink">
        {selectedCount} selected
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-cf-border hover:bg-cf-surface-muted"
          onClick={onClear}
        >
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-cf-border text-cf-error hover:bg-cf-error-muted"
          onClick={onDelete}
        >
          Delete Selected
        </Button>
      </div>
    </div>
  );
}