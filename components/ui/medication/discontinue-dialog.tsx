"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import type { Medication } from "types";
import { getDrugLabel } from "utils";

interface DiscontinueDialogProps { medication: Medication | null; isLoading: boolean; onClose: () => void; onConfirm: () => void }

export function DiscontinueDialog({ medication, isLoading, onClose, onConfirm }: DiscontinueDialogProps) {
  return (
    <Dialog open={medication !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-cf-ink">Discontinue medication?</DialogTitle>
          <DialogDescription>
            {medication ? `${getDrugLabel(medication)} will be removed from today's remaining round. Past records stay in the audit trail.` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Keep</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>{isLoading ? "Working…" : "Discontinue"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
