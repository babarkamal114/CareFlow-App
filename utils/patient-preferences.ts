export interface PatientPreferencesInfo {
  wakeTime?: string;
  bedTime?: string;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  bathPreference?: string;
  teaPreference?: string;
  dietaryPreferences?: string;
  culturalReligious?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  dailyRoutine?: string;
}

export interface PreferenceRow {
  label: string;
  value: string;
}

function pickFilled(entries: [string, string | undefined][]): PreferenceRow[] {
  return entries
    .filter((entry): entry is [string, string] => !!entry[1])
    .map(([label, value]) => ({ label, value }));
}

export function getRoutineRows(p: PatientPreferencesInfo): PreferenceRow[] {
  return pickFilled([
    ['Wakes', p.wakeTime],
    ['Bedtime', p.bedTime],
    ['Breakfast', p.breakfastTime],
    ['Lunch', p.lunchTime],
    ['Dinner', p.dinnerTime],
    ['Bath Preference', p.bathPreference],
  ]);
}

export function getPreferenceRows(p: PatientPreferencesInfo): PreferenceRow[] {
  return pickFilled([
    ['Tea Preference', p.teaPreference],
    ['Dietary', p.dietaryPreferences],
    ['Cultural/Religious', p.culturalReligious],
  ]);
}

export const hasLikesSection = (p: PatientPreferencesInfo) =>
  !!(p.likes || p.dislikes || p.hobbies || p.dailyRoutine);

export const hasPreferenceInfo = (p: PatientPreferencesInfo) =>
  getRoutineRows(p).length > 0 || getPreferenceRows(p).length > 0 || hasLikesSection(p);