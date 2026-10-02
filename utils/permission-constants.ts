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