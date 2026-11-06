'use client';

import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { INCIDENTS_PAGE_TITLE, INCIDENTS_PAGE_SUBTITLE } from 'utils';

interface IncidentHeaderSectionProps {
  onReportIncident: () => void;
}

export function IncidentHeaderSection({ onReportIncident }: IncidentHeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-cf-ink">{INCIDENTS_PAGE_TITLE}</h1>
        <p className="text-sm text-cf-ink-60 mt-1">{INCIDENTS_PAGE_SUBTITLE}</p>
      </div>
      <Button size="lg" className="gap-2" onClick={onReportIncident}>
        <Plus className="h-4 w-4" />
        Report Incident
      </Button>
    </div>
  );
}