import { notFound } from "next/navigation";
import { PatientDetailWorkspace } from "sections";
import { getMockPatientById } from "utils";

type PageProps = { params: Promise<{ patientId: string }> };

export default async function PatientDetailPage(props: PageProps) {
  const { patientId } = await props.params;
  if (!getMockPatientById(patientId)) notFound();

  return <PatientDetailWorkspace patientId={patientId} />;
}
