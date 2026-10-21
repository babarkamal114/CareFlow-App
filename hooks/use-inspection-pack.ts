"use client";

import { toast } from "@/components/ui";
import { COMPLIANCE_MOCK_TODAY, mockLastPack, mockPackSections, mockReadinessFactors } from "lib";
import { useEffect, useRef, useState } from "react";
import type { InspectionPackFormData, PackRecord, PackStage } from "types";
import { buildPackSummary, calcOverallScore, downloadTextFile, sumPackPages } from "utils";

const TICKS = 20; // ~2.4s of simulated work
const TICK_MS = 120;

export function useInspectionPack() {
  const [record, setRecord] = useState<PackRecord>(mockLastPack);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [stage, setStage] = useState<PackStage>("idle");
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  const openDialog = () => {
    setStage("idle");
    setProgress(0);
    setDialogOpen(true);
  };

  const closeDialog = (open: boolean) => {
    if (!open) {
      stop();
      setStage("idle");
    }
    setDialogOpen(open);
  };

  const download = (rec: PackRecord) =>
    downloadTextFile(
      "cqc-inspection-pack-summary.txt",
      buildPackSummary(rec, mockPackSections, calcOverallScore(mockReadinessFactors)),
    );

  const generate = (data: InspectionPackFormData) => {
    const selected = mockPackSections.filter((s) => data.sections.includes(s.id));
    let tick = 0;
    setStage("running");
    setProgress(0);
    setStepLabel(`Compiling ${selected[0].label.toLowerCase()}…`);

    timer.current = setInterval(() => {
      tick += 1;
      setProgress(Math.round((tick / TICKS) * 100));
      const idx = Math.min(selected.length - 1, Math.floor((tick / TICKS) * selected.length));
      setStepLabel(`Compiling ${selected[idx].label.toLowerCase()}…`);

      if (tick >= TICKS) {
        stop();
        const next: PackRecord = {
          generatedAt: COMPLIANCE_MOCK_TODAY,
          pageCount: sumPackPages(mockPackSections, data.sections),
          sections: data.sections,
        };
        setRecord(next);
        setStage("done");
        download(next);
        toast.success("Inspection pack generated");
      }
    }, TICK_MS);
  };

  return {
    record, sections: mockPackSections, stage, progress, stepLabel,
    dialogOpen, openDialog, closeDialog, previewOpen, setPreviewOpen,
    generate, downloadAgain: () => download(record),
  };
}
