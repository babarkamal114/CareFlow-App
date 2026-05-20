"use client";
// features/patients/components/patient-table-row.tsx
// Single animated row in the patients table

import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PatientDto } from "../schemas/patient.schema";
import { RiskBadge } from "./ui/risk-badge";
import { StatusBadge } from "./ui/status-badge";
import { CarePlanBar } from "./ui/care-plan-bar";
import { PatientAvatar } from "./ui/patient-avatar";

interface PatientTableRowProps {
  patient: PatientDto;
  index: number; // used for stagger animation delay
}

export function PatientTableRow({ patient, index }: PatientTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      className="group border-b border-[#F0F1F5] last:border-0
                 hover:bg-[#F8F9FB] transition-colors duration-150"
    >
      {/* Patient name + NHS + address */}
      <td className="py-3 pl-4 pr-2">
        <Link href={`/patients/${patient.id}`} className="flex items-center gap-2.5">
          <PatientAvatar initials={patient.initials} displayName={patient.displayName} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1A1D2E] truncate leading-tight">
              {patient.displayName}
            </p>
            <p className="text-[10px] text-[#B0B3C3] truncate">NHS {patient.nhsNumber}</p>
            <p className="text-[10px] text-[#B0B3C3] truncate">{patient.address}</p>
          </div>
        </Link>
      </td>

      {/* Age */}
      <td className="py-3 px-2 text-[13px] text-[#4A4D63] font-medium">{patient.age}</td>

      {/* Risk */}
      <td className="py-3 px-2"><RiskBadge risk={patient.risk} /></td>

      {/* Status */}
      <td className="py-3 px-2"><StatusBadge status={patient.status} /></td>

      {/* Carer */}
      <td className="py-3 px-2 text-[12px] text-[#4A4D63]">{patient.carer}</td>

      {/* Care plan bar */}
      <td className="py-3 px-2"><CarePlanBar status={patient.carePlanStatus} /></td>

      {/* Next visit */}
      <td className="py-3 px-2">
        <span className={cn(
          "text-[12px] font-medium flex items-center gap-1",
          patient.isMissed   ? "text-red-500 font-semibold" : "",
          patient.isPending || patient.isHospital ? "text-[#8B8FA8]" : "text-[#4A4D63]",
        )}>
          {patient.isMissed && <Clock className="w-3 h-3 flex-shrink-0" />}
          {patient.nextVisit}
        </span>
      </td>

      {/* Chevron */}
      <td className="py-3 pr-3 pl-1">
        <ChevronRight className="w-4 h-4 text-[#C8CAD6] group-hover:text-[#8B8FA8]
                                  group-hover:translate-x-0.5 transition-all duration-150" />
      </td>
    </motion.tr>
  );
}
