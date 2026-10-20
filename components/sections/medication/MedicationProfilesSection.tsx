"use client";

import { EmptyState, InputGroup, InputGroupAddon, InputGroupInput, MedicationProfileCard, Skeleton } from "@/components/ui";
import type { useMedicationProfiles } from "hooks"
import { Pill, Search } from "lucide-react";

type Profiles = ReturnType<typeof useMedicationProfiles>;

export function MedicationProfilesSection({ profiles: p }: { profiles: Profiles }) {
  return (
    <div className="space-y-3">
      <InputGroup className="w-full max-w-xs bg-cf-surface">
        <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
        <InputGroupInput placeholder="Search patient or medication…" value={p.search} aria-label="Search medication profiles" onChange={(e) => p.setSearch(e.target.value)} />
      </InputGroup>

      {p.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
      ) : p.groups.length === 0 ? (
        <EmptyState icon={<Pill />} title="No medications found" description="Add a medication to a patient's profile to start their round." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {p.groups.map((g) => (
            <MedicationProfileCard key={g.patient.id} group={g} now={p.now} rules={p.rules} onAdd={p.openAdd} onEdit={p.openEdit} onDiscontinue={p.askDiscontinue} />
          ))}
        </div>
      )}
    </div>
  );
}
