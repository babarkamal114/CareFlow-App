'use client';

import { Button } from "ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/card";
import { CqcQuestionRow } from "ui/compliance/cqc-question-row";
import { ImprovementList } from "ui/compliance/improvement-list";
import { ReadinessDrilldownDialog } from "ui/compliance/readiness-drilldown-dialog";
import { Separator } from "ui/separator";
import { useCqcReadiness } from "hooks";

export function CQCReadinessCard() {
  const r = useCqcReadiness();

  return (
    <>
      <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="font-bold text-cf-ink">CQC Five Questions</CardTitle>
            <CardAction className="flex items-center gap-2 sm:gap-x-4">
              <Button size="sm" variant="brandOutline" onClick={() => r.setDrilldownOpen(true)}>Drill-Down</Button>
              <Separator orientation="vertical" className="hidden sm:block" />
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