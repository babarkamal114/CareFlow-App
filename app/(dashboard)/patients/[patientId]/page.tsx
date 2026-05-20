// app/(dashboard)/patients/[patientId]/page.tsx
// Server component — prefetches a single patient, renders detail panel

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { PatientDetailPanel, patientKeys } from "@/features/patients";
import { getPatientById } from "@/features/patients/server/get-patient";
import { getQueryClient } from "@/lib/get-query-client";

type PageProps = { params: Promise<{ patientId: string }> };

export default async function PatientDetailPage(props: PageProps) {
  const { patientId } = await props.params;

  // 404 early if patient doesn't exist
  const existing = await getPatientById(patientId);
  if (!existing) notFound();

  // Prefetch into react-query cache so client renders instantly
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: async () => {
      const patient = await getPatientById(patientId);
      if (!patient) throw new Error("Not found");
      return patient;
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Patient</h1>
        <p className="text-sm text-muted-foreground">
          {existing.displayName} · NHS {existing.nhsNumber}
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PatientDetailPanel patientId={patientId} />
      </HydrationBoundary>
    </div>
  );
}
