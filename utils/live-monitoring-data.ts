import type { LiveVisit, VisitStatus, LiveAttentionItem, LiveCarer, CarerLiveStatus } from "types";

export const mockLiveVisits: LiveVisit[] = [
  {
    id: "v1",
    patientName: "Dorothy Chen",
    patientInitials: "DC",
    careType: "Personal Care + Medication",
    carerName: "Sarah Johnson",
    carerInitials: "SJ",
    status: "in-progress",
    scheduledWindow: "08:30 - 09:30",
    referenceOffsetMinutes: -18,
    durationMinutes: 60,
  },
  {
    id: "v2",
    patientName: "James Okafor",
    patientInitials: "JO",
    careType: "Medication Check",
    carerName: "Michael Chen",
    carerInitials: "MC",
    status: "delayed",
    scheduledWindow: "09:00 - 09:30",
    referenceOffsetMinutes: -12,
    durationMinutes: 30,
  },
  {
    id: "v3",
    patientName: "Edna Morris",
    patientInitials: "EM",
    careType: "Personal Care",
    carerName: "Emma Williams",
    carerInitials: "EW",
    status: "starting",
    scheduledWindow: "10:15 - 11:00",
    referenceOffsetMinutes: 4,
    durationMinutes: 45,
  },
  {
    id: "v4",
    patientName: "Robert Hayes",
    patientInitials: "RH",
    careType: "Meal Preparation",
    carerName: "David Smith",
    carerInitials: "DS",
    status: "in-progress",
    scheduledWindow: "09:45 - 10:45",
    referenceOffsetMinutes: -6,
    durationMinutes: 60,
  },
  {
    id: "v5",
    patientName: "Sophie Martinez",
    patientInitials: "SM",
    careType: "Personal Care + Meal",
    carerName: "Lisa Garcia",
    carerInitials: "LG",
    status: "scheduled",
    scheduledWindow: "11:30 - 12:30",
    referenceOffsetMinutes: 45,
    durationMinutes: 60,
  },
  {
    id: "v6",
    patientName: "Margaret Johnson",
    patientInitials: "MJ",
    careType: "Personal Care + Medication",
    carerName: "James Wilson",
    carerInitials: "JW",
    status: "completed",
    scheduledWindow: "07:30 - 08:30",
    referenceOffsetMinutes: -68,
    durationMinutes: 60,
  },
  {
    id: "v7",
    patientName: "Patricia Smith",
    patientInitials: "PS",
    careType: "Medication + Personal Care",
    carerName: "Anna Martinez",
    carerInitials: "AM",
    status: "missed",
    scheduledWindow: "08:00 - 09:00",
    referenceOffsetMinutes: -30,
    durationMinutes: 60,
  },
  {
    id: "v8",
    patientName: "David Wilson",
    patientInitials: "DW",
    careType: "Personal Care",
    carerName: "Robert Brown",
    carerInitials: "RB",
    status: "scheduled",
    scheduledWindow: "13:00 - 14:00",
    referenceOffsetMinutes: 210,
    durationMinutes: 60,
  },
];

export const liveVisitStatusLabelMap: Record<VisitStatus, string> = {
  starting: "Starting Soon",
  "in-progress": "In Progress",
  delayed: "Delayed",
  scheduled: "Scheduled",
  completed: "Completed",
  missed: "Missed",
};

export const liveVisitStatusBadgeVariantMap: Record<VisitStatus, string> = {
  starting: "pastel-purple",
  "in-progress": "pastel-warning",
  delayed: "pastel-danger",
  scheduled: "pastel-info",
  completed: "pastel-success",
  missed: "pastel-neutral",
};

export const mockLiveAttentionItems: LiveAttentionItem[] = [
  {
    id: "a1",
    type: "no-checkin",
    title: "No check-in",
    description: "James Okafor",
    detail: "Visit at 9:00 AM · Carer didn't check in",
    time: "12m",
  },
  {
    id: "a2",
    type: "missed-visit",
    title: "Missed visit",
    description: "Patricia Smith",
    detail: "Scheduled 8:00 AM · No check-in recorded",
    time: "30m",
  },
  {
    id: "a3",
    type: "delayed",
    title: "Visit running late",
    description: "James Okafor",
    detail: "12 min over scheduled start time",
    time: "12m",
  },
  {
    id: "a4",
    type: "gps",
    title: "GPS signal lost",
    description: "David Smith",
    detail: "Last seen near Robert Hayes' address · 4 min ago",
    time: "4m",
  },
];


export const mockLiveCarersOnShift: LiveCarer[] = [
  { id: "c1", name: "Sarah Johnson", initials: "SJ", status: "active", detail: "With Dorothy Chen" },
  { id: "c2", name: "Michael Chen", initials: "MC", status: "active", detail: "With James Okafor" },
  { id: "c3", name: "Emma Williams", initials: "EW", status: "travelling", detail: "En route to Edna Morris" },
  { id: "c4", name: "David Smith", initials: "DS", status: "active", detail: "With Robert Hayes" },
  { id: "c5", name: "Lisa Garcia", initials: "LG", status: "break", detail: "Break until 11:15" },
  { id: "c6", name: "James Wilson", initials: "JW", status: "travelling", detail: "En route to next visit" },
  { id: "c7", name: "Anna Martinez", initials: "AM", status: "break", detail: "Break until 10:45" },
];

export const carerLiveStatusLabelMap: Record<CarerLiveStatus, string> = {
  active: "In visit",
  travelling: "Travelling",
  break: "On break",
};

export const carerLiveStatusToneMap: Record<CarerLiveStatus, "brand" | "blue" | "amber"> = {
  active: "brand",
  travelling: "blue",
  break: "amber",
};