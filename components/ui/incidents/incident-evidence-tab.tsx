'use client';

import { Card, Button, ScrollArea } from '@/components/ui';
import { Paperclip, Download } from 'lucide-react';
import { formatFileSize } from 'utils';
import {
  MOCK_EVIDENCE,
  getEvidenceIcon,
  formatEvidenceDate,
} from 'utils';

export function IncidentEvidenceTab() {
  const evidence = MOCK_EVIDENCE;

  return (
    <ScrollArea className="pr-4">
      <div className="space-y-4">
        {evidence.length === 0 ? (
          <Card className="border-cf-border p-8 text-center">
            <Paperclip className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
            <p className="text-cf-ink-60">No evidence uploaded yet</p>
            <p className="text-xs text-cf-ink-40 mt-1">
              Upload photos, documents, audio, or video evidence
            </p>
          </Card>
        ) : (
          evidence.map((item) => {
            const Icon = getEvidenceIcon(item.type);

            return (
              <Card key={item.id} className="border-cf-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cf-surface-muted flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cf-ink">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-cf-ink-60">
                          {formatFileSize(item.size)}
                        </p>
                        <p className="text-xs text-cf-ink-60">
                          Uploaded by {item.uploadedBy}
                        </p>
                        <p className="text-xs text-cf-ink-60">
                          {formatEvidenceDate(item.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}