'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Clock, Coffee, Heart } from 'lucide-react';
import {
  PREFERENCE_OPINION_BLOCKS,
  getPreferenceRows,
  getRoutineRows,
  hasLikesSection,
  hasPreferenceInfo,
  type PatientPreferencesInfo,
  type PreferenceRow,
} from 'utils';

function RowList({ rows }: { rows: PreferenceRow[] }) {
  return (
    <>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center text-sm">
          <span className="text-cf-ink-60">{label}</span>
          <span className="text-cf-ink font-medium">{value}</span>
        </div>
      ))}
    </>
  );
}

export function PatientPreferencesTab(props: PatientPreferencesInfo) {
  const { hobbies, dailyRoutine } = props;

  if (!hasPreferenceInfo(props)) {
    return (
      <div className="text-center py-8">
        <Coffee className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No preferences recorded</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Daily routine, likes and dislikes will appear here
        </p>
      </div>
    );
  }

  const routineRows = getRoutineRows(props);
  const preferenceRows = getPreferenceRows(props);

  return (
    <div className="space-y-4">
      {routineRows.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cf-ink-60" />
              Daily Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RowList rows={routineRows} />
          </CardContent>
        </Card>
      )}

      {preferenceRows.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Coffee className="h-4 w-4 text-cf-ink-60" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RowList rows={preferenceRows} />
          </CardContent>
        </Card>
      )}

      {hasLikesSection(props) && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-cf-ink-60" />
              Likes & Dislikes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PREFERENCE_OPINION_BLOCKS.map(({ key, Icon, boxClass, iconClass }) =>
              props[key] ? (
                <div key={key} className={boxClass}>
                  <div className="flex items-start gap-2">
                    <Icon className={iconClass} />
                    <p className="text-sm text-cf-ink">{props[key]}</p>
                  </div>
                </div>
              ) : null
            )}
            {hobbies && <RowList rows={[{ label: 'Hobbies', value: hobbies }]} />}
            {dailyRoutine && (
              <div className="p-2 bg-cf-surface-muted rounded-lg">
                <p className="text-sm text-cf-ink-60">{dailyRoutine}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}