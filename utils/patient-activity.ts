export type ActivityType = 'medication' | 'meal' | 'vital' | 'therapy' | 'other';

export interface PatientActivity {
  id: string;
  carer: string;
  activity: string;
  time: string;
  type: ActivityType;
}

const MOCK_ACTIVITY: PatientActivity[] = [
  { id: '1', carer: 'Sarah Johnson', activity: 'Morning medication administered', time: '08:30 AM', type: 'medication' },
  { id: '2', carer: 'Sarah Johnson', activity: 'Breakfast prepared and served', time: '09:00 AM', type: 'meal' },
  { id: '3', carer: 'Michael Chen', activity: 'Vitals checked - BP: 120/80', time: '11:30 AM', type: 'vital' },
  { id: '4', carer: 'Sarah Johnson', activity: 'Lunch prepared and served', time: '01:00 PM', type: 'meal' },
  { id: '5', carer: 'Emma Williams', activity: 'Physical therapy session completed', time: '03:30 PM', type: 'therapy' },
];

export function fetchPatientActivity(patientId: string): Promise<PatientActivity[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ACTIVITY), 500));
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  medication: 'bg-blue-500/20 text-blue-600',
  meal: 'bg-green-500/20 text-green-600',
  vital: 'bg-red-500/20 text-red-600',
  therapy: 'bg-purple-500/20 text-purple-600',
  other: 'bg-gray-500/20 text-gray-600',
};

export function getActivityColor(type: ActivityType): string {
  return ACTIVITY_COLORS[type] ?? ACTIVITY_COLORS.other;
}