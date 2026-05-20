"use client";
// features/patients/components/patient-table.tsx
// Full table: column headers + animated rows + pagination footer

import { cn } from "@/lib/utils";
import type { PatientDto } from "../schemas/patient.schema";
import { PatientTableRow } from "./patient-table-row";

const HEADERS = [
  { label: "Patient",    cls: "pl-4 w-[220px]" },
  { label: "Age",        cls: "w-[56px]"        },
  { label: "Risk",       cls: "w-[90px]"        },
  { label: "Status",     cls: "w-[100px]"       },
  { label: "Carer",      cls: "w-[100px]"       },
  { label: "Care Plan",  cls: "w-[120px]"       },
  { label: "Next Visit", cls: "w-[130px]"       },
  { label: "",           cls: "w-[32px]"        },
];

interface PatientTableProps {
  patients: PatientDto[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function PatientTable({
  patients, total, page, totalPages, onPageChange,
}: PatientTableProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] overflow-hidden">
      <table className="w-full border-collapse">
        {/* Headers */}
        <thead>
          <tr className="border-b border-[#F0F1F5] bg-[#FAFBFC]">
            {HEADERS.map((h) => (
              <th key={h.label} className={cn(
                "py-2.5 px-2 text-left text-[11px] font-semibold",
                "uppercase tracking-wider text-[#B0B3C3]", h.cls,
              )}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-[13px] text-[#8B8FA8]">
                No patients found
              </td>
            </tr>
          ) : (
            patients.map((p, i) => (
              <PatientTableRow key={p.id} patient={p} index={i} />
            ))
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F1F5]">
        <p className="text-[12px] text-[#8B8FA8]">
          Showing {patients.length} of {total} patients
        </p>

        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-2.5 py-1.5 rounded-lg border border-[#E4E5EA] text-[12px]
                       font-medium text-[#4A4D63] hover:bg-[#F4F5F7]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {[1, 2, 3].map((n) => (
            <button key={n} onClick={() => onPageChange(n)}
              className={cn(
                "w-8 h-8 rounded-lg text-[12px] font-medium transition-colors",
                page === n
                  ? "bg-[#1A1D2E] text-white"
                  : "border border-[#E4E5EA] text-[#4A4D63] hover:bg-[#F4F5F7]",
              )}
            >
              {n}
            </button>
          ))}

          <span className="text-[12px] text-[#B0B3C3] px-1">…</span>

          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 rounded-lg border border-[#E4E5EA] text-[12px]
                       font-medium text-[#4A4D63] hover:bg-[#F4F5F7] transition-colors"
          >
            {totalPages}
          </button>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-2.5 py-1.5 rounded-lg border border-[#E4E5EA] text-[12px]
                       font-medium text-[#4A4D63] hover:bg-[#F4F5F7]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
