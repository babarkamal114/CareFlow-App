import type { Patient } from "types";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Dorothy Chen",
    address: "123 Oak Street, Manchester, M1 2AB",
    email: "dorothy.chen@example.com",
    phone: "07700 900001",
    carer: "Sarah Johnson",
    status: "active",
    nextVisit: "Today, 2:00 PM",
    risk: "high",
    initials: "DC",
    age: 78,
  },
  {
    id: "2",
    name: "James Okafor",
    address: "456 Elm Avenue, Birmingham, B1 2AB",
    email: "james.okafor@example.com",
    phone: "07700 900002",
    carer: "Michael Chen",
    status: "active",
    nextVisit: "Tomorrow, 10:30 AM",
    risk: "medium",
    initials: "JO",
    age: 62,
  },
  {
    id: "3",
    name: "Edna Morris",
    address: "789 Pine Road, Leeds, LS1 2AB",
    email: "edna.morris@example.com",
    phone: "07700 900003",
    carer: "Emma Williams",
    status: "on-hold",
    nextVisit: "March 22, 3:00 PM",
    risk: "high",
    initials: "EM",
    age: 85,
  },
  {
    id: "4",
    name: "Robert Hayes",
    address: "321 Birch Lane, Liverpool, L1 2AB",
    email: "robert.hayes@example.com",
    phone: "07700 900004",
    carer: "David Smith",
    status: "active",
    nextVisit: "March 21, 11:00 AM",
    risk: "low",
    initials: "RH",
    age: 72,
  },
  {
    id: "5",
    name: "Sophie Martinez",
    address: "654 Cedar Court, Bristol, BS1 2AB",
    email: "sophie.martinez@example.com",
    phone: "07700 900005",
    carer: "Lisa Garcia",
    status: "new",
    nextVisit: "March 25, 9:00 AM",
    risk: "low",
    initials: "SM",
    age: 58,
  },
];

export function fetchPatients(): Promise<Patient[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENTS), 700));
}

export type PatientFilters = {
  search?: string;
  status?: Patient["status"] | "all";
  risk?: Patient["risk"] | "all";
};

/** Shared filter fn — the toolbar's tabs and any search box will both run through this. */
export function filterPatients(patients: Patient[], filters: PatientFilters): Patient[] {
  const { search, status, risk } = filters;

  return patients.filter((p) => {
    if (status && status !== "all" && p.status !== status) return false;
    if (risk && risk !== "all" && p.risk !== risk) return false;

    if (search) {
      const q = search.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.carer.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });
}

export type PatientTab = 'all' | 'active' | 'on-hold' | 'high-risk' | 'review-date' | 'new';

export function filterPatientsByTab(
  patients: Patient[],
  tab: PatientTab,
  search: string
): Patient[] {
  let scoped = patients;

  switch (tab) {
    case 'active':
      scoped = patients.filter((p) => p.status === 'active');
      break;
    case 'on-hold':
      scoped = patients.filter((p) => p.status === 'on-hold');
      break;
    case 'new':
      scoped = patients.filter((p) => p.status === 'new');
      break;
    case 'high-risk':
      scoped = patients.filter((p) => p.risk === 'high');
      break;
    case 'review-date':
      scoped = [];
      break;
    case 'all':
    default:
      scoped = patients;
  }

  return filterPatients(scoped, { search });
}

export function getPatientTabCounts(patients: Patient[]) {
  return {
    all: patients.length,
    active: patients.filter((p) => p.status === 'active').length,
    'on-hold': patients.filter((p) => p.status === 'on-hold').length,
    'high-risk': patients.filter((p) => p.risk === 'high').length,
    'review-date': 0, // same TODO as above
    new: patients.filter((p) => p.status === 'new').length,
  };
}