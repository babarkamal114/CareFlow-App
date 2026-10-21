import { PatientsWorkspaceSection } from "sections";

export default function PatientsPage() {
  return (
    <div className="w-full bg-transparent p-6">
      <div className="space-y-4 rounded-2xl bg-cf-surface p-6 shadow-cf-md">
        <PatientsWorkspaceSection />
      </div>
    </div>
  );
}