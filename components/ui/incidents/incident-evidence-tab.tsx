'use client';

import { Badge, Button, Card, ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { CircleHelp, Download, Paperclip } from 'lucide-react';
import { Incident } from 'types';
import { getEvidenceFileName, getIncidentEvidenceCount } from 'utils';

interface IncidentEvidenceTabProps {
  incident: Incident;
}

export function IncidentEvidenceTab({ incident }: IncidentEvidenceTabProps) {
  const evidence = incident.evidence ?? [];

  return (
    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">
              Evidence ({getIncidentEvidenceCount(incident)})
            </p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Files attached at the point of reporting, plus anything added
                during the investigation - photos of the scene or injuries,
                body maps, GP letters and witness statements.
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>

        {evidence.length === 0 ? (
          <Card className="border-cf-border p-8 text-center">
            <Paperclip className="mx-auto mb-3 size-10 text-cf-ink-40" />
            <p className="text-cf-ink-60">No evidence uploaded yet</p>
            <p className="mt-1 text-xs text-cf-ink-40">
              Use Actions &gt; Add Evidence to attach photos, documents, audio
              or video
            </p>
          </Card>
        ) : (
          evidence.map((url) => (
            <Card key={url} className="border-cf-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-cf-surface-muted">
                    <Paperclip className="size-4 text-cf-ink-60" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cf-ink">
                      {getEvidenceFileName(url)}
                    </p>
                    <p className="truncate text-xs text-cf-ink-60">{url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="softInfo" shape="pill" badgeSize="sm">
                    Evidence
                  </Badge>
                  <Button variant="ghost" size="sm" className="size-8 p-0" aria-label={`Download ${getEvidenceFileName(url)}`}>
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
}