// features/patients/server/get-patient.ts
// Server-only data layer. Replace MOCK with real DB queries when ready.

import "server-only";

import { type PatientDto, patientDtoSchema } from "../schemas/patient.schema";

// ─── Mock data — matches Figma design exactly ─────────────────────────────────

const MOCK: Record<string, PatientDto> = {
  "p-1":  { id: "p-1",  initials: "MJ", displayName: "Margaret Johnson", nhsNumber: "072 432 2041", age: 84, address: "42 Oak Crescent",  risk: "Low",    status: "Active",  carer: "Sarah W.",   carePlanStatus: "Current",    nextVisit: "Today 14:00"    },
  "p-2":  { id: "p-2",  initials: "RA", displayName: "Robert Ahmed",     nhsNumber: "441 4531",     age: 76, address: "42 Elm Street",    risk: "Medium", status: "Active",  carer: "Priya P.",   carePlanStatus: "Current",    nextVisit: "Today 09:00"    },
  "p-3":  { id: "p-3",  initials: "DC", displayName: "Dorothy Chen",     nhsNumber: "007 738 2691", age: 91, address: "15 Oak Lane",      risk: "High",   status: "Active",  carer: "James O.",   carePlanStatus: "Review Due", nextVisit: "Missed today",  isMissed: true   },
  "p-4":  { id: "p-4",  initials: "BW", displayName: "Barbara Williams", nhsNumber: "215 4413",     age: 88, address: "23 Birch Road",    risk: "Medium", status: "Active",  carer: "Fatima K.",  carePlanStatus: "Current",    nextVisit: "Today 10:00"    },
  "p-5":  { id: "p-5",  initials: "HS", displayName: "Henry Smith",      nhsNumber: "098 4413",     age: 79, address: "8 Maple Court",    risk: "Low",    status: "Active",  carer: "Lucy C.",    carePlanStatus: "Overdue",    nextVisit: "Today 16:00"    },
  "p-6":  { id: "p-6",  initials: "EM", displayName: "Edna Morris",      nhsNumber: "118 4131",     age: 82, address: "67 Willow Avenue", risk: "High",   status: "Active",  carer: "Sarah W.",   carePlanStatus: "Current",    nextVisit: "Today 11:00"    },
  "p-7":  { id: "p-7",  initials: "GT", displayName: "George Turner",    nhsNumber: "293 9841",     age: 73, address: "4 Chestnut Drive", risk: "Low",    status: "Active",  carer: "Amara K.",   carePlanStatus: "Current",    nextVisit: "Tomorrow 09:00" },
  "p-8":  { id: "p-8",  initials: "AW", displayName: "Arthur Wilson",    nhsNumber: "004 741 7020", age: 94, address: "18 Cedar Close",   risk: "High",   status: "Active",  carer: "Lucy C.",    carePlanStatus: "Current",    nextVisit: "Today 16:30"    },
  "p-9":  { id: "p-9",  initials: "WD", displayName: "William Davies",   nhsNumber: "441 4471",     age: 60, address: "37 Pine Road",     risk: "Low",    status: "On Hold", carer: "—",          carePlanStatus: "Paused",     nextVisit: "Hospital",      isHospital: true },
  "p-10": { id: "p-10", initials: "FA", displayName: "Florence Adams",   nhsNumber: "315 6172",     age: 90, address: "7 Poplar Lane",    risk: "Medium", status: "Active",  carer: "David M.",   carePlanStatus: "Review Due", nextVisit: "Today 16:00"    },
  "p-11": { id: "p-11", initials: "HB", displayName: "Helen Brown",      nhsNumber: "382 3141",     age: 77, address: "12 Oak Lane",      risk: "Low",    status: "Active",  carer: "Thomas J.",  carePlanStatus: "Current",    nextVisit: "Today 09:30"    },
  "p-12": { id: "p-12", initials: "RP", displayName: "Ruth Parkinson",   nhsNumber: "124 6441",     age: 88, address: "5 Bay Close",      risk: "Low",    status: "New",     carer: "Unassigned", carePlanStatus: "In Setup",   nextVisit: "Pending",       isPending: true  },
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function listPatients(): PatientDto[] {
  return Object.values(MOCK).map((row) => patientDtoSchema.parse(row));
}

export async function getPatientById(id: string): Promise<PatientDto | null> {
  const row = MOCK[id];
  if (!row) return null;
  return patientDtoSchema.parse(row);
}

export async function updatePatientDisplayName(
  id: string,
  displayName: string,
): Promise<PatientDto | null> {
  const existing = MOCK[id];
  if (!existing) return null;
  MOCK[id] = patientDtoSchema.parse({ ...existing, displayName });
  return MOCK[id];
}
