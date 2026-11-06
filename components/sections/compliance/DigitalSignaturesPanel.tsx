'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, SignatureRow, SignDocumentDialog } from '@/components/ui';
import { useDigitalSignatures } from 'hooks';
import { PenLine } from 'lucide-react';

export function DigitalSignaturesPanel() {
  const s = useDigitalSignatures();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-50 p-2"><PenLine className="h-4 w-4 text-brand-600" /></div>
              <div>
                <CardTitle className="font-bold text-cf-ink">Digital Signatures</CardTitle>
                <p className="text-xs text-cf-ink-60">Care plans, consent &amp; medication authorisations</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {s.counts.overdue > 0 && <Badge variant="pastel-danger" shape="pill" badgeSize="sm">{s.counts.overdue} overdue</Badge>}
              {s.counts.pending > 0 && <Badge variant="pastel-warning" shape="pill" badgeSize="sm">{s.counts.pending} pending</Badge>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {s.items.map((item) => <SignatureRow key={item.id} item={item} asOf={s.asOf} onSign={s.openSign} />)}
        </CardContent>
      </Card>

      <SignDocumentDialog item={s.signing} onClose={s.closeSign} onSubmit={s.sign} />
    </>
  );
}
