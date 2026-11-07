import { INITIAL_STAFF_FORM_DATA } from "types";
import type {
  DefaultPermission,
  EmployeeStatus,
  PermissionModule,
  PermissionsMap,
  Referee,
  SortDirection,
  SortField,
  StaffFormData,
  StaffMember,
  TrainingRecord,
} from "types";
import type { BadgeProps } from "@/components/ui";
import { STATUS_DOT_TONE, TAB_GAP } from "utils";
import { formatDate } from "./date-utils";

// ---------------------------------------------------------------------------
// Form data, performance, drawer header & tabs
// ---------------------------------------------------------------------------

export function cloneInitialData(): StaffFormData {
  return {
    ...INITIAL_STAFF_FORM_DATA,
    address: { ...INITIAL_STAFF_FORM_DATA.address },
    emergencyContact: { ...INITIAL_STAFF_FORM_DATA.emergencyContact },
    rightToWork: { ...INITIAL_STAFF_FORM_DATA.rightToWork },
    dbs: { ...INITIAL_STAFF_FORM_DATA.dbs },
    driving: { ...INITIAL_STAFF_FORM_DATA.driving },
    referees: [],
    qualifications: [],
    mandatoryTraining: [],
    languages: [],
    skills: [],
    availability: [],
    documents: [],
  };
}

export function metricColor(pct: number) {
  if (pct >= 90) return "text-green-700";
  if (pct >= 75) return "text-amber-700";
  return "text-red-700";
}

export function getStatusDotTone(status: string) {
  return STATUS_DOT_TONE[status as keyof typeof STATUS_DOT_TONE] ?? "amber";
}

export function isMeasurementStale(widths: number[], measured: number[]): boolean {
  return widths.some((width, position) => width !== measured[position]);
}

export function getFittingTabCount(
  widths: number[],
  availableWidth: number,
  reservedWidth: number
): number {
  const fullWidth =
    widths.reduce((total, width) => total + width, 0) +
    TAB_GAP * Math.max(widths.length - 1, 0);

  if (fullWidth <= availableWidth) return widths.length;

  const budget = availableWidth - reservedWidth;
  let used = 0;
  let visible = 0;

  for (const width of widths) {
    const next = visible === 0 ? width : used + TAB_GAP + width;
    if (next > budget) break;
    used = next;
    visible += 1;
  }

  return Math.max(visible, 1);
}

// ---------------------------------------------------------------------------
// Permissions, staff table & form helpers
// ---------------------------------------------------------------------------

export function buildInitialPermissions(
  modules: PermissionModule[],
  defaults: DefaultPermission[]
): PermissionsMap {
  const initial: PermissionsMap = {};

  modules.forEach((module) => {
    initial[module.id] = [];
  });

  defaults.forEach((perm) => {
    if (perm.source === "block") return;
    if (!initial[perm.module]) initial[perm.module] = [];
    if (!initial[perm.module].includes(perm.action)) initial[perm.module].push(perm.action);
  });

  return initial;
}

export function togglePermissionAction(
  prev: PermissionsMap,
  moduleId: string,
  action: string
): PermissionsMap {
  const current = prev[moduleId] || [];
  const updated = current.includes(action)
    ? current.filter((a) => a !== action)
    : [...current, action];
  return { ...prev, [moduleId]: updated };
}

export function toggleAllModuleActions(
  prev: PermissionsMap,
  module: PermissionModule
): PermissionsMap {
  const current = prev[module.id] || [];
  const allGranted = module.actions.every((a) => current.includes(a));
  return { ...prev, [module.id]: allGranted ? [] : [...module.actions] };
}

export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function buildPermissionMap(
  data?: Array<{ module: string; action: string; source: string }>
): Map<string, string> {
  const map = new Map<string, string>();
  data?.forEach((perm) => map.set(`${perm.module}:${perm.action}`, perm.source));
  return map;
}

export function hasPermission(
  map: Map<string, string>,
  module: string,
  action: string
): boolean {
  const source = map.get(`${module.toLowerCase()}:${action}`);
  return source !== undefined && source !== "block";
}

export function countConfiguredModules(
  modules: PermissionModule[],
  map: Map<string, string>
): number {
  return modules.filter((module) =>
    module.actions.some((action) => hasPermission(map, module.id, action))
  ).length;
}

export const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export function sortStaff(
  data: StaffMember[],
  field: SortField,
  direction: SortDirection
): StaffMember[] {
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });
}

export function getModuleGrantSummary(module: PermissionModule, permissions: PermissionsMap) {
  const current = permissions[module.id] || [];
  return {
    current,
    isAll: module.actions.every((a) => current.includes(a)),
    hasAny: current.length > 0,
    granted: current.length,
    total: module.actions.length,
  };
}

export function getErrorMessages(errors: Record<string, string | undefined>): string[] {
  return Object.values(errors).filter((message): message is string => Boolean(message));
}

export function countCompletedTraining(records: TrainingRecord[]): number {
  return records.filter((record) => record.status === "completed").length;
}

export function countReceivedReferences(referees: Referee[]): number {
  return referees.filter((referee) => referee.referenceReceived).length;
}


export function includesIgnoreCase(values: readonly string[], value: string): boolean {
  return values.some((existing) => existing.toLowerCase() === value.toLowerCase());
}

export function getAvailableSuggestions(
  suggestions: readonly string[],
  values: readonly string[]
): string[] {
  return suggestions.filter((suggestion) => !includesIgnoreCase(values, suggestion));
}

// ---------------------------------------------------------------------------
// Staff table badges, roles & phone (was staff-table-utils)
// ---------------------------------------------------------------------------

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "super_admin":
      return "pastel-danger";
    case "agency_admin":
      return "pastel-purple";
    case "manager":
      return "pastel-info";
    case "coordinator":
      return "pastel-warning";
    case "carer":
      return "pastel-success";
    case "patient":
      return "pastel-neutral";
    default:
      return "pastel-neutral";
  }
};
export const getStatusBadgeColor = (status: string): BadgeProps['variant'] => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'pastel-success';
    case 'inactive':
      return 'pastel-neutral';
    case 'pending':
      return 'pastel-warning';
    case 'suspended':
      return 'pastel-danger';
    default:
      return 'pastel-neutral';
  }
};

export const getRoleDisplayName = (role: string): string => {
  const names: Record<string, string> = {
    super_admin: 'Super Admin',
    agency_admin: 'Agency Admin',
    manager: 'Manager',
    coordinator: 'Coordinator',
    carer: 'Carer',
    patient: 'Patient',
  };
  return names[role?.toLowerCase()] || role;
};


export const formatUKPhone = (phone: string) => {
  
    const cleaned = phone.replace(/\D/g, "");
  
    if (cleaned.startsWith("07") && cleaned.length === 11) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    
  
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
    }
    if (cleaned.length > 6) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    }
  
    return phone;
  };

export const employeeStatusConfig: Record<EmployeeStatus, {
  variant: "pastel-success" | "pastel-danger" | "pastel-warning" | "pastel-info";
  label: string;
}> = {
  ACTIVE: {
    variant: "pastel-success",
    label: "Active",
  },
  SUSPENDED: {
    variant: "pastel-danger",
    label: "Suspended",
  },
  ON_LEAVE: {
    variant: "pastel-warning",
    label: "On Leave",
  },
  TERMINATED: {
    variant: "pastel-info",
    label: "Terminated",
  },
};

export function getEmployeeStatusConfig(status: EmployeeStatus) {
  return employeeStatusConfig[status] || {
    variant: "pastel-info",
    label: status || "Unknown",
  };
}

export function getEmployeeStatusVariant(status: EmployeeStatus) {
  return getEmployeeStatusConfig(status).variant;
}

export function getEmployeeStatusLabel(status: EmployeeStatus) {
  return getEmployeeStatusConfig(status).label;
}

// ---------------------------------------------------------------------------
// Review step formatting (was staff-review-format)
// ---------------------------------------------------------------------------

/** Review surfaces show an em dash instead of the global "N/A" fallback. */
export function formatStaffDate(
  value: Date | string | null | undefined
): string {
  if (!value) return "—";
  return formatDate(value);
}

export function formatStaffAddress(data: StaffFormData): string {
  const { line1, line2, city, postcode } = data.address;
  const formatted = [line1, line2, city, postcode].filter(Boolean).join(", ");
  return formatted || "—";
}

export function formatStaffList(values: string[]): string {
  if (values.length === 0) return "—";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} & ${values[values.length - 1]}`;
}

export function formatStaffPayRate(
  rate: number | ""
): string {
  if (rate === "") return "—";
  return `£${Number(rate).toFixed(2)} / hour`;
}

export function formatStaffHours(hours: number | ""): string {
  if (hours === "") return "—";
  return `${hours} hrs / week`;
}