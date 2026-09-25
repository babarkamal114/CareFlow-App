"use client";

import { useState } from "react";
import type { Patient } from "types";

export function usePatientsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return {
    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),

    selectedPatient,
    viewPatient: (patient: Patient) => setSelectedPatient(patient),
    closeDrawer: () => setSelectedPatient(null),
  };
}