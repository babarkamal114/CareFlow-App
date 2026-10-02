export const visitTypes = [
  { value: 'care-visit', label: 'Care Visit' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'medication', label: 'Medication' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
];

export const visitDurations = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

// 3.2.1 Visit templates — standard visit types with pre-set title, type and duration
// so coordinators don't have to re-enter the same details every time.
export interface VisitTemplate {
  id: string;
  label: string;
  title: string;
  type: string;
  duration: string;
}

export const visitTemplates: VisitTemplate[] = [
  {
    id: 'morning-personal-care',
    label: '30-min morning personal care',
    title: 'Morning Personal Care',
    type: 'care-visit',
    duration: '30',
  },
  {
    id: 'evening-medication-meal',
    label: '60-min evening medication + meal prep',
    title: 'Evening Medication & Meal Prep',
    type: 'medication',
    duration: '60',
  },
  {
    id: 'initial-assessment',
    label: '60-min initial assessment',
    title: 'Initial Assessment',
    type: 'assessment',
    duration: '60',
  },
  {
    id: 'welfare-check',
    label: '30-min welfare check',
    title: 'Welfare Check',
    type: 'care-visit',
    duration: '30',
  },
];

// 3.2.1 Recurring patterns — set up repeating visits instead of scheduling the same
// visit every week.
export const recurrencePatterns = [
  { value: 'none', label: "Doesn't repeat" },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Every weekday (Mon–Fri)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'custom', label: 'Custom days' },
];

export const weekdayOptions = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

// --- Mock data used purely for client-side conflict / preference demonstration. ---
// In production these checks should be run server-side against real availability,
// qualifications and existing bookings.

export interface CarerRecord {
  id: string;
  name: string;
  qualifications: string[];
  gender: 'female' | 'male';
  languages: string[];
  bookedSlots: { date: string; start: string; end: string }[];
}

export const mockCarers: CarerRecord[] = [
  {
    id: 'carer-1',
    name: 'Sarah Johnson',
    qualifications: ['medication', 'dementia-care'],
    gender: 'female',
    languages: ['English'],
    bookedSlots: [{ date: '2026-08-28', start: '09:00', end: '10:00' }],
  },
  {
    id: 'carer-2',
    name: 'William Chen',
    qualifications: ['peg-feeding'],
    gender: 'male',
    languages: ['English', 'Mandarin'],
    bookedSlots: [],
  },
];

export interface PatientPreferenceRecord {
  id: string;
  name: string;
  preferredGender?: 'female' | 'male';
  requiredLanguage?: string;
  requiresContinuity?: boolean;
  requiredQualification?: string;
}

export const mockPatientPreferences: PatientPreferenceRecord[] = [
  {
    id: 'patient-1',
    name: 'Dorothy Chen',
    preferredGender: 'female',
    requiresContinuity: true,
  },
  {
    id: 'patient-2',
    name: 'James Okafor',
    requiredQualification: 'peg-feeding',
  },
];
