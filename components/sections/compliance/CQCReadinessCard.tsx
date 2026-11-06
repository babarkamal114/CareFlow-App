'use client';

import {
  Button, Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle, CqcQuestionRow, ImprovementList,
  ReadinessDrilldownDialog, Separator,
} from '@/components/ui';
import { useCqcReadiness } from 'hooks';

export function CQCReadinessCard() {
  const r = useCqcReadiness();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold text-cf-ink">CQC Five Questions</CardTitle>
            <CardAction className="flex gap-x-4">
              <Button size="sm" variant="brandOutline" onClick={() => r.setDrilldownOpen(true)}>Drill-Down</Button>
              <Separator orientation="vertical" />
              <Button size="sm" variant="outline" onClick={r.exportEvidence}>Export Evidence</Button>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {r.questions.map((q) => <CqcQuestionRow key={q.id} question={q} />)}
        </CardContent>

        <CardFooter className="border-t border-cf-border pt-4 empty:hidden">
          <ImprovementList questions={r.questions} />
        </CardFooter>
      </Card>

      <ReadinessDrilldownDialog
        open={r.drilldownOpen}
        onOpenChange={r.setDrilldownOpen}
        factors={r.factors}
        overall={r.overall}
        onExport={r.exportEvidence}
        onNavigate={r.navigate}
      />
    </>
  );
}

export default CQCReadinessCard;
