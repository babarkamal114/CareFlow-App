import type { StaffDrawerTabId } from "utils";
import type { MockStaffProfile } from "lib";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { TRAINING_MODULES } from "utils";
import type {
  Address,
  AvailabilitySlot,
  ComplianceResult,
  DbsSection,
  DrivingSection,
  EmergencyContact,
  EmploymentType,
  InterimCertificate,
  Qualification,
  Referee,
  RtwSection,
  SortField,
  StaffDocument,
  StaffDocumentType,
  StaffFormData,
  StaffFormErrors,
  StaffFormStep,
  StaffMember,
  TrainingRecord,
} from "types";


export interface AvailabilityTabProps {
  staffMembers: StaffMember[];
}

export interface EditStaffModalProps {
  staff: StaffMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: Partial<StaffMember>) => Promise<void>;
}

export interface PerformanceTabProps {
  staffMembers: StaffMember[];
}

export interface PermissionActionsProps {
  module: { id: string; label: string; actions: string[] };
  current: string[];
  isAll: boolean;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

export interface PermissionRowProps {
  module: { id: string; label: string; actions: string[] };
  permissions: Record<string, string[]>;
  isExpanded: boolean;
  onToggleModule: (id: string) => void;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

export interface PermissionsAlertsProps {
  error: string | null;
  success: boolean;
}

export interface PermissionsBodyProps {
  permissions: Record<string, string[]>;
  expandedModules: Set<string>;
  onToggleModule: (id: string) => void;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
  error: string | null;
  success: boolean;
}

export interface PermissionsListProps {
  permissions: Record<string, string[]>;
  expandedModules: Set<string>;
  onToggleModule: (id: string) => void;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

export interface PermissionsModalProps {
  staff: StaffMember;
  defaultPermissions?: Array<{ module: string; action: string; source?: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { permissions: Record<string, string[]> }) => Promise<void>;
  isLoading?: boolean;
  isSuccess: boolean;
}

export interface ReviewSectionProps {
  data: StaffFormData;
  errors: StaffFormErrors;
  compliance: ComplianceResult;
  managerName?: string;
  onEdit: (stepNumber: number) => void;
  onConfirmChange: (confirmed: boolean) => void;
}

export interface SortableHeaderProps {
  field: SortField;
  label: string;
  active: boolean;
  onSort: (field: SortField) => void;
}

export interface StaffActivityItem {
  action: string;
  timestamp: Date | string | null | undefined;
  icon: LucideIcon;
  tone: StaffActivityTone;
}

export interface StaffActivityTabProps {
  staff: StaffMember;
}

export type StaffActivityTone = 'default' | 'success' | 'info' | 'danger';

export interface StaffAvailabilityTabProps {
  profile: MockStaffProfile;
}

export interface StaffDetailsTabProps {
  staff: StaffMember;
}

export interface StaffDocumentsTabProps {
  profile: MockStaffProfile;
}

export interface StaffDrawerActionsProps {
  onEmail: () => void;
  onSms: () => void;
  onClose: () => void;
}

export interface StaffDrawerHeaderProps {
  staff: StaffMember;
  employmentType?: EmploymentType | '';
  compliance: ComplianceResult;
  onEmail: () => void;
  onSms: () => void;
  onClose: () => void;
}

export interface StaffDrawerTabsProps {
  value: StaffDrawerTabId;
  onValueChange: (value: StaffDrawerTabId) => void;
  counts?: Partial<Record<StaffDrawerTabId, number>>;
}

export interface StaffEmploymentTabProps {
  profile: MockStaffProfile;
  managerName?: string;
}

export interface StaffFormSectionProps {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export interface StaffPermissionTabProps {
  staff: StaffMember;
  agencyId: string;
  accessToken: string;
  onSavePermissions: (data: { permissions: Record<string, string[]> }) => Promise<void>;
  isSavingPermissions: boolean;
  isSuccess: boolean;

}

export interface StaffProfileTabProps {
  staff: StaffMember;
  profile: MockStaffProfile;
}

export interface StaffToolbarProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface StaffTrainingTabProps {
  profile: MockStaffProfile;
}

export interface StaffVettingTabProps {
  profile: MockStaffProfile;
}

export interface StaffViewDrawerProps {
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface TableActionsProps {
  staff: StaffMember;
  onView?: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: string) => void;
}

export interface TableBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
}

export interface TrainingMatrixTabProps {
  staffMembers: StaffMember[];
}

// ---------------------------------------------------------------------------
// Shared types used by the staff hooks / helpers
// ---------------------------------------------------------------------------

export interface PermissionModule {
  id: string;
  label: string;
  actions: string[];
}

/** moduleId -> list of granted actions */
export type PermissionsMap = Record<string, string[]>;

export interface DefaultPermission {
  module: string;
  action: string;
  source?: string;
}

export interface EditStaffFormValues {
  name: string;
  email: string;
  phone: string;
}

// ---------------------------------------------------------------------------
// Training & documents
// ---------------------------------------------------------------------------

/** One of the mandatory training modules (derived from the TRAINING_MODULES constant). */
export type TrainingModule = (typeof TRAINING_MODULES)[number];

/** A document type plus the hint shown next to it in the documents step. */
export interface DocumentTypeGuideItem {
  type: StaffDocumentType;
  hint: string;
}

// ---------------------------------------------------------------------------
// Props for the staff ui components (add-staff form fields, review blocks, skeletons)
// ---------------------------------------------------------------------------

export interface StaffAddressFieldsProps {
  address: Address;
  errors: StaffFormErrors;
  onChange: (address: Address) => void;
}

export interface StaffAvailabilitySlotFieldsProps {
  slot: AvailabilitySlot;
  index: number;
  errors: StaffFormErrors;
  onChange: (slot: AvailabilitySlot) => void;
  onRemove: () => void;
}

export interface StaffComplianceSummaryProps {
  compliance: ComplianceResult;
}

export interface StaffDbsFieldsProps {
  value: DbsSection;
  errors: StaffFormErrors;
  onChange: (value: DbsSection) => void;
}

export interface StaffDocumentRowProps {
  document: StaffDocument;
  onTypeChange: (type: StaffDocumentType) => void;
  onRemove: () => void;
}

export interface StaffDrivingFieldsProps {
  value: DrivingSection;
  errors: StaffFormErrors;
  onChange: (value: DrivingSection) => void;
}

export interface StaffEmergencyContactFieldsProps {
  contact: EmergencyContact;
  errors: StaffFormErrors;
  onChange: (contact: EmergencyContact) => void;
}

export interface StaffFormErrorBannerProps {
  errors: Record<string, string | undefined>;
  title?: string;
}

export interface StaffFormFieldRowProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export interface StaffFormFileUploadProps {
  id: string;
  fileName?: string;
  url?: string;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  onSelect: (file: File) => void;
  onClear?: () => void;
}

export interface StaffFormReviewGroupProps {
  title: string;
  stepNumber?: number;
  onEdit?: () => void;
  children: ReactNode;
}

export interface StaffFormReviewItemProps {
  label: string;
  value: ReactNode;
}

export interface StaffFormSectionLabelProps {
  children: ReactNode;
}

export interface StaffFormStatusBadgeProps {
  status: "green" | "amber" | "red" | "neutral";
  children: ReactNode;
}

export interface StaffFormStepDotsProps {
  current: number;
  total: number;
}

export interface StaffFormStepRailProps {
  steps: StaffFormStep[];
  current: number;
  onSelect: (index: number) => void;
}

export interface StaffFormTagInputProps {
  id: string;
  values: string[];
  suggestions?: readonly string[];
  placeholder?: string;
  error?: string;
  onChange: (values: string[]) => void;
}

export interface StaffInterimCertificateFieldsProps {
  value: InterimCertificate;
  errors: StaffFormErrors;
  onChange: (value: InterimCertificate) => void;
}

export interface StaffQualificationFieldsProps {
  qualification: Qualification;
  index: number;
  errors: StaffFormErrors;
  onChange: (qualification: Qualification) => void;
  onRemove: () => void;
}

export interface StaffRefereeFieldsProps {
  referee: Referee;
  index: number;
  errors: StaffFormErrors;
  onChange: (referee: Referee) => void;
  onRemove: () => void;
}

export interface StaffReviewComplianceProps {
  data: StaffFormData;
  compliance: ComplianceResult;
  onEdit?: () => void;
}

export interface StaffConfirmGateProps {
  confirmed: boolean;
  error?: string;
  onChange: (confirmed: boolean) => void;
}

export interface StaffSchedulingNoticeProps {
  canBeScheduled: boolean;
}

export interface StaffReviewDocumentsProps {
  data: StaffFormData;
  onEdit?: () => void;
}

export interface StaffReviewEmploymentProps {
  data: StaffFormData;
  compliance: ComplianceResult;
  managerName?: string;
  onEdit?: () => void;
}

export interface StaffReviewPersonalProps {
  data: StaffFormData;
  onEdit?: () => void;
}

export interface StaffReviewSkillsProps {
  data: StaffFormData;
  onEdit?: () => void;
}

export interface StaffReviewTrainingProps {
  data: StaffFormData;
  onEdit?: () => void;
}

export interface StaffRightToWorkFieldsProps {
  value: RtwSection;
  errors: StaffFormErrors;
  onChange: (value: RtwSection) => void;
}

export interface StaffTableSkeletonProps {
  rows?: number;
}

export interface StaffTrainingRecordFieldsProps {
  record: TrainingRecord;
  index: number;
  errors: StaffFormErrors;
  onChange: (record: TrainingRecord) => void;
  onRemove: () => void;
}
