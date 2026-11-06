'use client';

import {
  AuditFiltersBar, AuditLogDrawer, AuditLogTable, Button, Card, CardContent, CardHeader, CardTitle, FullAuditLogDialog,
} from '@/components/ui';
import { useAuditTrail } from 'hooks';
import { Download } from 'lucide-react';

export function RecentAuditTrailCard() {
  const a = useAuditTrail();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold text-cf-ink">Recent Audit Trail</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={a.exportCsv}><Download />Export</Button>
              <Button variant="ghost" size="sm" onClick={() => a.setFullOpen(true)}>Full Audit Log</Button>
            </div>
          </div>
          <div className="mt-3">
            <AuditFiltersBar filters={a.filters} errors={a.rangeErrors} onChange={a.setFilters} onReset={a.resetFilters} />
          </div>
        </CardHeader>

        <CardContent>
          <AuditLogTable logs={a.recent} asOf={a.asOf} onSelect={a.openEntry} />
        </CardContent>
      </Card>

      <AuditLogDrawer log={a.selected} asOf={a.asOf} open={a.drawerOpen} onOpenChange={a.setDrawerOpen} onViewRecord={a.viewRecord} onDownload={a.downloadEntry} />
      <FullAuditLogDialog
        open={a.fullOpen} onOpenChange={a.setFullOpen} asOf={a.asOf}
        rows={a.pageRows} total={a.filtered.length} page={a.page} pageCount={a.pageCount} onPageChange={a.setPage}
        filters={a.filters} errors={a.rangeErrors} onFiltersChange={a.setFilters} onReset={a.resetFilters}
        onSelect={a.openEntry} onExport={a.exportCsv}
      />
    </>
  );
}
