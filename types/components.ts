import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import type { BadgeProps } from "@/components/ui";

export interface StatCardProps {
    label : string;
    Icon : LucideIcon;
    value : string;
    description : string;
    trend? : StatCardTrend;
    showTrend? : boolean;
    showScore? : boolean;
    score?: number;
    hasCqcScore? : boolean;
    cqcScore?: number;
    hasValueBadge?: boolean;
    valueBadgeValue?: string;
    children?: React.ReactNode    
    badgeVariant?: BadgeProps["variant"]; 
}

export type StatCardTrend = 'up' | 'down' | 'neutral'

export interface PageBreadcrumbProps {
    previousPage : string;
    currentPage : string;
    icon: LucideIcon
}

export type StaffMember = {
  id: string;                    // agency_memberships.id
  userId: string;                // agency_memberships.userId
  name: string;                  // users.fullName
  email: string;                 // users.email
  phone?: string | null;         // users.phone
  profilePicture?: string | null; // users.picture
  role: string;
  status: EmployeeStatus;        // agency_memberships.status
  joinDate: Date | string;       // agency_memberships.acceptedAt or createdAt
  invitedBy: string | null;      // agency_memberships.invitedBy
  invitedAt: Date | null;        // agency_memberships.invitedAt
  acceptedAt: Date | null;       // agency_memberships.acceptedAt
  createdAt: Date;               // agency_memberships.createdAt
  updatedAt: Date;               // agency_memberships.updatedAt
  deletedAt: Date | null;        // agency_memberships.deletedAt
  userStatus: string;            // users.status
  emailVerified: boolean;        // users.emailVerified
};

export interface StaffTableProps {
  data: StaffMember[];
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: string) => void;
  onView?: (staff: StaffMember) => void;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type PermissionSource = 'role' | 'grant' | 'block';

export interface Permission {
  module: string;
  action: string;
  source: PermissionSource;
}

export interface GroupedPermission {
  module: string;
  displayName: string;
  icon: string;
  actions: {
    action: string;
    displayName: string;
    source: 'role' | 'grant' | 'block';
    isGranted: boolean;
  }[];
  granted: number;
  total: number;
  isAllGranted: boolean;
  isPartiallyGranted: boolean;
}

export interface Patient {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  address: string;
  email: string;
  phone: string;
  carer: string;
  status: 'active' | 'on-hold' | 'new' | 'discharged';
  dischargeDetails?: any;  
  nextVisit: string;
  gpName?: string;
  gpPhone?: string;
  gpAddress?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  risk: 'low' | 'medium' | 'high';
  initials: string;
  avatar?: string;
  age: number;
}

export interface Visit {
  id: string;
  patientName: string;
  patientId: string;
  carerName: string;
  carerId: string;
  startTime: string;
  endTime: string;
  date: string;
  type: string;
  status: string;
  address: string;
}

export interface PersonalCareContent {
  type: 'personal-care';
  mobilityLevel: 'independent' | 'supervision' | 'assistance' | 'total-dependence';
  personalHygiene: {
    bathing: string;
    toileting: string;
    dressing: string;
    grooming: string;
  };
  continenceSupport: {
    status: 'continent' | 'incontinent' | 'managed';
    plan: string;
  };
  skinIntegrity: {
    pressure_ulcer_risk: 'low' | 'medium' | 'high';
    preventionMeasures: string[];
  };
  preferences: string[];
  goals: string[];
  notes: string;
}

export interface MedicationContent {
  type: 'medication';
  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    indication: string;
    sideEffects: string[];
  }[];
  medicationAdherenceLevel: 'excellent' | 'good' | 'fair' | 'poor';
  administrationMethod: string;
  interactions: string[];
  storageRequirements: string;
  prescriber: string;
  lastReviewDate: string;
  nextReviewDate: string;
  goals: string[];
  notes: string;
}

export interface DementiaContent {
  type: 'dementia';
  dementiaType: string;
  stageOfDementia: 'early' | 'middle' | 'late';
  cognitiveAbilities: {
    memory: string;
    communication: string;
    problemSolving: string;
    orientation: string;
  };
  behavioralChallenges: {
    behavior: string;
    trigger: string;
    strategy: string;
  }[];
  calmingStrategies: string[];
  environmentalModifications: string[];
  communicationApproach: string;
  familyInvolvement: string;
  goals: string[];
  notes: string;
}

export interface NutritionContent {
  type: 'nutrition';
  MUSTScore: number; // Malnutrition Universal Screening Tool
  nutritionStatus: 'adequate' | 'at-risk' | 'malnourished';
  dietaryType: 'normal' | 'modified-texture' | 'pureed' | 'soft' | 'therapeutic';
  foodPreferences: string[];
  dislikesAndAllergies: {
    item: string;
    type: 'allergy' | 'intolerance' | 'dislike';
  }[];
  swallowingDifficulties: boolean;
  swallowingPlan: string;
  mealTimes: string;
  fluidIntake: {
    recommended: string;
    method: string;
  };
  supplementation: string;
  appetiteChanges: string;
  goals: string[];
  notes: string;
}

export interface MobilityContent {
  type: 'mobility';
  mobilityStatus: 'independent' | 'supervision' | 'assistance' | 'total-dependence';
  fallRisk: 'low' | 'medium' | 'high';
  fallRiskFactors: string[];
  mobilityAids: {
    aid: string;
    type: 'walking' | 'balance' | 'transfer' | 'wheelchair';
  }[];
  transferNeeds: {
    type: 'bed-transfer' | 'chair-transfer' | 'toilet-transfer' | 'bath-transfer';
    assistance: 'supervision' | '1-person' | '2-person' | 'hoist';
  }[];
  preventionMeasures: string[];
  physicalTherapy: string;
  exercisePlan: string;
  goals: string[];
  notes: string;
}

export interface MentalHealthContent {
  type: 'mental-health';
  mentalHealthStatus: string;
  diagnosedConditions: string[];
  currentMood: string;
  stressorsAndTriggers: string[];
  copingStrategies: string[];
  supportNetwork: string;
  socialActivities: string[];
  hobbiesAndInterests: string[];
  motivationLevel: 'high' | 'moderate' | 'low';
  selfCareAbility: string;
  goals: string[];
  notes: string;
}

export interface CarePlanModule {
  id: string;
  name: string;
  type: CarePlanType;
  status: CarePlanStatus;
  reviewStatus: CarePlanReviewStatus;
  version: string;
  createdDate: string;
  reviewDate: string;
  nextReviewDate: string;
  createdBy: string;
  lastReviewedBy: string;
  content: CarePlanModuleContent;
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  patientDOB: string;
  patientAddress: string;
  nhs_number?: string;
  keyWorker: string;
  keyWorkerContact: string;
  modules: CarePlanModule[];
  overallStatus: 'draft' | 'in-review' | 'approved';
  createdDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  createdBy: string;
}




export interface CarePlanBlock {
  id: string;
  patientName: string;
  patientId: string;
  type: CarePlanType;
  status: CarePlanStatus;
  reviewStatus: CarePlanReviewStatus;
  version: string;
  lastReviewed: Date;
  nextReviewDate: Date;
  carer: string;
  score?: number;
  moduleCount: number;
  lastUpdated: Date;
}

export type CreationStep = 'select-type' | 'fill-details' | 'review-submit';

export interface ModuleCreationData {
  patientId : string;
  type: CarePlanType;
  name: string;
  content: CarePlanModuleContent; // Will be typed based on module type
  status: 'draft' | 'in-review' | 'approved';
  reviewStatus: 'current' | 'overdue' | 'reviewed' | 'needs-change';
  createdBy: string;
  version?: string;
}

// Module-specific creation data types
export interface PersonalCareCreationData {
  mobilityLevel: 'independent' | 'supervision' | 'assistance' | 'total-dependence';
  personalHygiene: {
    bathing: string;
    toileting: string;
    dressing: string;
    grooming: string;
  };
  continenceSupport: {
    status: 'continent' | 'incontinent' | 'managed';
    plan: string;
  };
  skinIntegrity: {
    pressure_ulcer_risk: 'low' | 'medium' | 'high';
    preventionMeasures: string[];
  };
  preferences: string[];
  goals: string[];
  notes: string;
}

export interface MedicationCreationData {
  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    indication: string;
    sideEffects: string[];
  }[];
  medicationAdherenceLevel: 'excellent' | 'good' | 'fair' | 'poor';
  administrationMethod: string;
  interactions: string[];
  storageRequirements: string;
  prescriber: string;
  goals: string[];
  notes: string;
}

export type IncidentType = 
  | 'fall' 
  | 'medication-error' 
  | 'bruise' 
  | 'abuse-allegation' 
  | 'safeguarding' 
  | 'missed-visit' 
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';

export interface Incident {
  id: string;
  patientName: string;
  patientId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description: string;
  dateTime: Date;
  reportedBy: string;
  assignedTo: string;
  status: IncidentStatus;
  location?: string;
  witnesses?: string[];
  evidence?: string[]; 
  investigationNotes: {
    note: string;
    author: string;
    timestamp: Date;
  }[];
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}


export type CarePlanModuleContent =
  | PersonalCareContent
  | MedicationContent
  | DementiaContent
  | NutritionContent
  | MobilityContent
  | MentalHealthContent;

export type CarePlanReviewStatus = 'current' | 'overdue' | 'reviewed' | 'needs-change';
export type CarePlanStatus = 'draft' | 'in-review' | 'approved';
export type CarePlanType = 'personal-care' | 'medication' | 'dementia' | 'nutrition' | 'mobility' | 'mental-health';

export type SortField = keyof StaffMember;
export type SortDirection = "asc" | "desc";
export type EmployeeStatus = 'ACTIVE' | 'SUSPENDED' | 'ON_LEAVE' | 'TERMINATED' 