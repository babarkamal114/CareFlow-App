"use client";

import {
  AdministrationRateChart, AuditGapList, AuditReportList, Button, Card, CardContent, CardHeader, CardTitle, OmissionReasonsChart,
  RefusalPatternsTable, Skeleton,
} from "@/components/ui";
import { useMedicationAudit } from "hooks"
import { Download, FilePlus } from "lucide-react";

const CARD = "rounded-2xl border-cf-border-light shadow-cf-sm";

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-cf-border-light bg-cf-surface p-4">
      <p className="text-[11px] font-bold tracking-[0.06em] text-cf-ink-40 uppercase">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-cf-ink">{value}</p>
      <p className="text-xs text-cf-ink-60">{note}</p>
    </div>
  );
}

export function MedicationAuditSection() {
  const a = useMedicationAudit();
  if (a.isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;
  const s = a.summary;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-cf-ink-60">Last 30 days · a report is also generated automatically on the 1st of each month.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={a.exportCsv}><Download />Export CSV</Button>
          <Button size="sm" onClick={a.generate} disabled={a.isGenerating}><FilePlus />{a.isGenerating ? "Generating…" : "Generate report"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Administration rate" value={`${s.rate}%`} note={`${s.administered} of ${s.scheduled} doses`} />
        <Metric label="Refused" value={String(s.refused)} note="doses refused" />
        <Metric label="Omitted / not available" value={String(s.omitted + s.notAvailable)} note="with a reason code" />
        <Metric label="Unexplained gaps" value={String(s.gaps)} note="nothing recorded" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={CARD}><CardHeader><CardTitle className="font-bold text-cf-ink">Daily administration rate</CardTitle></CardHeader><CardContent><AdministrationRateChart data={a.daily} /></CardContent></Card>
        <Card className={CARD}><CardHeader><CardTitle className="font-bold text-cf-ink">Why doses were not given</CardTitle></CardHeader><CardContent><OmissionReasonsChart data={a.reasons} /></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={CARD}><CardHeader><CardTitle className="font-bold text-cf-ink">Refusal patterns</CardTitle></CardHeader><CardContent><RefusalPatternsTable patterns={a.patterns} now={a.now} /></CardContent></Card>
        <Card className={CARD}><CardHeader><CardTitle className="font-bold text-cf-ink">Unexplained gaps</CardTitle></CardHeader><CardContent><AuditGapList gaps={a.gaps} now={a.now} /></CardContent></Card>
      </div>

      <Card className={CARD}><CardHeader><CardTitle className="font-bold text-cf-ink">Monthly reports</CardTitle></CardHeader><CardContent><AuditReportList reports={a.reports} onDownload={a.downloadReport} /></CardContent></Card>
    </div>
  );
}
