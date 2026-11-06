// components/patients/PatientDrawerFooter.tsx
'use client';

import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  Calendar,
  Edit,
  FileText,
  Pill,
  MoreHorizontal,
  AlertTriangle,
  BarChart3,
  Archive,
  LogOut,
} from 'lucide-react';

interface PatientDrawerFooterProps {
  onScheduleVisit?: () => void;
  onEdit?: () => void;
  onCarePlan?: () => void;
  onMedication?: () => void;
  onAddDocument?: () => void;
  onRiskAssessment?: () => void;
  onGenerateReport?: () => void;
  onArchive?: () => void;
  onDischarge?: () => void;
}

export function PatientDrawerFooter({
  onScheduleVisit,
  onEdit,
  onCarePlan,
  onMedication,
  onAddDocument,
  onRiskAssessment,
  onGenerateReport,
  onArchive,
  onDischarge,
}: PatientDrawerFooterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-cf-border bg-cf-surface">
      <Button onClick={onScheduleVisit} size="sm" className="gap-1.5">
        <Calendar className="h-4 w-4" />
        Schedule
      </Button>
      <Button onClick={onEdit} variant="outline" size="sm" className="gap-1.5">
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button onClick={onCarePlan} variant="outline" size="sm" className="gap-1.5">
        <FileText className="h-4 w-4" />
        Add Care Plan
      </Button>
      <Button onClick={onMedication} variant="outline" size="sm" className="gap-1.5">
        <Pill className="h-4 w-4" />
        Update Medication
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MoreHorizontal className="h-4 w-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onAddDocument} className="gap-2">
            <FileText className="h-4 w-4" />
            Add Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRiskAssessment} className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Assessment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateReport} className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchive} className="gap-2 text-cf-error">
            <Archive className="h-4 w-4" />
            Archive Patient
          </DropdownMenuItem>

          {onDischarge && (
            <>
              <div className="my-1 border-t border-cf-border-light" />
              <DropdownMenuItem
                onClick={onDischarge}
                className="gap-2 text-[var(--cf-error)] focus:text-[var(--cf-error)] focus:bg-[var(--cf-error-muted)]"
              >
                <LogOut className="h-4 w-4" />
                Discharge Patient
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}