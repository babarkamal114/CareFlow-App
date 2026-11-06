'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, InspectionPackDialog, PackPreviewDialog } from '@/components/ui';
import { useInspectionPack } from 'hooks';
import { Clock, Download, Eye, Shield } from 'lucide-react';
import { formatLongDate } from 'utils';

export function CQCInspectionPack() {
  const p = useInspectionPack();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-50 p-2"><Shield className="h-5 w-5 text-brand-600" /></div>
              <div>
                <CardTitle className="text-base font-semibold text-cf-ink">CQC Inspection Pack</CardTitle>
                <p className="text-xs text-cf-ink-60">One-click evidence bundle</p>
              </div>
            </div>
            <Badge variant="pastel-success" shape="pill" badgeSize="sm">Ready</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-cf-ink-60">
            Auto-compiles staff files, patient records, compliance scores, incident reports, and policy docs into a single evidence pack.
          </p>
          <div className="flex items-center gap-2">
            <Button className="flex-1 gap-2" onClick={p.openDialog}><Download />Generate Pack</Button>
            <Button variant="outline" className="gap-2" onClick={() => p.setPreviewOpen(true)}><Eye />Preview</Button>
          </div>
          <div className="flex items-center gap-1 text-xs text-cf-ink-40">
            <Clock className="h-3 w-3" />
            <span>Last generated: {formatLongDate(p.record.generatedAt)} · {p.record.pageCount} pages</span>
          </div>
        </CardContent>
      </Card>

      <InspectionPackDialog
        open={p.dialogOpen} onOpenChange={p.closeDialog} sections={p.sections}
        stage={p.stage} progress={p.progress} stepLabel={p.stepLabel}
        onGenerate={p.generate} onDownloadAgain={p.downloadAgain}
      />
      <PackPreviewDialog open={p.previewOpen} onOpenChange={p.setPreviewOpen} record={p.record} sections={p.sections} onDownload={p.downloadAgain} />
    </>
  );
}
