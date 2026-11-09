'use client';

import { Button } from "@/components/ui";
import { Plus, FileText } from 'lucide-react';

interface CarePlanHeaderProps {
  onCreateNew: () => void;
  onExport?: () => void;
}

export function CarePlanHeader({ onCreateNew, onExport }: CarePlanHeaderProps) {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-cf-border-light sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className='flex flex-col gap-y-1'>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
          Care Plans
        </h1>
        <p className="text-sm text-cf-ink-60">
          Create and manage patient care plans
        </p>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
        {onExport && (
          <Button variant="outline" onClick={onExport} className="flex-1 gap-1.5 sm:flex-none">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        )}
        <Button onClick={onCreateNew} className="flex-1 gap-1.5 sm:flex-none">
          <Plus className="h-4 w-4" />
          New Care Plan
        </Button>
      </div>
    </div>
  );
}