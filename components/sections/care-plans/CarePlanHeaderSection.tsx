'use client';

import { Button } from "@/components/ui";
import { Plus, FileText } from 'lucide-react';

interface CarePlanHeaderProps {
  onCreateNew: () => void;
  onExport?: () => void;
}

export function CarePlanHeader({ onCreateNew, onExport }: CarePlanHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className='flex flex-col gap-y-1'>
        <h1 className="text-4xl font-bold text-cf-ink">Care Plans</h1>
        <p className="text-xs text-cf-ink-60  ">
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