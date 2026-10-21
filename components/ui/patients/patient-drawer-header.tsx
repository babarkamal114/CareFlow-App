import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui";
import type { Patient } from "types";
import { PatientRiskBadge } from "./patient-risk-badge";
import { PatientStatusBadge } from "./patient-status-badge";

interface PatientDrawerHeaderProps {
  patient: Pick<Patient, "id" | "name" | "initials" | "avatar" | "age" | "risk" | "status">;
}

export function PatientDrawerHeader({ patient }: PatientDrawerHeaderProps) {
  return (
    <DrawerHeader className="border-b border-cf-border pb-4">
      <div className="flex items-start gap-4">
        <Avatar className="size-12 border border-cf-border">
          {patient.avatar ? (
            <AvatarImage src={patient.avatar} alt={patient.name} />
          ) : null}
          <AvatarFallback className="bg-brand-50 font-semibold text-brand-600">
            {patient.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <DrawerTitle className="text-xl font-semibold text-cf-ink">
            {patient.name}
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-xs text-cf-ink-60">
            ID: {patient.id}
          </DrawerDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="pastel-info" shape="pill" badgeSize="md">
              Age: {patient.age}
            </Badge>
            <PatientRiskBadge risk={patient.risk} suffix="Risk" />
            {patient.status !== "active" ? (
              <PatientStatusBadge status={patient.status} />
            ) : null}
          </div>
        </div>
      </div>
    </DrawerHeader>
  );
}