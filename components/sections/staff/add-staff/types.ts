export type StaffRole = "carer" | "manager" | "admin" | "supervisor";
export type EmploymentType = "full_time" | "part_time" | "casual";
export type RefRelationship = "previous_employer" | "colleague" | "other";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  niNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface EmploymentInfo {
  role: StaffRole | "";
  startDate: string;
  employmentType: EmploymentType | "";
  hoursPerWeek: string;
  rightToWorkVerified: boolean;
  rightToWorkFileName: string;
  isOverseasWorker: boolean | null;
  goodConductFileName: string;
  ref1Name: string;
  ref1Contact: string;
  ref1Relationship: RefRelationship | "";
  ref2Name: string;
  ref2Contact: string;
  ref2Relationship: RefRelationship | "";
}

export interface AddStaffFormData {
  personal: PersonalInfo;
  employment: EmploymentInfo;
  confirmed: boolean;
}

export const INITIAL_DATA: AddStaffFormData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    niNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  },
  employment: {
    role: "",
    startDate: "",
    employmentType: "",
    hoursPerWeek: "",
    rightToWorkVerified: false,
    rightToWorkFileName: "",
    isOverseasWorker: null,
    goodConductFileName: "",
    ref1Name: "",
    ref1Contact: "",
    ref1Relationship: "",
    ref2Name: "",
    ref2Contact: "",
    ref2Relationship: "",
  },
  confirmed: false,
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  carer: "Carer",
  manager: "Manager",
  admin: "Admin",
  supervisor: "Supervisor",
};

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  casual: "Casual",
};

export const REF_LABELS: Record<RefRelationship, string> = {
  previous_employer: "Previous Employer",
  colleague: "Colleague",
  other: "Other",
};

export const STEP_TITLES = [
  "Personal Information",
  "Employment & Pre-Employment Checks",
  "Review & Confirm",
];
