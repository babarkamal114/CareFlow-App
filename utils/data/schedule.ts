import type { CapacityDay, RecurringRule, SchedulePatient, ScheduleAvailabilitySlot, ScheduleCarer, ScheduleDayOfWeek, ScheduleVisit, ShiftSwapRequest, VisitTemplate, VisitType } from "types";

function isoDay(offset: number): string {
  return new Date(Date.UTC(2024, 2, 18 + offset)).toISOString().slice(0, 10);
}
const WEEKDAYS: ScheduleDayOfWeek[] = ["mon", "tue", "wed", "thu", "fri"];
function slots(
  carerId: string,
  days: ScheduleDayOfWeek[],
  startTime: string,
  endTime: string
): ScheduleAvailabilitySlot[] {
  return days.map((day) => ({ id: `${carerId}-${day}`, day, startTime, endTime }));
}
export const scheduleMockCarers: ScheduleCarer[] = [
  {
    id: "c-1", name: "Sarah Johnson", gender: "female", languages: ["English"],
    skills: ["Personal Care", "Medication Support", "Dementia Support"],
    area: "central", employmentType: "employed", travelMode: "drive",
    contractedHoursPerWeek: 37.5, availability: slots("c-1", WEEKDAYS, "07:00", "15:00"),
    leaveDates: [],
  },
  {
    id: "c-2", name: "Michael Chen", gender: "male", languages: ["English"],
    skills: ["Personal Care", "Medication Support", "Hoist Operation"],
    area: "north", employmentType: "employed", travelMode: "drive",
    contractedHoursPerWeek: 37.5, availability: slots("c-2", WEEKDAYS, "08:00", "16:00"),
    leaveDates: [],
  },
  {
    id: "c-3", name: "Emma Williams", gender: "female", languages: ["English"],
    skills: ["Personal Care", "Peg Feeding", "Catheter Care", "Dementia Support"],
    area: "east", employmentType: "employed", travelMode: "drive",
    contractedHoursPerWeek: 30, availability: slots("c-3", WEEKDAYS, "07:00", "15:00"),
    leaveDates: [isoDay(2)],
  },
  {
    id: "c-4", name: "David Smith", gender: "male", languages: ["English"],
    skills: ["Personal Care", "Moving & Handling"],
    area: "south", employmentType: "bank", travelMode: "drive",
    contractedHoursPerWeek: 20,
    availability: slots("c-4", ["mon", "wed", "thu", "fri"], "09:00", "17:00"),
    leaveDates: [],
  },
  {
    id: "c-5", name: "Lisa Garcia", gender: "female", languages: ["English", "Spanish"],
    skills: ["Personal Care", "Dementia Support", "End of Life Care"],
    area: "west", employmentType: "employed", travelMode: "public_transport",
    contractedHoursPerWeek: 30,
    availability: slots("c-5", ["tue", "wed", "thu", "fri", "sat"], "10:00", "18:00"),
    leaveDates: [],
  },
  {
    id: "c-6", name: "William Chen", gender: "male", languages: ["English"],
    skills: ["Personal Care", "Moving & Handling", "Hoist Operation"],
    area: "north", employmentType: "employed", travelMode: "drive",
    contractedHoursPerWeek: 37.5, availability: slots("c-6", WEEKDAYS, "07:00", "15:00"),
    leaveDates: [],
  },
  {
    id: "c-7", name: "Michael Brown", gender: "male", languages: ["English"],
    skills: ["Personal Care", "Medication Support"],
    area: "south", employmentType: "agency", travelMode: "drive",
    contractedHoursPerWeek: 25, availability: slots("c-7", WEEKDAYS, "12:00", "20:00"),
    leaveDates: [],
  },
  {
    id: "c-8", name: "Aisha Khan", gender: "female", languages: ["English", "Urdu", "Punjabi"],
    skills: ["Personal Care", "Dementia Support", "Medication Support"],
    area: "central", employmentType: "employed", travelMode: "walk",
    contractedHoursPerWeek: 30, availability: slots("c-8", WEEKDAYS, "08:00", "16:00"),
    leaveDates: [],
  },
];
// Patient ids match the Patients page ("1"–"8") so links from the patient drawer find the right person.
export const scheduleMockPatients: SchedulePatient[] = [
  {
    id: "1", name: "Dorothy Chen", address: "123 Oak Street, Manchester", area: "central",
    preferences: { carerGender: "female", languages: [], prefersContinuity: true, preferredCarerId: "c-1" },
  },
  {
    id: "2", name: "James Okafor", address: "456 Elm Avenue, Birmingham", area: "north",
    preferences: { languages: [], prefersContinuity: false },
  },
  {
    id: "3", name: "Edna Morris", address: "789 Pine Road, Leeds", area: "east",
    preferences: { carerGender: "female", languages: [], prefersContinuity: true, preferredCarerId: "c-3" },
  },
  {
    id: "4", name: "Robert Hayes", address: "321 Birch Lane, Liverpool", area: "south",
    preferences: { languages: [], prefersContinuity: false },
  },
  {
    id: "5", name: "Sophie Martinez", address: "654 Cedar Court, Bristol", area: "west",
    preferences: { languages: ["Spanish"], prefersContinuity: false },
  },
  {
    id: "6", name: "Tariq Hussain", address: "14 Mill Lane, Bradford", area: "north",
    preferences: { languages: ["Urdu"], prefersContinuity: true },
  },
  {
    id: "7", name: "Arthur Bennett", address: "8 Station Road, Sheffield", area: "central",
    preferences: { languages: [], prefersContinuity: false },
  },
];
export const scheduleMockTemplates: VisitTemplate[] = [
  {
    id: "t-1", name: "30-min morning personal care", durationMinutes: 30, type: "care-visit",
    tasks: ["Wash and dress", "Continence care", "Prepare breakfast"],
    requiredSkills: ["Personal Care"],
  },
  {
    id: "t-2", name: "60-min evening medication + meal prep", durationMinutes: 60, type: "medication",
    tasks: ["Administer prescribed medication", "Prepare evening meal", "Tidy kitchen"],
    requiredSkills: ["Medication Support"],
  },
  {
    id: "t-3", name: "60-min initial assessment", durationMinutes: 60, type: "initial-assessment",
    tasks: ["Home safety check", "Review care needs", "Agree care plan goals"],
    requiredSkills: [],
  },
  {
    id: "t-4", name: "30-min welfare check", durationMinutes: 30, type: "care-visit",
    tasks: ["Check wellbeing", "Make a drink", "Record observations"],
    requiredSkills: [],
  },
];
export const scheduleMockRecurringRules: RecurringRule[] = [
  {
    id: "r-1", patientId: "1", carerId: "c-1", templateId: "t-1", type: "care-visit",
    startTime: "08:30", durationMinutes: 30, frequency: "weekly", days: WEEKDAYS,
    startDate: isoDay(0), endDate: isoDay(90),
  },
  {
    id: "r-2", patientId: "2", carerId: "c-7", templateId: "t-2", type: "medication",
    startTime: "18:00", durationMinutes: 60, frequency: "weekly", days: ["mon", "wed", "fri"],
    startDate: isoDay(0), endDate: isoDay(90),
  },
];
const patientById = Object.fromEntries(scheduleMockPatients.map((p) => [p.id, p]));
const carerById = Object.fromEntries(scheduleMockCarers.map((c) => [c.id, c]));
function visit(
  id: string,
  offset: number,
  patientId: string,
  carerId: string | null,
  startTime: string,
  endTime: string,
  type: VisitType,
  title: string,
  extra: Partial<ScheduleVisit> = {}
): ScheduleVisit {
  const patient = patientById[patientId];
  const carer = carerId ? carerById[carerId] : undefined;
  return {
    id, patientId, patientName: patient.name, carerId, carerName: carer?.name ?? "",
    date: isoDay(offset), startTime, endTime, title, type, status: "scheduled",
    address: patient.address, area: patient.area, notes: "", requiredSkills: [],
    ...extra,
  };
}
const PEG = { requiredSkills: ["Peg Feeding"] };
export const scheduleMockVisits: ScheduleVisit[] = [
  // Previous week (completed)
  visit("v-1", -3, "1", "c-1", "08:30", "09:30", "care-visit", "Morning Personal Care", { status: "completed" }),
  visit("v-2", -3, "2", "c-2", "09:00", "10:00", "medication", "Medication Round", { status: "completed" }),
  // Mon 18 (today)
  visit("v-3", 0, "1", "c-1", "08:30", "09:30", "care-visit", "Morning Personal Care", { status: "completed" }),
  visit("v-4", 0, "2", "c-2", "09:00", "10:00", "medication", "Medication Round", { status: "completed" }),
  visit("v-5", 0, "6", "c-8", "09:30", "10:30", "care-visit", "Morning Personal Care", { status: "missed", notes: "No check-in recorded" }),
  visit("v-6", 0, "3", "c-3", "10:00", "11:30", "care-visit", "Personal Care and Feeding", { status: "in-progress", ...PEG }),
  visit("v-7", 0, "7", "c-8", "11:00", "11:30", "care-visit", "Welfare Check"),
  visit("v-8", 0, "4", "c-4", "13:00", "14:00", "follow-up", "Follow-up Visit"),
  // Tue 19
  visit("v-9", 1, "1", "c-1", "08:30", "09:30", "care-visit", "Morning Personal Care"),
  visit("v-10", 1, "5", "c-5", "10:00", "11:00", "care-visit", "Personal Care"),
  visit("v-11", 1, "4", "c-4", "14:00", "15:00", "follow-up", "Follow-up Visit"), // c-4 not available Tuesdays
  // Wed 20
  visit("v-12", 2, "1", "c-1", "08:30", "09:30", "care-visit", "Morning Personal Care"),
  visit("v-13", 2, "2", "c-2", "09:00", "10:00", "medication", "Medication Round"),
  visit("v-14", 2, "7", "c-2", "09:30", "10:30", "care-visit", "Personal Care"), // double-booked with v-13
  visit("v-15", 2, "3", "c-3", "09:00", "10:00", "care-visit", "Personal Care and Feeding", PEG), // c-3 on leave
  visit("v-16", 2, "5", "c-5", "13:30", "14:30", "review", "Care Plan Review"),
  // Thu 21
  visit("v-17", 3, "1", "c-2", "08:30", "09:30", "care-visit", "Morning Personal Care"), // gender + continuity
  visit("v-18", 3, "6", "c-1", "10:00", "11:00", "care-visit", "Personal Care"), // language
  visit("v-19", 3, "4", "c-4", "11:00", "12:00", "follow-up", "Follow-up Visit"),
  // Fri 22
  visit("v-20", 4, "1", "c-1", "10:00", "11:00", "care-visit", "Personal Care"),
  visit("v-21", 4, "4", "c-1", "11:05", "12:00", "follow-up", "Follow-up Visit"), // not enough travel time
  visit("v-22", 4, "3", "c-2", "14:00", "15:00", "care-visit", "Personal Care and Feeding", PEG), // missing skill
  visit("v-23", 4, "7", "c-7", "14:30", "15:30", "care-visit", "Personal Care"),
  // Sat 23
  visit("v-24", 5, "5", "c-5", "10:00", "11:00", "care-visit", "Personal Care"),
  // Next week (recurring)
  visit("v-25", 7, "1", "c-1", "08:30", "09:00", "care-visit", "Morning Personal Care", { templateId: "t-1", recurringRuleId: "r-1" }),
  visit("v-26", 7, "2", "c-7", "18:00", "19:00", "medication", "Evening Medication & Meal Prep", { templateId: "t-2", recurringRuleId: "r-2" }),
  // Unassigned (carerId null). The reason lives in notes.
  visit("u-1", -1, "1", null, "11:00", "12:00", "initial-assessment", "Initial Assessment", { notes: "New patient" }),
  visit("u-2", 0, "2", null, "13:00", "14:00", "care-visit", "Care Visit", { notes: "Routine" }),
  visit("u-3", 0, "3", null, "14:30", "15:30", "medication", "Medication Round", { notes: "Urgent", ...PEG }),
  visit("u-4", 1, "4", null, "10:00", "11:00", "follow-up", "Follow-up Visit", { notes: "Follow-up" }),
  visit("u-5", 4, "5", null, "09:00", "10:00", "review", "Care Plan Review", { notes: "Routine" }),
];
export const scheduleMockSwaps: ShiftSwapRequest[] = [
  {
    id: "s-1", requesterId: "c-1", requesterName: "Sarah Johnson",
    targetId: "c-6", targetName: "William Chen", date: isoDay(3),
    startTime: "08:00", endTime: "14:00", status: "pending", requestedAt: "2024-03-18T07:00:00",
  },
  {
    id: "s-2", requesterId: "c-3", requesterName: "Emma Williams",
    targetId: "c-7", targetName: "Michael Brown", date: isoDay(4),
    startTime: "14:00", endTime: "20:00", status: "pending", requestedAt: "2024-03-17T16:30:00",
    conflictMessage: "Michael Brown already has a visit from 14:30 to 15:30",
  },
  {
    id: "s-3", requesterId: "c-5", requesterName: "Lisa Garcia",
    targetId: "c-8", targetName: "Aisha Khan", date: isoDay(5),
    startTime: "10:00", endTime: "16:00", status: "approved", requestedAt: "2024-03-16T11:00:00",
  },
];
export const scheduleMockCapacity: CapacityDay[] = [
  { date: isoDay(0), label: "Mon", neededHours: 28, availableHours: 40 },
  { date: isoDay(1), label: "Tue", neededHours: 32, availableHours: 40 },
  { date: isoDay(2), label: "Wed", neededHours: 35, availableHours: 36 },
  { date: isoDay(3), label: "Thu", neededHours: 38, availableHours: 36 },
  { date: isoDay(4), label: "Fri", neededHours: 42, availableHours: 36 },
  { date: isoDay(5), label: "Sat", neededHours: 20, availableHours: 28 },
  { date: isoDay(6), label: "Sun", neededHours: 15, availableHours: 16 },
];