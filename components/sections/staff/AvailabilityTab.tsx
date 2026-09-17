'use client';

import type { StaffMember } from 'types';
import { buildAvailabilityForStaff } from 'lib';

interface AvailabilityTabProps {
  staffMembers: StaffMember[];
}

export function AvailabilityTab({ staffMembers }: AvailabilityTabProps) {
  return (
    <div className="rounded-xl border border-cf-border bg-cf-surface overflow-hidden">
      <div className="p-4 border-b border-cf-border-light">
        <p className="text-sm font-semibold text-cf-ink">Weekly availability</p>
        <p className="text-xs text-cf-ink-60 mt-0.5">
          Available hours vs. booked hours per carer, this week
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cf-border-light bg-cf-surface-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-cf-ink-60 sticky left-0 bg-cf-surface-muted/50">
                Carer
              </th>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <th key={d} className="text-center px-3 py-2.5 font-medium text-cf-ink-60">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff, index) => {
              const availability = buildAvailabilityForStaff(staff.id, index);
              return (
                <tr key={staff.id} className="border-b border-cf-border-light hover:bg-cf-surface-muted/30">
                  <td className="px-4 py-2.5 font-medium text-cf-ink whitespace-nowrap sticky left-0 bg-cf-surface">
                    {staff.name}
                  </td>
                  {availability.week.map((d) => {
                    const isFull = d.availableHours > 0 && d.bookedHours >= d.availableHours;
                    const isPartial = d.bookedHours > 0 && d.bookedHours < d.availableHours;
                    const isUnavailable = d.availableHours === 0;
                    return (
                      <td key={d.day} className="text-center px-3 py-2.5">
                        {isUnavailable ? (
                          <span className="text-xs text-cf-ink-40">—</span>
                        ) : (
                          <div
                            className={`inline-flex flex-col items-center px-2 py-1 rounded-md text-[11px] font-medium ${
                              isFull
                                ? "bg-cf-primary/10 text-cf-primary"
                                : isPartial
                                ? "bg-amber-50 text-amber-700"
                                : "bg-cf-surface-muted text-cf-ink-60"
                            }`}
                          >
                            <span>{d.bookedHours}/{d.availableHours}h</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 px-4 py-3 border-t border-cf-border-light text-xs text-cf-ink-60">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cf-primary/20" /> Fully booked</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-100" /> Partially booked</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cf-surface-muted" /> Available, unbooked</span>
      </div>
    </div>
  );
}