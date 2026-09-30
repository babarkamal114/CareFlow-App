import type { CSSProperties } from "react";
import type { Variants } from "framer-motion";
import type { BadgeProps } from "@/components/ui";
import {
  FileText,
  Lock,
  Clock,
  Mail,
  MessageSquare,
  KeyRound,
  Send,
  type LucideIcon,
} from "lucide-react";
import type {
  EmployeeStatus,
  SortDirection,
  SortField,
  StaffMember,
} from "types";
import { checkHasPermission, type RawPermission } from "./permission-constants";

type BadgeVariant = BadgeProps["variant"];

const roleBadgeConfig: Record<string, BadgeVariant> = {
  super_admin: "pastel-danger",
  agency_admin: "pastel-purple",
  manager: "pastel-info",
  coordinator: "pastel-warning",
  carer: "pastel-success",
  patient: "pastel-neutral",
};

export const getRoleBadgeColor = (role: string): BadgeVariant =>
  roleBadgeConfig[role] ?? "pastel-neutral";

const statusBadgeConfig: Record<string, BadgeVariant> = {
  active: "pastel-success",
  inactive: "pastel-neutral",
  pending: "pastel-warning",
  suspended: "pastel-danger",
};

export const getStatusBadgeColor = (status: string): BadgeVariant =>
  statusBadgeConfig[status?.toLowerCase()] ?? "pastel-neutral";

const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin",
  agency_admin: "Agency Admin",
  manager: "Manager",
  coordinator: "Coordinator",
  carer: "Carer",
  patient: "Patient",
};

export const getRoleDisplayName = (role: string): string =>
  roleDisplayNames[role?.toLowerCase()] || role;

export interface EmployeeStatusConfig {
  variant: "pastel-success" | "pastel-danger" | "pastel-warning" | "pastel-info";
  label: string;
}

export const employeeStatusConfig: Record<EmployeeStatus, EmployeeStatusConfig> = {
  ACTIVE: { variant: "pastel-success", label: "Active" },
  SUSPENDED: { variant: "pastel-danger", label: "Suspended" },
  ON_LEAVE: { variant: "pastel-warning", label: "On Leave" },
  TERMINATED: { variant: "pastel-info", label: "Terminated" },
};

export function getEmployeeStatusConfig(status: EmployeeStatus): EmployeeStatusConfig {
  return (
    employeeStatusConfig[status] || {
      variant: "pastel-info",
      label: status || "Unknown",
    }
  );
}

export function getEmployeeStatusVariant(status: EmployeeStatus) {
  return getEmployeeStatusConfig(status).variant;
}

export function getEmployeeStatusLabel(status: EmployeeStatus) {
  return getEmployeeStatusConfig(status).label;
}

export const statusDotClassConfig: Record<string, string> = {
  ACTIVE: "bg-success",
  PENDING: "bg-warning",
  INVITED: "bg-warning",
  SUSPENDED: "bg-cf-ink-40",
  INACTIVE: "bg-cf-ink-40",
};

export function getStatusDotClass(status: string): string {
  return statusDotClassConfig[status?.toUpperCase()] ?? "bg-cf-ink-20";
}


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

export function getStaffInitials(name: string, maxLetters = 1): string {
  if (maxLetters === 1) return name.charAt(0).toUpperCase();
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLetters);
}

export function formatJoinDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GB");
}


export interface StaffTableColumn {
  id: string;
  label: string;
  sortField?: SortField;
  className?: string;
}

export const STAFF_TABLE_COLUMNS: StaffTableColumn[] = [
  { id: "employee", label: "Employee", sortField: "name" },
  { id: "contact", label: "Contact Info" },
  { id: "role", label: "Role", sortField: "role" },
  { id: "employment", label: "Employment" },
  { id: "compliance", label: "Compliance" },
  { id: "status", label: "Status", sortField: "status" },
  { id: "joinDate", label: "Join Date", sortField: "joinDate" },
  { id: "actions", label: "Actions", className: "w-12" },
];

/** +1 for the checkbox column. */
export const STAFF_TABLE_COLUMN_COUNT = STAFF_TABLE_COLUMNS.length + 1;
export const STAFF_TABLE_EMPTY_MESSAGE = "No staff members found";

export interface StaffSortState {
  field: SortField;
  direction: SortDirection;
}

export const DEFAULT_STAFF_SORT: StaffSortState = { field: "name", direction: "asc" };

export function getNextSort(current: StaffSortState, field: SortField): StaffSortState {
  if (current.field === field) {
    return { field, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { field, direction: "asc" };
}

export function sortStaff(
  data: StaffMember[],
  field: SortField,
  direction: SortDirection,
): StaffMember[] {
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });
}

export function toggleRowSelection(
  selected: Set<string>,
  id: string,
  checked: boolean,
): Set<string> {
  const next = new Set(selected);
  if (checked) next.add(id);
  else next.delete(id);
  return next;
}

export function selectAllRows(data: StaffMember[], checked: boolean): Set<string> {
  return checked ? new Set(data.map((s) => s.id)) : new Set();
}

export function getSelectionState(selectedCount: number, total: number) {
  return {
    allSelected: total > 0 && selectedCount === total,
    someSelected: selectedCount > 0 && selectedCount < total,
  };
}

export const EMPLOYED_TYPE = "employed";

export function isEmployedType(employmentType: string): boolean {
  return employmentType === EMPLOYED_TYPE;
}

export type StaffViewTabId = "details" | "permissions" | "activity" | "documents";

export interface StaffViewTab {
  id: StaffViewTabId;
  label: string;
  icon: LucideIcon;
}

export const STAFF_VIEW_TABS: StaffViewTab[] = [
  { id: "details", label: "Details", icon: FileText },
  { id: "permissions", label: "Permissions", icon: Lock },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
];

export const DEFAULT_STAFF_VIEW_TAB: StaffViewTabId = "details";

export const staffTabContentVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};


export function getMailtoHref(email?: string | null): string | undefined {
  return email ? `mailto:${email}` : undefined;
}

export interface StaffQuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  getHref?: (staff: StaffMember) => string | undefined;
}

export const STAFF_QUICK_ACTIONS: StaffQuickAction[] = [
  { id: "email", label: "Send email", icon: Mail, getHref: (staff) => getMailtoHref(staff.email) },
  { id: "sms", label: "Send SMS", icon: MessageSquare },
];

export const STAFF_QUICK_ACTION_CLASS =
  "rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-muted hover:text-foreground active:scale-95";

export interface StaffFooterAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const STAFF_FOOTER_ACTIONS: StaffFooterAction[] = [
  { id: "reset-password", label: "Reset password", icon: KeyRound },
  { id: "resend-invitation", label: "Resend invitation", icon: Send },
];

export const STAFF_FOOTER_BUTTON_CLASS =
  "border-border text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground active:translate-y-0";


export type PermissionAction = "read" | "create" | "update" | "delete" | "all";

export interface PermissionModule {
  id: string;
  label?: string;
  actions: readonly string[];
}

export const MOCK_USER_PERMISSIONS: RawPermission[] = [
  { module: "dashboard", action: "read", source: "role" },
  { module: "patients", action: "read", source: "role" },
  { module: "patients", action: "create", source: "role" },
  { module: "patients", action: "update", source: "role" },
  { module: "schedule", action: "read", source: "role" },
  { module: "schedule", action: "create", source: "user" },
  { module: "schedule", action: "update", source: "user" },
  { module: "schedule", action: "delete", source: "user" },
  { module: "visits", action: "read", source: "role" },
  { module: "staff", action: "read", source: "role" },
  { module: "reports", action: "read", source: "role" },
  { module: "finance", action: "read", source: "block" },
];

const CHECKBOX_BASE_CLASS =
  "mx-auto transition-transform duration-150 data-checked:scale-110";

export interface PermissionActionColumn {
  action: PermissionAction;
  checkboxClassName: string;
}

export const PERMISSION_ACTION_COLUMNS: PermissionActionColumn[] = [
  { action: "read", checkboxClassName: CHECKBOX_BASE_CLASS },
  { action: "create", checkboxClassName: CHECKBOX_BASE_CLASS },
  { action: "update", checkboxClassName: CHECKBOX_BASE_CLASS },
  { action: "delete", checkboxClassName: CHECKBOX_BASE_CLASS },
  {
    action: "all",
    checkboxClassName: `${CHECKBOX_BASE_CLASS} data-checked:border-primary data-checked:bg-primary`,
  },
];

export const DISABLED_CHECKBOX_CLASS = "mx-auto";

export interface PermissionCell {
  action: PermissionAction;
  supported: boolean;
  checked: boolean;
  checkboxClassName: string;
}

export interface PermissionRow {
  id: string;
  label: string;
  showNoAccess: boolean;
  cells: PermissionCell[];
}

export function buildPermissionRows(
  modules: readonly PermissionModule[],
  permissionMap: Map<string, string>,
): PermissionRow[] {
  return modules.map((module) => {
    const cells = PERMISSION_ACTION_COLUMNS.map((col) => ({
      action: col.action,
      supported: module.actions.includes(col.action),
      checked: checkHasPermission(permissionMap, module.id, col.action),
      checkboxClassName: col.checkboxClassName,
    }));
    const grantedCount = cells.filter((c) => c.action !== "all" && c.checked).length;
    const hasAll = cells.some((c) => c.action === "all" && c.checked);
    return {
      id: module.id,
      label: module.label ?? module.id,
      showNoAccess: grantedCount === 0 && !hasAll,
      cells,
    };
  });
}

export function getRowAnimationStyle(index: number): CSSProperties {
  return { animationDelay: `${index * 35}ms`, animationFillMode: "backwards" };
}

export function getAllModuleIds(modules: readonly PermissionModule[]): Set<string> {
  return new Set(modules.map((m) => m.id));
}

export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}