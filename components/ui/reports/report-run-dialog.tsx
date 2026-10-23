"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Skeleton } from "@/components/ui";
import { CalendarClock } from "lucide-react";
import type { LibraryReport, ReportDataset, ReportExportFormat } from "types";
import { ReportDatasetView } from "./report-dataset-view";
import { ReportExportMenu } from "./report-export-menu";

interface ReportRunDialogProps {
  report: LibraryReport | null; datasets: ReportDataset[]; isLoading: boolean;
  onClose: () => void; onExport: (f: ReportExportFormat) => void; onSchedule: (reportId: string) => void;
}

export function ReportRunDialog({ report, datasets, isLoading, onClose, onExport, onSchedule }: ReportRunDialogProps) {
  return (
    <Dialog open={report !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        {report && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
                <div>
                  <DialogTitle className="font-heading text-xl text-cf-ink">{report.title}</DialogTitle>
                  <DialogDescription>{report.description}</DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onSchedule(report.id)}><CalendarClock />Schedule</Button>
                  <ReportExportMenu onSelect={onExport} disabled={isLoading} />
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {isLoading && <Skeleton className="h-72 w-full rounded-xl" />}
              {datasets.map((ds) => (
                <section key={ds.id} className="space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-cf-ink">{ds.title}</h3>
                    <p className="text-xs text-cf-ink-60">{ds.description}</p>
                  </div>
                  <ReportDatasetView columns={ds.columns} rows={ds.rows} chart={ds.chart} mode="both" />
                </section>
              ))}
              {!isLoading && datasets.length === 0 && <p className="py-10 text-center text-sm text-cf-ink-40">Your role cannot see any section of this report.</p>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
