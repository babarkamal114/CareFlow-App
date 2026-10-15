'use client';

import { AlertDetailSheet, AlertRow, Badge, Card, CardContent, CardHeader, CardTitle, ScrollArea } from '@/components/ui';
import { useComplianceAlerts } from 'hooks';
import { Bell, CheckCircle2 } from 'lucide-react';

export function ComplianceAlerts() {
  const a = useComplianceAlerts();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-cf-surface-muted p-2"><Bell className="h-4 w-4 text-cf-ink-60" /></div>
              <CardTitle className="text-sm font-semibold text-cf-ink">Compliance Alerts</CardTitle>
            </div>
            {a.urgentCount > 0 && <Badge variant="pastel-danger" shape="pill" badgeSize="sm">{a.urgentCount} urgent</Badge>}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {a.openAlerts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 pb-6 text-center">
              <CheckCircle2 className="size-6 text-success" />
              <p className="text-sm font-medium text-cf-ink">All clear</p>
              <p className="text-xs text-cf-ink-60">No open compliance alerts.</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[440px] px-4 pb-4">
              <div className="space-y-3">
                {a.openAlerts.map((alert) => <AlertRow key={alert.id} alert={alert} onSelect={a.select} />)}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDetailSheet alert={a.selected} open={a.open} onOpenChange={a.setOpen} onResolve={a.resolve} onGoTo={a.goTo} />
    </>
  );
}
