'use client';

import { Activity } from 'lucide-react';
import { usePatientActivity } from 'hooks';
import { getActivityColor } from 'utils';
import { Button } from "@/components/ui";

interface PatientActivityTabProps {
  patientId?: string;
}

function ActivityRowSkeleton() {
  return (
    <div className="relative pl-16">
      <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-cf-ink-40/20 animate-pulse border-2 border-cf-surface" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-48 rounded bg-cf-ink-40/20 animate-pulse" />
        <div className="h-3 w-24 rounded bg-cf-ink-40/20 animate-pulse" />
      </div>
    </div>
  );
}

export function PatientActivityTab({ patientId }: PatientActivityTabProps) {
  const { activities, isLoading, error, refetch } = usePatientActivity(patientId);

  if (error) {
    return (
      <div className="flex items-center justify-between text-sm py-4">
        <span className="text-cf-ink-60">Couldn&apos;t load today&apos;s activity.</span>
        <Button onClick={refetch} className="font-semibold text-cf-ink underline">
          Retry
        </Button>
      </div>
    );
  }

  if (!isLoading && activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No activity recorded today</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Care actions logged during visits will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cf-border" />
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ActivityRowSkeleton key={i} />)
          : activities.map((activity) => (
              <div key={activity.id} className="relative pl-16">
                <div
                  className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-cf-surface ${
                    getActivityColor(activity.type).split(' ')[0]
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cf-ink">{activity.activity}</p>
                      <p className="text-xs text-cf-ink-60 mt-0.5">{activity.carer}</p>
                    </div>
                    <span className="text-xs text-cf-ink-40 flex-shrink-0">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}