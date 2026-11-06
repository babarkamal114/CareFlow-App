import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { PatientDetailPanel, patientKeys } from "@/features/patients";
import { getPatientById } from "@/features/patients/server/get-patient";
import { getQueryClient } from "lib";

type PageProps = { params: Promise<{ patientId: string }> };

export default async function PatientDetailPage(props: PageProps) {
  const { patientId } = await props.params;
  const existing = await getPatientById(patientId);
  if (!existing) {
    notFound();
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: async () => {
      const patient = await getPatientById(patientId);
      if (!patient) {
        throw new Error("Not found");
      }
      return patient;
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Patient
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PatientDetailPanel patientId={patientId} />
      </HydrationBoundary>
    </div>
  );
}
