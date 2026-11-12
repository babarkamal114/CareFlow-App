"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { EmptyState } from "ui/empty-state";
import { InputGroup, InputGroupAddon, InputGroupInput } from "ui/input-group";
import { MedicationProfileCard } from "ui/medication/medication-profile-card";
import { Skeleton } from "ui/skeleton";
import type { useMedicationProfiles } from "hooks";
import { getMedicationCardId } from "app-utils/medication-deep-link";
import { Pill, Plus, Search, X } from "lucide-react";

type Profiles = ReturnType<typeof useMedicationProfiles>;

export function MedicationProfilesSection({ profiles: p }: { profiles: Profiles }) {
  const { highlightId, isLoading, groups, clearHighlight } = p;
  const focused = p.filteredPatient;

  // Scroll the linked patient's card into view, then drop the highlight after 3 seconds.
  useEffect(() => {
    if (!highlightId || isLoading) return undefined;
    document.getElementById(getMedicationCardId(highlightId))?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(clearHighlight, 3000);
    return () => clearTimeout(timer);
  }, [highlightId, isLoading, groups.length, clearHighlight]);

  return (
    <div className="space-y-3">
      <InputGroup className="w-full max-w-xs bg-cf-surface">
        <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
        <InputGroupInput placeholder="Search patient or medication…" value={p.search} aria-label="Search medication profiles" onChange={(e) => p.setSearch(e.target.value)} />
      </InputGroup>

      {/* Stays visible while a patient filter is active so staff know whose medications they are seeing. */}
      {focused && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-cf-border-light bg-brand-50 px-3 py-2 text-sm text-cf-ink">
          <span>Showing medications for <strong>{focused.name}</strong></span>
          <Button variant="ghost" size="sm" onClick={p.clearPatientFilter}><X />Show all patients</Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
      ) : p.patientFilterId && groups.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            icon={<Pill />}
            title={focused ? `No medications for ${focused.name}` : "Patient not found"}
            description={focused ? "Add their first medication to start their round." : "This link points to a patient we could not find."}
          />
          <div className="flex justify-center gap-2">
            {focused && <Button onClick={() => p.openAdd(focused.id)}><Plus />Add medication</Button>}
            {!focused && <Button variant="outline" onClick={p.clearPatientFilter}>Show all patients</Button>}
          </div>
        </div>
      ) : groups.length === 0 ? (
        <EmptyState icon={<Pill />} title="No medications found" description="Add a medication to a patient's profile to start their round." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((g) => (
            <MedicationProfileCard
              key={g.patient.id} group={g} now={p.now} rules={p.rules}
              highlighted={highlightId === g.patient.id}
              onAdd={p.openAdd} onEdit={p.openEdit} onDiscontinue={p.askDiscontinue}
            />
          ))}
        </div>
      )}
    </div>
  );
}