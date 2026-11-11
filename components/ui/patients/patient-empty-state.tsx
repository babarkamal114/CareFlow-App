import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui";

interface PatientEmptyStateProps {
  hasFilters?: boolean;
}

export function PatientEmptyState({ hasFilters = false }: PatientEmptyStateProps) {
  return (
    <EmptyState
      icon={<Users />}
      title="No patients found"
      description={
        hasFilters
          ? "Try a different tab or clear your search."
          : "Add your first patient to get started."
      }
    />
  );
}