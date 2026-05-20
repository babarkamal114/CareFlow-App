// app/(dashboard)/patients/page.tsx
// Server component — fetches patients list and renders the full Figma UI

import { PatientList } from "@/features/patients";
import { listPatients } from "@/features/patients/server/get-patient";

export const metadata = { title: "Patients | CareFlow" };

export default function PatientsPage() {
  // listPatients() is sync (mock) — swap for async DB call in production
  const patients = listPatients();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Patients
        </h1>
        <p className="text-sm text-muted-foreground">
          142 service users · Sunrise Care Agency
        </p>
      </div>

      {/* PatientList is a client component — receives pre-fetched data */}
      <PatientList patients={patients} />
    </div>
  );
}
