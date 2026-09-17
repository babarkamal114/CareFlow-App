'use client';

import { Button } from "@/components/ui";
import { Plus } from 'lucide-react';

interface PatientsPageHeaderProps {
  onCreateClick: () => void;
}

export function PatientsPageHeader({ onCreateClick }: PatientsPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
          Patients
        </h1>
        <p className="text-sm text-cf-ink-60">
          Manage and monitor your patients' care and health records
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        <span className="text-sm">New Patient</span>
      </Button>
    </div>
  );
}