"use client";

import {
  Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui";
import { Download } from "lucide-react";
import type { ReadinessFactor } from "types";
import { BAND_CONFIG, getScoreBand, QUESTION_META } from "utils";
import { StatusProgressBar } from "./status-progress-bar";

interface ReadinessDrilldownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factors: ReadinessFactor[];
  overall: number;
  onExport: () => void;
  onNavigate: (href: string) => void;
}

/** Drill-down (Blueprint 3.4.1): the 8 factors behind the score and which CQC questions they feed. */
export function ReadinessDrilldownDialog({ open, onOpenChange, factors, overall, onExport, onNavigate }: ReadinessDrilldownDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-cf-ink">CQC readiness drill-down</DialogTitle>
          <DialogDescription>Overall {overall}/100, calculated from {factors.length} weighted factors.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="w-44">Score</TableHead>
                <TableHead>Feeds</TableHead>
                <TableHead><span className="sr-only">Open</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factors.map((f) => {
                const band = BAND_CONFIG[getScoreBand(f.score)];
                return (
                  <TableRow key={f.id}>
                    <TableCell>
                      <p className="font-medium text-cf-ink">{f.label}</p>
                      <p className="text-xs text-cf-ink-60">{f.detail}</p>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{f.weight}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusProgressBar value={f.score} tone={band.tone} />
                        <span className="w-8 text-right text-sm font-bold tabular-nums text-cf-ink">{f.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {f.questions.map((q) => (
                          <Badge key={q} variant="pastel-neutral" badgeSize="sm" shape="pill">{QUESTION_META[q].label}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate(f.href)}>Open</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onExport}><Download />Export evidence</Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
