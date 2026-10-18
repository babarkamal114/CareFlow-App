'use client';

import type { ReactElement } from 'react';

import type { StaffMember } from 'types';
import {
  TRAINING_MODULES,
  buildComplianceForStaff,
} from 'lib';
import type { TrainingResult } from 'lib';
import { Check, X, AlertTriangle, Minus } from 'lucide-react';

const RESULT_ICON: Record<TrainingResult, ReactElement> = {
  pass: <Check className="w-4 h-4 text-green-600" />,
  fail: <X className="w-4 h-4 text-red-600" />,
  expired: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  not_started: <Minus className="w-4 h-4 text-cf-ink-40" />,
};

interface TrainingMatrixTabProps {
  staffMembers: StaffMember[];
}

export function TrainingMatrixTab({ staffMembers }: TrainingMatrixTabProps) {
  return (
    <div className="rounded-xl border border-cf-border bg-cf-surface overflow-hidden">
      <div className="p-4 border-b border-cf-border-light">
        <p className="text-sm font-semibold text-cf-ink">Training matrix</p>
        <p className="text-xs text-cf-ink-60 mt-0.5">
          All staff against mandatory training modules — pass, fail, or expired
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cf-border-light bg-cf-surface-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-cf-ink-60 sticky left-0 bg-cf-surface-muted/50">
                Staff member
              </th>
              {TRAINING_MODULES.map((mod) => (
                <th key={mod} className="text-center px-3 py-2.5 font-medium text-cf-ink-60 whitespace-nowrap">
                  {mod}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff, index) => {
              const record = buildComplianceForStaff(staff.id, index);
              return (
                <tr key={staff.id} className="border-b border-cf-border-light hover:bg-cf-surface-muted/30">
                  <td className="px-4 py-2.5 font-medium text-cf-ink whitespace-nowrap sticky left-0 bg-cf-surface">
                    {staff.name}
                  </td>
                  {TRAINING_MODULES.map((mod) => (
                    <td key={mod} className="text-center px-3 py-2.5">
                      <span className="inline-flex justify-center">{RESULT_ICON[record.training[mod]]}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 px-4 py-3 border-t border-cf-border-light text-xs text-cf-ink-60">
        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Pass</span>
        <span className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-red-600" /> Fail</span>
        <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Expired</span>
        <span className="flex items-center gap-1.5"><Minus className="w-3.5 h-3.5 text-cf-ink-40" /> Not started</span>
      </div>
    </div>
  );
}