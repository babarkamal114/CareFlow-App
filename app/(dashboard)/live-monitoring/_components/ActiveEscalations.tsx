// app/(dashboard)/live-monitoring/_components/ActiveEscalations.tsx
// Right-panel escalation cards: Missed Visit (critical) and Late Arrivals (warning)

"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Severity = "critical" | "warning";

interface Escalation {
  id: string;
  type: string;
  severity: Severity;
  carer: string;
  patient: string;
  description: string;
  step?: number;       // escalation step (for missed visits)
  totalSteps?: number;
  actions: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ESCALATIONS: Escalation[] = [
  {
    id: "e1",
    type: "Missed Visit",
    severity: "critical",
    carer: "James Okafor",
    patient: "Dorothy Chen",
    description: "James Okafor did not check in",
    step: 2, totalSteps: 4,
    actions: ["Call James", "Reassign", "Escalate"],
  },
  {
    id: "e2",
    type: "Late Arrival",
    severity: "warning",
    carer: "Edna Morris",
    patient: "Maria Rodriguez",
    description: "12 min late",
    actions: ["Call Maria", "Dismiss"],
  },
  {
    id: "e3",
    type: "Late Arrival",
    severity: "warning",
    carer: "Florence Adams",
    patient: "David Mills",
    description: "8 min late",
    actions: ["Call David", "Dismiss"],
  },
];

const SEVERITY_STYLES: Record<Severity, { badge: string; border: string; bg: string }> = {
  critical: {
    badge:  "bg-[#EF4444] text-white",
    border: "border-[#FCA5A5]",
    bg:     "bg-[#FFF5F5]",
  },
  warning: {
    badge:  "bg-[#F59E0B] text-white",
    border: "border-[#FDE68A]",
    bg:     "bg-[#FFFBEB]",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ActiveEscalations() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = ESCALATIONS.filter((e) => !dismissed.includes(e.id));

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-[#111318]">Active Escalations</h2>
        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {visible.length}
        </span>
      </div>

      {/* Escalation cards */}
      <div className="flex flex-col gap-2">
        {visible.map((esc) => {
          const s = SEVERITY_STYLES[esc.severity];
          return (
            <div
              key={esc.id}
              className={`
                rounded-xl border p-3 flex flex-col gap-2
                ${s.bg} ${s.border}
                animate-fade-in
              `}
            >
              {/* Title row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111318]">{esc.type}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${s.badge}`}>
                  {esc.severity}
                </span>
              </div>

              {/* Carer / patient */}
              <p className="text-[11px] text-[#6B7280]">
                <span className="font-medium text-[#111318]">{esc.patient}</span>
                {" · "}
                {esc.description}
              </p>

              {/* Escalation step progress bar */}
              {esc.step && esc.totalSteps && (
                <div>
                  <p className="text-[10px] text-[#A0A3B1] mb-1">
                    Escalation: Step {esc.step} of {esc.totalSteps}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: esc.totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < esc.step! ? "bg-[#EF4444]" : "bg-[#E4E5EA]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {esc.actions.map((action) => (
                  <button
                    key={action}
                    onClick={() => action === "Dismiss" && setDismissed((d) => [...d, esc.id])}
                    className={`
                      text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all
                      ${action === "Escalate"
                        ? "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                        : action === "Dismiss"
                        ? "bg-white text-[#6B7280] border border-[#E4E5EA] hover:bg-[#F5F6FA]"
                        : "bg-white text-[#111318] border border-[#E4E5EA] hover:bg-[#F5F6FA]"
                      }
                    `}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="text-center py-6 text-[#A0A3B1] text-xs">
            No active escalations
          </div>
        )}
      </div>
    </div>
  );
}
