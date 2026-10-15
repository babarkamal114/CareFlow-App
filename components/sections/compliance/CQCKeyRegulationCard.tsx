'use client';

import {
  AllRegulationsDialog, AssignActionDialog, Button, Card, CardContent, CardHeader, CardTitle, RegulationDrawer, RegulationRow,
} from '@/components/ui';
import { useKeyRegulations } from 'hooks';
import { COMPLIANCE_OWNERS } from 'lib';

export function KeyRegulationsCard() {
  const k = useKeyRegulations();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold text-cf-ink">Key Regulations</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => k.setListOpen(true)}>View All {k.total}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {k.keyRegs.map((reg) => <RegulationRow key={reg.id} reg={reg} onSelect={k.select} />)}
          </div>
        </CardContent>
      </Card>

      <AllRegulationsDialog
        open={k.listOpen}
        onOpenChange={k.setListOpen}
        regs={k.filtered}
        total={k.total}
        counts={k.counts}
        filters={k.filters}
        onFiltersChange={k.setFilters}
        onSelect={k.select}
        onExport={() => k.exportRegulations(k.filtered, 'cqc-regulations.csv')}
      />
      <RegulationDrawer
        reg={k.selected}
        open={k.drawerOpen}
        onOpenChange={k.setDrawerOpen}
        onAssign={() => k.setAssignOpen(true)}
        onExport={(reg) => k.exportRegulations([reg], `${reg.reg.toLowerCase().replace(/\s+/g, '-')}-evidence.csv`)}
        onCompleteAction={k.completeAction}
        onOpenLinked={k.openLinked}
      />
      <AssignActionDialog
        open={k.assignOpen}
        onOpenChange={k.setAssignOpen}
        regulationLabel={k.selected ? `${k.selected.reg} · ${k.selected.title}` : ''}
        owners={COMPLIANCE_OWNERS}
        onSubmit={k.assignAction}
      />
    </>
  );
}
