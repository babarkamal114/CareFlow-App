'use client';

import type { StaffMember } from 'types';
import { buildPerformanceForStaff } from 'lib';
import { Star } from 'lucide-react';

interface PerformanceTabProps {
  staffMembers: StaffMember[];
}

function metricColor(pct: number) {
  if (pct >= 90) return "text-green-700";
  if (pct >= 75) return "text-amber-700";
  return "text-red-700";
}

function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(score) ? "fill-amber-400 text-amber-400" : "text-cf-border"}`}
        />
      ))}
      <span className="text-xs text-cf-ink-60 ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

export function PerformanceTab({ staffMembers }: PerformanceTabProps) {
  return (
    <div className="rounded-xl border border-cf-border bg-cf-surface overflow-hidden">
      <div className="p-4 border-b border-cf-border-light">
        <p className="text-sm font-semibold text-cf-ink">Performance dashboard</p>
        <p className="text-xs text-cf-ink-60 mt-0.5">
          Punctuality, visit completion, note quality, and patient feedback per carer
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cf-border-light bg-cf-surface-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-cf-ink-60">Staff member</th>
              <th className="text-center px-3 py-2.5 font-medium text-cf-ink-60">Punctuality</th>
              <th className="text-center px-3 py-2.5 font-medium text-cf-ink-60">Visit completion</th>
              <th className="text-center px-3 py-2.5 font-medium text-cf-ink-60">Note quality</th>
              <th className="text-center px-3 py-2.5 font-medium text-cf-ink-60">Patient feedback</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff, index) => {
              const perf = buildPerformanceForStaff(staff.id, index);
              return (
                <tr key={staff.id} className="border-b border-cf-border-light hover:bg-cf-surface-muted/30">
                  <td className="px-4 py-2.5 font-medium text-cf-ink whitespace-nowrap">{staff.name}</td>
                  <td className={`text-center px-3 py-2.5 font-semibold ${metricColor(perf.punctualityPct)}`}>
                    {perf.punctualityPct}%
                  </td>
                  <td className={`text-center px-3 py-2.5 font-semibold ${metricColor(perf.visitCompletionPct)}`}>
                    {perf.visitCompletionPct}%
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center"><ScoreStars score={perf.noteQualityScore} /></div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center"><ScoreStars score={perf.patientFeedbackScore} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}