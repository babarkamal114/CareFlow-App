import { CarePlan, CarePlanModule, Incident, StatCardProps, Visit } from "types";
import { UserCheck, UserPlus, Users, UserX2 } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  count?: string;
  isActive?: boolean;
  requiredModule : string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: "dashboard",
        requiredModule: "dashboard",
      },
      {
        href: "/live-monitoring",
        label: "Live Monitoring",
        badge: "3",
        icon: "monitoring",
        requiredModule: "visits",
      },
    ],
  },
  {
    label: "Care",
    items: [
      {
        href: "/patients",
        label: "Patients",
        count: "142",
        icon: "patients",
        requiredModule: "patients",
      },
      {
        href: "/scheduling",
        label: "Scheduling",
        icon: "scheduling",
        requiredModule: "schedule",
      },
      {
        href: "/care-plans",
        label: "Care Plans",
        icon: "care-plans",
        requiredModule: "patients",
      },
      {
        href: "/medications",
        label: "Medications",
        icon: "medications",
        requiredModule: "patients",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/staff",
        label: "Staff",
        count: "31",
        icon: "staff",
        requiredModule: "staff",
      },
      {
        href: "/incidents",
        label: "Incidents",
        badge: "2",
        icon: "incidents",
        requiredModule: "visits",
      },
      {
        href: "/compliance",
        label: "Compliance",
        icon: "compliance",
        requiredModule: "reports",
      },
      {
        href: "/finance",
        label: "Finance",
        icon: "finance",
        requiredModule: "finance",
      },
      {
        href: "/reports",
        label: "Reports",
        icon: "reports",
        requiredModule: "reports",
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        href: "#",
        label: "Messages",
        icon: "messages",
        requiredModule: "users",
      },
      {
        href: "#",
        label: "Notifications",
        icon: "notifications",
        requiredModule: "dashboard",
      },
    ],
  },
];




export const staffStatsData: StatCardProps[] = [
  {
    label: "Total Staff",
    Icon: Users, // ✅ Component reference, not JSX
    value: "42",
    description: "All staff members in your agency",
  },
  {
    label: "Active Staff",
    Icon: UserCheck,
    value: "34",
    description: "Currently active and working",
  },
  {
    label: "Pending Invites",
    Icon: UserPlus,
    value: "5",
    description: "Invitations waiting to be accepted",
  },
  {
    label: "Suspended",
    Icon: UserX2,
    value: "3",
    description: "Temporarily suspended accounts",
  },
];



export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    actions: ['read'],
  },
  {
    id: 'patients',
    label: 'Patients',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'visits',
    label: 'Visits',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'staff',
    label: 'Staff',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'finance',
    label: 'Finance',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'reports',
    label: 'Reports',
    actions: ['create', 'read', 'export'],
  },
  {
    id: 'settings',
    label: 'Settings',
    actions: ['read', 'update', 'manage'],
  },
  {
    id: 'permissions',
    label: 'Permissions',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'users',
    label: 'Users',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
  {
    id: 'agencies',
    label: 'Agencies',
    actions: ['create', 'read', 'update', 'delete', 'all'],
  },
];

export const ACTION_TO_COLUMN: Record<string, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  delete: 'Delete',
  export: 'Export',
  manage: 'Manage',
  all: 'All',
};

export const PERMISSIONS_TABLE_HEADER_COLUMNS = [
  { label: 'Module' },
  { label: 'Create' },  
  { label: 'Read' },
  { label: 'Update' },
  { label: 'Delete' },
];

export const mockVisits: Visit[] = [
  {
    id: '1',
    patientName: 'Dorothy Chen',
    patientId: '1',
    carerName: 'Sarah Johnson',
    carerId: '1',
    startTime: '08:30',
    endTime: '09:30',
    date: '2024-03-18',
    type: 'care',
    status: 'scheduled',
    address: '123 Oak Street, Manchester',
  },
  {
    id: '2',
    patientName: 'James Okafor',
    patientId: '2',
    carerName: 'Michael Chen',
    carerId: '2',
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-03-18',
    type: 'medication',
    status: 'scheduled',
    address: '456 Elm Avenue, Birmingham',
  },
  {
    id: '3',
    patientName: 'Edna Morris',
    patientId: '3',
    carerName: 'Emma Williams',
    carerId: '3',
    startTime: '10:00',
    endTime: '11:30',
    date: '2024-03-18',
    type: 'care',
    status: 'scheduled',
    address: '789 Pine Road, Leeds',
  },
  {
    id: '4',
    patientName: 'Robert Hayes',
    patientId: '4',
    carerName: 'David Smith',
    carerId: '4',
    startTime: '14:00',
    endTime: '15:00',
    date: '2024-03-19',
    type: 'check-up',
    status: 'scheduled',
    address: '321 Birch Lane, Liverpool',
  },
  {
    id: '5',
    patientName: 'Sophie Martinez',
    patientId: '5',
    carerName: 'Lisa Garcia',
    carerId: '5',
    startTime: '13:30',
    endTime: '14:30',
    date: '2024-03-20',
    type: 'therapy',
    status: 'scheduled',
    address: '654 Cedar Court, Bristol',
  },
];

export const mockPatients = [
  {
    id: "1",
    name: "Dorothy Chen",
    preferredName: "Dot",
    dateOfBirth: "1946-03-15",
    nhsNumber: "123 456 7890",
    address: "123 Oak Street, Manchester, M1 2AB",
    initials: "DC",
    age: 78,
    risk: "high" as const,
    status: "active" as const,
    carer: "Sarah Johnson",
    nextVisit: "Today, 2:00 PM",
    email: "dorothy.chen@email.com",
    phone: "0161 123 4567",
    gpName: "Dr. Sarah Ahmed",
    gpPhone: "0161 123 4567",
    gpAddress: "Oak Lane Surgery, Manchester",
    nextOfKinName: "Margaret Chen",
    nextOfKinPhone: "07700 900123",
    nextOfKinRelationship: "Daughter",
    emergencyContact: "Margaret Chen",
    emergencyPhone: "07700 900123",
    emergencyRelationship: "Daughter",
  },
  {
    id: "2",
    name: "James Okafor",
    preferredName: "Jim",
    dateOfBirth: "1962-08-22",
    nhsNumber: "234 567 8901",
    address: "456 Elm Avenue, Birmingham, B1 2AB",
    initials: "JO",
    age: 62,
    risk: "medium" as const,
    status: "active" as const,
    carer: "Michael Chen",
    nextVisit: "Tomorrow, 10:30 AM",
    email: "james.okafor@email.com",
    phone: "0121 456 7890",
    gpName: "Dr. David Patel",
    gpPhone: "0121 456 7890",
    gpAddress: "Elm Grove Surgery, Birmingham",
    nextOfKinName: "Grace Okafor",
    nextOfKinPhone: "07700 900456",
    nextOfKinRelationship: "Wife",
    emergencyContact: "Grace Okafor",
    emergencyPhone: "07700 900456",
    emergencyRelationship: "Wife",
  },
  {
  id: "3",
    name: "Edna Morris",
    preferredName: "",
    dateOfBirth: "1939-11-03",
    nhsNumber: "345 678 9012",
    address: "789 Pine Road, Leeds, LS1 2AB",
    initials: "EM",
    age: 85,
    risk: "high" as const,
    status: "on-hold" as const,
    carer: "Emma Williams",
    nextVisit: "March 22, 3:00 PM",
    email: "edna.morris@email.com",
    phone: "0113 789 0123",
    gpName: "Dr. Sarah Ahmed",
    gpPhone: "0113 789 0123",
    gpAddress: "Pine View Surgery, Leeds",
    nextOfKinName: "Thomas Morris",
    nextOfKinPhone: "07700 900789",
    nextOfKinRelationship: "Son",
    emergencyContact: "Thomas Morris",
    emergencyPhone: "07700 900789",
    emergencyRelationship: "Son",
  },
  {
    id: "4",
    name: "Robert Hayes",
    preferredName: "Bob",
    dateOfBirth: "1952-06-30",
    nhsNumber: "456 789 0123",
    address: "321 Birch Lane, Liverpool, L1 2AB",
    initials: "RH",
    age: 72,
    risk: "low" as const,
    status: "active" as const,
    carer: "David Smith",
    nextVisit: "March 21, 11:00 AM",
    email: "robert.hayes@email.com",
    phone: "0151 234 5678",
    gpName: "Dr. Emily Wilson",
    gpPhone: "0151 234 5678",
    gpAddress: "Birch Lane Surgery, Liverpool",
    nextOfKinName: "Susan Hayes",
    nextOfKinPhone: "07700 901234",
    nextOfKinRelationship: "Daughter",
    emergencyContact: "Susan Hayes",
    emergencyPhone: "07700 901234",
    emergencyRelationship: "Daughter",
  },
  {
    id: "5",
    name: "Sophie Martinez",
    preferredName: "Sophie",
    dateOfBirth: "1966-12-15",
    nhsNumber: "567 890 1234",
    address: "654 Cedar Court, Bristol, BS1 2AB",
    initials: "SM",
    age: 58,
    risk: "low" as const,
    status: "new" as const,
    carer: "Lisa Garcia",
    nextVisit: "March 25, 9:00 AM",
    email: "sophie.martinez@email.com",
    phone: "0117 567 8901",
    gpName: "Dr. James Brown",
    gpPhone: "0117 567 8901",
    gpAddress: "Cedar Court Surgery, Bristol",
    nextOfKinName: "Carlos Martinez",
    nextOfKinPhone: "07700 902345",
    nextOfKinRelationship: "Husband",
    emergencyContact: "Carlos Martinez",
    emergencyPhone: "07700 902345",
    emergencyRelationship: "Husband",
  },
];

// 1. Personal Care Module
const mockPersonalCareModule: CarePlanModule = {
  id: 'mod-pc-001',
  name: 'Personal Care Plan',
  type: 'personal-care',
  status: 'approved',
  reviewStatus: 'current',
  version: 'v2.3',
  createdDate: '2024-02-15',
  reviewDate: '2024-03-10',
  nextReviewDate: '2024-04-07',
  createdBy: 'Sarah Johnson',
  lastReviewedBy: 'Sarah Johnson',
  content: {
    type: 'personal-care',
    mobilityLevel: 'assistance',
    personalHygiene: {
      bathing: 'Requires assistance with showering, prefers evening baths',
      toileting: 'Needs prompts and assistance with transfer, uses raised toilet seat',
      dressing: 'Can dress upper body independently, needs help with buttons and shoes',
      grooming: 'Requires supervision for shaving, can brush teeth independently'
    },
    continenceSupport: {
      status: 'managed',
      plan: 'Pad changes 3x daily, toilet prompts every 2 hours, bladder training exercises'
    },
    skinIntegrity: {
      pressure_ulcer_risk: 'medium',
      preventionMeasures: [
        'Repositioning every 2 hours',
        'Pressure-relieving mattress in use',
        'Daily skin inspection',
        'Barrier cream application'
      ]
    },
    preferences: [
      'Prefers warm water for bathing',
      'Likes to listen to classical music during care',
      'Enjoys wearing blue colored clothing'
    ],
    goals: [
      'Improve upper body strength for dressing independence',
      'Establish consistent toileting routine',
      'Maintain skin integrity without breakdown'
    ],
    notes: 'Patient is cooperative with care. Family prefers female carers. Recently had a fall - increased supervision needed.'
  }
};

// 2. Medication Module
const mockMedicationModule: CarePlanModule = {
  id: 'mod-med-002',
  name: 'Medication Management',
  type: 'medication',
  status: 'approved',
  reviewStatus: 'overdue',
  version: 'v1.8',
  createdDate: '2024-01-20',
  reviewDate: '2024-02-15',
  nextReviewDate: '2024-03-14',
  createdBy: 'Dr. Patel',
  lastReviewedBy: 'Michael Chen',
  content: {
    type: 'medication',
    medications: [
      {
        id: 'med-1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        timing: 'Morning (8:00 AM)',
        indication: 'Hypertension',
        sideEffects: ['Cough', 'Dizziness', 'Headache']
      },
      {
        id: 'med-2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        timing: 'With breakfast and dinner',
        indication: 'Type 2 Diabetes',
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach discomfort']
      },
      {
        id: 'med-3',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        timing: 'Evening (9:00 PM)',
        indication: 'Cardiovascular protection',
        sideEffects: ['Bruising', 'Heartburn']
      }
    ],
    medicationAdherenceLevel: 'good',
    administrationMethod: 'Oral with water, with meals where possible',
    interactions: ['May interact with ibuprofen', 'Avoid grapefruit with statins'],
    storageRequirements: 'Room temperature, away from moisture, in original packaging',
    prescriber: 'Dr. Patel - Cardiology Clinic',
    lastReviewDate: '2024-02-15',
    nextReviewDate: '2024-05-15',
    goals: [
      'Maintain BP below 130/80 mmHg',
      'Improve medication adherence to 100%',
      'Reduce medication side effects through timing adjustments'
    ],
    notes: 'Patient sometimes forgets evening dose. Use pill organizer. Pharmacy delivery on 1st of each month.'
  }
};

// 3. Dementia Module
const mockDementiaModule: CarePlanModule = {
  id: 'mod-dem-003',
  name: 'Dementia Care Plan',
  type: 'dementia',
  status: 'approved',
  reviewStatus: 'current',
  version: 'v4.0',
  createdDate: '2024-01-10',
  reviewDate: '2024-03-08',
  nextReviewDate: '2024-04-05',
  createdBy: 'Dr. Williams',
  lastReviewedBy: 'Sarah Johnson',
  content: {
    type: 'dementia',
    dementiaType: 'Alzheimer\'s Disease',
    stageOfDementia: 'middle',
    cognitiveAbilities: {
      memory: 'Short-term memory significantly impaired, long-term intact',
      communication: 'Word-finding difficulties, able to express basic needs',
      problemSolving: 'Impaired - cannot manage finances or medications',
      orientation: 'Often confused about time, sometimes place'
    },
    behavioralChallenges: [
      {
        behavior: 'Sundowning - agitation in evening',
        trigger: 'Late afternoon/early evening, fatigue',
        strategy: 'Evening routine with calming music, dim lighting, avoid stimulating activities'
      },
      {
        behavior: 'Refusal to bathe',
        trigger: 'Fear of water, cold environment',
        strategy: 'Use warm room, offer sponge bath as alternative, involve in preparation'
      },
      {
        behavior: 'Wandering',
        trigger: 'Boredom, need for exercise',
        strategy: 'Regular walks, safe enclosed garden access, door alarms'
      }
    ],
    calmingStrategies: [
      'Hand massage with lavender oil',
      'Playing familiar music from 1960s',
      'Looking through photo albums',
      'Sensory activity - arranging flowers'
    ],
    environmentalModifications: [
      'Install motion sensor night lights',
      'Remove hazards and clutter',
      'Use visual cues - pictures on doors',
      'Secure safety locks on windows and external doors'
    ],
    communicationApproach: 'Use simple language, one instruction at a time. Maintain eye contact. Validate feelings. Give choices with two options.',
    familyInvolvement: 'Daughter visits 3x per week. Family provides life history book. Emergency contact for decisions.',
    goals: [
      'Reduce sundowning episodes by 30%',
      'Establish consistent bathing routine',
      'Prevent falls through environmental modifications'
    ],
    notes: 'Patient has good days and bad days. Morning hours are best for activities. Avoid rushing or correcting patient.'
  }
};

// 4. Nutrition Module
const mockNutritionModule: CarePlanModule = {
  id: 'mod-nut-004',
  name: 'Nutrition and Hydration Plan',
  type: 'nutrition',
  status: 'in-review',
  reviewStatus: 'needs-change',
  version: 'v3.1',
  createdDate: '2024-01-25',
  reviewDate: '2024-03-01',
  nextReviewDate: '2024-03-29',
  createdBy: 'Anna Davis - Dietitian',
  lastReviewedBy: 'Emma Williams',
  content: {
    type: 'nutrition',
    MUSTScore: 2,
    nutritionStatus: 'at-risk',
    dietaryType: 'modified-texture',
    foodPreferences: [
      'Hot meals - especially soups and stews',
      'Soft cooked vegetables',
      'Fish - particularly salmon',
      'Tapioca pudding and custard'
    ],
    dislikesAndAllergies: [
      {
        item: 'Nuts',
        type: 'allergy'
      },
      {
        item: 'Citrus fruits',
        type: 'intolerance'
      },
      {
        item: 'Raw vegetables',
        type: 'dislike'
      },
      {
        item: 'Spicy foods',
        type: 'dislike'
      }
    ],
    swallowingDifficulties: true,
    swallowingPlan: 'Postural advice - chin tuck. Avoid mixed textures (e.g., soup with chunks). Add thickener to fluids to nectar consistency.',
    mealTimes: 'Breakfast 8:30 AM, Lunch 12:30 PM, Dinner 6:00 PM. Snacks at 10:30 AM and 3:00 PM.',
    fluidIntake: {
      recommended: '1800ml per 24 hours',
      method: 'Small frequent cups. Use preferred cup - blue with handles. Fortified fluids between meals.'
    },
    supplementation: 'Fortisip 1.5 kcal x2 daily. Vitamin D supplement 800 IU daily. Ensure adequate protein.',
    appetiteChanges: 'Appetite better in morning. Difficulty with large portions. Prefers 6 small meals.',
    goals: [
      'Stabilize weight at current BMI 22',
      'Increase protein intake to 1.2g/kg/day',
      'Maintain adequate fluid intake for renal health'
    ],
    notes: 'Weight: 62kg (BMI 22). Recent weight loss 2kg in 1 month. Consider nutritional support review.'
  }
};

// 5. Mobility Module
const mockMobilityModule: CarePlanModule = {
  id: 'mod-mob-005',
  name: 'Mobility and Fall Prevention',
  type: 'mobility',
  status: 'approved',
  reviewStatus: 'reviewed',
  version: 'v1.2',
  createdDate: '2024-02-01',
  reviewDate: '2024-03-12',
  nextReviewDate: '2024-04-09',
  createdBy: 'James Smith - Physiotherapist',
  lastReviewedBy: 'David Smith',
  content: {
    type: 'mobility',
    mobilityStatus: 'assistance',
    fallRisk: 'medium',
    fallRiskFactors: [
      'History of falls (2 in last 6 months)',
      'Leg weakness - grade 4/5',
      'Impaired vision - needs glasses',
      'Dizziness when standing',
      'Multiple medications - BP medication'
    ],
    mobilityAids: [
      {
        aid: 'Walking frame (rollator)',
        type: 'walking'
      },
      {
        aid: 'Transfer belt',
        type: 'transfer'
      },
      {
        aid: 'Raising chair with automatic rise',
        type: 'balance'
      }
    ],
    transferNeeds: [
      {
        type: 'bed-transfer',
        assistance: 'supervision'
      },
      {
        type: 'chair-transfer',
        assistance: '1-person'
      },
      {
        type: 'toilet-transfer',
        assistance: '1-person'
      },
      {
        type: 'bath-transfer',
        assistance: '2-person'
      }
    ],
    preventionMeasures: [
      'Grab rails in bathroom and hallway',
      'Non-slip mats in bathroom',
      'Clear pathways - remove clutter and rugs',
      'Ensure call bell within reach',
      'Regular foot care - podiatry referral'
    ],
    physicalTherapy: 'Physiotherapy weekly - leg strengthening exercises. Focus on glute and quad strengthening.',
    exercisePlan: 'Seated exercises 10 mins daily: ankle pumps, knee extensions, marching. Supported standing: heel raises, mini squats.',
    goals: [
      'Improve leg strength to grade 5/5',
      'Independent transfer in 3 months',
      'No falls in next 3 months'
    ],
    notes: 'Patient motivated and engaged with therapy. Recent hip replacement (8 months ago). Progress slow but steady.'
  }
};

// 6. Mental Health Module
const mockMentalHealthModule: CarePlanModule = {
  id: 'mod-mh-006',
  name: 'Mental Health and Wellbeing Plan',
  type: 'mental-health',
  status: 'draft',
  reviewStatus: 'overdue',
  version: 'v0.5',
  createdDate: '2024-02-10',
  reviewDate: '2024-02-28',
  nextReviewDate: '2024-03-28',
  createdBy: 'Emma Thompson - Clinical Psychologist',
  lastReviewedBy: 'Lisa Garcia',
  content: {
    type: 'mental-health',
    mentalHealthStatus: 'Moderate depression with anxiety',
    diagnosedConditions: [
      'Major Depressive Disorder - recurrent',
      'Generalized Anxiety Disorder',
      'Panic attacks - occasional'
    ],
    currentMood: 'Anxious, low energy, sleeps poorly, irritable at times',
    stressorsAndTriggers: [
      'Financial concerns - managing bills',
      'Health anxiety - fear of another illness',
      'Social isolation - few visitors',
      'Death of spouse (2 years ago)'
    ],
    copingStrategies: [
      'Deep breathing exercises - daily practice',
      'Journaling - expression of feelings',
      'Listening to audio books and podcasts',
      'Using CATS app for mood tracking'
    ],
    supportNetwork: 'Weekly phone calls from daughter. Monthly coffee with church group. CPN visits fortnightly.',
    socialActivities: [
      'Attends dementia friends session weekly',
      'Knitting group on Fridays',
      'Virtual coffee mornings 3x per week'
    ],
    hobbiesAndInterests: [
      'Gardening - indoor plants',
      'Crossword puzzles',
      'Bird watching',
      'Painting watercolors'
    ],
    motivationLevel: 'moderate',
    selfCareAbility: 'Requires encouragement with ADLs. Can manage basic hygiene but needs prompting for meals.',
    goals: [
      'Reduce anxiety symptoms (GAD-7 score <10)',
      'Attend all social activities weekly',
      'Establish regular sleep-wake cycle',
      'Engage in meaningful activity daily'
    ],
    notes: 'Patient tends to isolate on weekends. Needs structured daily routine. Consider therapy referral for grief counseling.'
  }
};

// Complete Care Plan with all modules
export const mockCarePlan: CarePlan = {
  id: 'cp-2024-001',
  patientId: 'P-12345',
  patientName: 'Dorothy Chen',
  patientDOB: '1942-06-15',
  patientAddress: '123 Elm Street, London, SW1A 1AA',
  nhs_number: '123 456 7890',
  keyWorker: 'Sarah Johnson',
  keyWorkerContact: 'sarah.johnson@carefacility.co.uk',
  modules: [
    mockPersonalCareModule,
    mockMedicationModule,
    mockDementiaModule,
    mockNutritionModule,
    mockMobilityModule,
    mockMentalHealthModule
  ],
  overallStatus: 'approved',
  createdDate: '2024-01-15',
  lastReviewDate: '2024-03-10',
  nextReviewDate: '2024-04-07',
  createdBy: 'Dr. Williams'
};

// Individual module data for CarePlanBlock display
export const mockCarePlanBlocks = [
  {
    id: 'cp-2024-001',
    patientName: 'Dorothy Chen',
    type: 'personal-care' as const,
    status: 'approved' as const,
    reviewStatus: 'current' as const,
    version: 'v2.3',
    lastReviewed: new Date('2024-03-10'),
    nextReviewDate: new Date('2024-04-07'),
    carer: 'Sarah Johnson',
    score: 85
  },
  {
    id: 'cp-2024-002',
    patientName: 'James Okafor',
    type: 'medication' as const,
    status: 'approved' as const,
    reviewStatus: 'overdue' as const,
    version: 'v1.8',
    lastReviewed: new Date('2024-02-15'),
    nextReviewDate: new Date('2024-03-14'),
    carer: 'Michael Chen',
    score: 72
  },
  {
    id: 'cp-2024-003',
    patientName: 'Edna Morris',
    type: 'nutrition' as const,
    status: 'in-review' as const,
    reviewStatus: 'needs-change' as const,
    version: 'v3.1',
    lastReviewed: new Date('2024-03-01'),
    nextReviewDate: new Date('2024-03-29'),
    carer: 'Emma Williams',
    score: 2
  },
  {
    id: 'cp-2024-004',
    patientName: 'Robert Hayes',
    type: 'mobility' as const,
    status: 'approved' as const,
    reviewStatus: 'reviewed' as const,
    version: 'v1.2',
    lastReviewed: new Date('2024-03-12'),
    nextReviewDate: new Date('2024-04-09'),
    carer: 'David Smith',
    score: 2
  },
  {
    id: 'cp-2024-005',
    patientName: 'Sophie Martinez',
    type: 'mental-health' as const,
    status: 'draft' as const,
    reviewStatus: 'overdue' as const,
    version: 'v0.5',
    lastReviewed: new Date('2024-02-28'),
    nextReviewDate: new Date('2024-03-28'),
    carer: 'Lisa Garcia',
    score: 0
  },
  {
    id: 'cp-2024-006',
    patientName: 'Margaret Johnson',
    type: 'dementia' as const,
    status: 'approved' as const,
    reviewStatus: 'current' as const,
    version: 'v4.0',
    lastReviewed: new Date('2024-03-08'),
    nextReviewDate: new Date('2024-04-05'),
    carer: 'Sarah Johnson',
    score: 0
  }
];

// Export all for use
export const mockModules = {
  personalCare: mockPersonalCareModule,
  medication: mockMedicationModule,
  dementia: mockDementiaModule,
  nutrition: mockNutritionModule,
  mobility: mockMobilityModule,
  mentalHealth: mockMentalHealthModule
};

export const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    patientName: 'Dorothy Chen',
    patientId: 'patient-1',
    type: 'fall',
    severity: 'high',
    title: 'Fall in bathroom',
    description: 'Patient slipped on wet floor while using toilet. No immediate injuries but some bruising on left arm.',
    dateTime: new Date('2024-06-15 14:30'),
    reportedBy: 'Sarah Johnson (Carer)',
    assignedTo: 'John Manager',
    status: 'investigating',
    location: '123 Oak Street, Bathroom',
    witnesses: ['None'],
    evidence: [],
    investigationNotes: [
      {
        note: 'Incident reported by carer Sarah. Patient conscious and responsive. No visible fractures.',
        author: 'John Manager',
        timestamp: new Date('2024-06-15 15:00'),
      },
      {
        note: 'Discussed with patient - she felt dizzy before the fall. May need balance assessment.',
        author: 'John Manager',
        timestamp: new Date('2024-06-15 16:30'),
      },
    ],
    nextReviewDate: new Date('2024-06-22'),
    createdAt: new Date('2024-06-15 14:30'),
    updatedAt: new Date('2024-06-15 16:30'),
  },
  {
    id: 'incident-2',
    patientName: 'James Okafor',
    patientId: 'patient-2',
    type: 'medication-error',
    severity: 'critical',
    title: 'Missed medication dose - Lisinopril',
    description: 'Carer forgot to administer 10mg Lisinopril at scheduled time (09:00). Dose given 2 hours late at 11:00.',
    dateTime: new Date('2024-06-14 09:00'),
    reportedBy: 'Michael Chen (Carer)',
    assignedTo: 'John Manager',
    status: 'resolved',
    location: '456 Maple Ave, Patient Home',
    witnesses: [],
    evidence: [],
    investigationNotes: [
      {
        note: 'Carer reported missed dose. Patient took medication at 11:00 instead. No adverse effects observed.',
        author: 'John Manager',
        timestamp: new Date('2024-06-14 11:30'),
      },
      {
        note: 'Root cause: Carer distracted by kitchen emergency (boiling pot). Recommendation: implement alarm reminder system.',
        author: 'John Manager',
        timestamp: new Date('2024-06-14 15:00'),
      },
      {
        note: 'Action taken: All carers now using medication reminder app with phone alarm. Michael retrained on medication safety.',
        author: 'John Manager',
        timestamp: new Date('2024-06-15 10:00'),
      },
    ],
    nextReviewDate: new Date('2024-07-14'),
    createdAt: new Date('2024-06-14 09:00'),
    updatedAt: new Date('2024-06-15 10:00'),
  },
  {
    id: 'incident-3',
    patientName: 'Edna Morris',
    patientId: 'patient-3',
    type: 'safeguarding',
    severity: 'critical',
    title: 'Potential financial abuse concern',
    description: 'Patient mentioned that family member asked for access to bank account "temporarily". Patient unsure if this is appropriate.',
    dateTime: new Date('2024-06-16 10:15'),
    reportedBy: 'Emma Williams (Carer)',
    assignedTo: 'John Manager',
    status: 'investigating',
    location: '789 Cedar Lane, Patient Home',
    witnesses: ['Patient (Edna Morris)'],
    evidence: [],
    investigationNotes: [
      {
        note: 'CRITICAL: Carer flagged potential financial abuse. Immediate escalation to safeguarding team.',
        author: 'John Manager',
        timestamp: new Date('2024-06-16 11:00'),
      },
      {
        note: 'Called local safeguarding board. Case number: SAF-2024-1847. Awaiting investigation response.',
        author: 'John Manager',
        timestamp: new Date('2024-06-16 14:00'),
      },
    ],
    nextReviewDate: new Date('2024-06-23'),
    createdAt: new Date('2024-06-16 10:15'),
    updatedAt: new Date('2024-06-16 14:00'),
  },
  {
    id: 'incident-4',
    patientName: 'Robert Hayes',
    patientId: 'patient-4',
    type: 'missed-visit',
    severity: 'high',
    title: 'Missed afternoon visit - no check-in',
    description: 'Carer (David Smith) scheduled for 2:00 PM visit never checked in. No contact with patient until evening.',
    dateTime: new Date('2024-06-13 14:00'),
    reportedBy: 'Manager System (Auto-alert)',
    assignedTo: 'John Manager',
    status: 'resolved',
    location: '321 Oak Road, Patient Home',
    witnesses: [],
    evidence: [],
    investigationNotes: [
      {
        note: 'Auto-alert: No check-in by 14:30. Manager notified. Called carer David Smith.',
        author: 'System',
        timestamp: new Date('2024-06-13 14:30'),
      },
      {
        note: 'David reported car breakdown en route. Did not have phone signal to notify manager. Visit rescheduled for 6:00 PM same day.',
        author: 'John Manager',
        timestamp: new Date('2024-06-13 15:00'),
      },
      {
        note: 'Patient was safe. Rescheduled visit completed. Action: Upgrade carer comms - backup phone or radio.',
        author: 'John Manager',
        timestamp: new Date('2024-06-13 19:00'),
      },
    ],
    nextReviewDate: undefined,
    createdAt: new Date('2024-06-13 14:00'),
    updatedAt: new Date('2024-06-13 19:00'),
  },
];