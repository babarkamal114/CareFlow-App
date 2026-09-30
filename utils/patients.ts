import { Users, UserPlus, FileText, Calendar } from 'lucide-react';
import type { Patient, StatCardProps } from 'types';


const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Dorothy Chen',
    address: '123 Oak Street, Manchester, M1 2AB',
    email: 'dorothy.chen@example.com',
    phone: '07700 900001',
    carer: 'Sarah Johnson',
    status: 'active',
    nextVisit: 'Today, 2:00 PM',
    risk: 'high',
    initials: 'DC',
    age: 78,
  },
  {
    id: '2',
    name: 'James Okafor',
    address: '456 Elm Avenue, Birmingham, B1 2AB',
    email: 'james.okafor@example.com',
    phone: '07700 900002',
    carer: 'Michael Chen',
    status: 'active',
    nextVisit: 'Tomorrow, 10:30 AM',
    risk: 'medium',
    initials: 'JO',
    age: 62,
  },
  {
    id: '3',
    name: 'Edna Morris',
    address: '789 Pine Road, Leeds, LS1 2AB',
    email: 'edna.morris@example.com',
    phone: '07700 900003',
    carer: 'Emma Williams',
    status: 'on-hold',
    nextVisit: 'March 22, 3:00 PM',
    risk: 'high',
    initials: 'EM',
    age: 85,
  },
  {
    id: '4',
    name: 'Robert Hayes',
    address: '321 Birch Lane, Liverpool, L1 2AB',
    email: 'robert.hayes@example.com',
    phone: '07700 900004',
    carer: 'David Smith',
    status: 'active',
    nextVisit: 'March 21, 11:00 AM',
    risk: 'low',
    initials: 'RH',
    age: 72,
  },
  {
    id: '5',
    name: 'Sophie Martinez',
    address: '654 Cedar Court, Bristol, BS1 2AB',
    email: 'sophie.martinez@example.com',
    phone: '07700 900005',
    carer: 'Lisa Garcia',
    status: 'new',
    nextVisit: 'March 25, 9:00 AM',
    risk: 'low',
    initials: 'SM',
    age: 58,
  },
];

export function fetchPatients(): Promise<Patient[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENTS), 700));
}

export type PatientFilters = {
  search?: string;
  status?: Patient['status'] | 'all';
  risk?: Patient['risk'] | 'all';
};

export function filterPatients(patients: Patient[], filters: PatientFilters): Patient[] {
  const { search, status, risk } = filters;

  return patients.filter((p) => {
    if (status && status !== 'all' && p.status !== status) return false;
    if (risk && risk !== 'all' && p.risk !== risk) return false;

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
    'review-date': 0, 
    new: patients.filter((p) => p.status === 'new').length,
  };
}


export interface PatientStats {
  totalPatients: number;
  totalPatientsTrendPct: number;
  newPatients: number;
  newPatientsCount: number;
  activeCarePlans: number;
  carePlansScore: number;
  visitsToday: number;
  visitsTodayTrendPct: number;
}

const MOCK_PATIENT_STATS: PatientStats = {
  totalPatients: 142,
  totalPatientsTrendPct: 12,
  newPatients: 18,
  newPatientsCount: 8,
  activeCarePlans: 98,
  carePlansScore: 85,
  visitsToday: 48,
  visitsTodayTrendPct: 5,
};

export function fetchPatientStats(): Promise<PatientStats> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(MOCK_PATIENT_STATS);
    }, 600);
  });
}

export function getVisiblePatientStatDefinitions(): string[] {
  return ['total-patients', 'new-patients', 'active-care-plans', 'visits-today'];
}

export function buildPatientStatCards(
  stats: PatientStats
): { id: string; props: StatCardProps }[] {
  return [
    {
      id: 'total-patients',
      props: {
        label: 'Total Patients',
        Icon: Users,
        value: String(stats.totalPatients),
        description: 'Active patients under care',
        showScore: false,
        showTrend: true,
        trend: stats.totalPatientsTrendPct < 0 ? 'down' : 'up',
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.totalPatientsTrendPct)}%`,
      },
    },
    {
      id: 'new-patients',
      props: {
        label: 'New Patients',
        Icon: UserPlus,
        value: String(stats.newPatients),
        description: 'Added this month',
        showScore: false,
        showTrend: true,
        trend: stats.newPatientsCount < 0 ? 'down' : 'up',
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.newPatientsCount)}`,
      },
    },
    {
      id: 'active-care-plans',
      props: {
        label: 'Active Care Plans',
        Icon: FileText,
        value: String(stats.activeCarePlans),
        description: 'Care plans currently active',
        showScore: true,
        score: stats.carePlansScore,
        showTrend: false,
        hasCqcScore: false,
        hasValueBadge: false,
      },
    },
    {
      id: 'visits-today',
      props: {
        label: 'Visits Today',
        Icon: Calendar,
        value: String(stats.visitsToday),
        description: 'Scheduled patient visits',
        showScore: false,
        showTrend: true,
        trend: stats.visitsTodayTrendPct < 0 ? 'down' : 'up',
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.visitsTodayTrendPct)}%`,
      },
    },
  ];
}