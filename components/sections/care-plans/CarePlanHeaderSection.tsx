'use client';

import { Button } from "@/components/ui";
import { Plus, FileText } from 'lucide-react';

interface CarePlanHeaderProps {
  onCreateNew: () => void;
  onExport?: () => void;
}

export function CarePlanHeader({ onCreateNew, onExport }: CarePlanHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
      <div className='flex flex-col gap-y-1'>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
          Care Plans
        </h1>
        <p className="text-sm text-cf-ink-60">
          Create and manage patient care plans
        </p>
      </div>
      <div className="flex items-center gap-3">
        {onExport && (
          <Button variant="outline" onClick={onExport} className="gap-1.5">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        )}
        <Button onClick={onCreateNew} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Care Plan
        </Button>
      </div>
    </div>
  );
}