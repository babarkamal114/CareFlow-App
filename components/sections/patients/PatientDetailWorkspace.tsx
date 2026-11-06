"use client";

import { useRouter } from "next/navigation";
import { PatientsWorkspaceSection } from "sections";

interface PatientDetailWorkspaceProps {
  patientId: string;
}

export function PatientDetailWorkspace({ patientId }: PatientDetailWorkspaceProps) {
  const router = useRouter();

  return (
    <div className="w-full bg-transparent p-6">
      <div className="space-y-4 rounded-2xl bg-cf-surface p-6 shadow-cf-md">
        <PatientsWorkspaceSection
          initialPatientId={patientId}
          onDrawerClose={() => router.push("/patients")}
        />
      </div>
    </div>
  );
}
