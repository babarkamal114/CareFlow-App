export const ALL_MODULES = [
  { id: 'dashboard', label: 'Dashboard', actions: ['read'] },
  { id: 'patients', label: 'Patients', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'schedule', label: 'Schedule', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'visits', label: 'Visits', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'staff', label: 'Staff', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'finance', label: 'Finance', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'reports', label: 'Reports', actions: ['create', 'read', 'export'] },
  { id: 'settings', label: 'Settings', actions: ['read', 'update', 'manage'] },
  { id: 'permissions', label: 'Permissions', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'users', label: 'Users', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'agencies', label: 'Agencies', actions: ['create', 'read', 'update', 'delete'] },
];

export const ACTION_DISPLAY_NAMES: Record<string, string> = {
  create: 'Create',
  read: 'View',
  update: 'Edit',
  delete: 'Delete',
  export: 'Export',
  manage: 'Manage',
};

const ALL_ACTIONS = Array.from(new Set(ALL_MODULES.flatMap((m) => m.actions)));
const ACTION_ORDER = ['create', 'read', 'update', 'delete', 'export', 'manage'];
export const SORTED_ACTIONS = ACTION_ORDER.filter((a) => ALL_ACTIONS.includes(a));

export const PERMISSION_TABLE_HEADERS: { label: string }[] = [
  { label: "Module" },
  { label: "Read" },
  { label: "Create" },
  { label: "Update" },
  { label: "Delete" },
  { label: "All" },
];

export const PERMISSION_TABLE_ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "all",
] as const;
export type PermissionTableAction = (typeof PERMISSION_TABLE_ACTIONS)[number];

export interface RawPermission {
  module: string;
  action: string;
  source?: string;
}

export function createPermissionMap(
  permissions: RawPermission[]
): Map<string, string> {
  const map = new Map<string, string>();
  permissions.forEach((perm) => {
    map.set(`${perm.module}:${perm.action}`, perm.source || "role");
  });
  return map;
}

export function checkHasPermission(
  permissionMap: Map<string, string>,
  module: string,
  action: string
): boolean {
  const source = permissionMap.get(`${module.toLowerCase()}:${action}`);
  return source !== undefined && source !== "block";
}

export function getConfiguredModuleCount(
  permissionMap: Map<string, string>
): number {
  return ALL_MODULES.filter((module) =>
    module.actions.some((action) =>
      checkHasPermission(permissionMap, module.id, action)
    )
  ).length;
}

export function initializePermissions(
  defaultPermissions: RawPermission[]
): Record<string, string[]> {
  const initialPermissions: Record<string, string[]> = {};
  ALL_MODULES.forEach((module) => {
    initialPermissions[module.id] = [];
  });
  defaultPermissions.forEach((perm) => {
    if (perm.source !== "block") {
      if (!initialPermissions[perm.module]) initialPermissions[perm.module] = [];
      if (!initialPermissions[perm.module].includes(perm.action)) {
        initialPermissions[perm.module].push(perm.action);
      }
    }
  });
  return initialPermissions;
}

export function togglePermissionAction(
  prev: Record<string, string[]>,
  moduleId: string,
  action: string
): Record<string, string[]> {
  const current = prev[moduleId] || [];
  const updated = current.includes(action)
    ? current.filter((a) => a !== action)
    : [...current, action];
  return { ...prev, [moduleId]: updated };
}

export function toggleAllModuleActions(
  prev: Record<string, string[]>,
  moduleId: string
): Record<string, string[]> {
  const module = ALL_MODULES.find((m) => m.id === moduleId);
  if (!module) return prev;
  const current = prev[moduleId] || [];
  const allGranted = module.actions.every((a) => current.includes(a));
  return { ...prev, [moduleId]: allGranted ? [] : [...module.actions] };
}