"use client";

import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { InteractionRule, Medication, ProfileGroup } from "types";
import { findRegimeInteractions, formatMedDate, FREQUENCY_LABEL, isRecentlyChanged, ROUTE_LABEL } from "utils";
import { InteractionWarnings } from "./interaction-warnings";
import { MedicationTypeBadge } from "./medication-type-badge";

interface MedicationProfileCardProps {
  group: ProfileGroup; now: Date; rules: InteractionRule[];
  onAdd: (patientId: string) => void; onEdit: (m: Medication) => void; onDiscontinue: (m: Medication) => void;
}

export function MedicationProfileCard({ group, now, rules, onAdd, onEdit, onDiscontinue }: MedicationProfileCardProps) {
  const { patient, medications } = group;
  const warnings = findRegimeInteractions(medications, rules).map((i) => ({ ...i.warning, with: `${i.a.drugName} + ${i.b.drugName}` }));

  return (
    <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-cf-border-light"><AvatarFallback className="bg-cf-surface-muted text-xs font-medium text-cf-ink-60">{patient.initials}</AvatarFallback></Avatar>
            <div>
              <p className="font-semibold text-cf-ink">{patient.name}</p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {patient.allergies.length === 0
                  ? <span className="text-xs text-cf-ink-60">No known allergies</span>
                  : patient.allergies.map((a) => <Badge key={a} variant="pastel-danger" shape="pill" badgeSize="sm">Allergy: {a}</Badge>)}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onAdd(patient.id)}><Plus />Add medication</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <InteractionWarnings warnings={warnings} />
        <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
          {medications.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-3 p-3">
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-cf-ink">{m.drugName} {m.strength}</span>
                  <MedicationTypeBadge medication={m} />
                  {isRecentlyChanged(m, now) && <Badge variant="pastel-warning" shape="pill" badgeSize="sm">{m.changeNote === "New medication added" ? "New" : "Changed"}</Badge>}
                </div>
                <p className="text-xs text-cf-ink-60">
                  {ROUTE_LABEL[m.route]} · {FREQUENCY_LABEL[m.frequency]}{m.times.length > 0 ? ` (${m.times.join(", ")})` : ""} · for {m.indication.toLowerCase()}
                </p>
                <p className="text-xs text-cf-ink-40">
                  Prescribed by {m.prescriber} · started {formatMedDate(m.startDate)}{m.endDate ? ` · ends ${formatMedDate(m.endDate)}` : ""}
                </p>
                {m.instructions && <p className="text-xs text-cf-ink-80">{m.instructions}</p>}
                {isRecentlyChanged(m, now) && m.changeNote && <p className="text-xs font-medium text-warning">{m.changeNote}</p>}
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" aria-label={`Edit ${m.drugName}`} onClick={() => onEdit(m)}><Pencil /></Button>
                <Button variant="ghost" size="icon-sm" aria-label={`Discontinue ${m.drugName}`} onClick={() => onDiscontinue(m)}><Trash2 /></Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
