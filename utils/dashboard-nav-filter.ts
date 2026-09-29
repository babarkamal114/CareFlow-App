import type { LucideIcon } from "lucide-react";
import { Settings, User } from "lucide-react";

import { NavItem } from "./data";

export const ROLE_NAV_ACCESS: Record<string, string[]> = {
  super_admin: [
    'dashboard',
    'visits',
    'patients',
    'schedule',
    // 'staff',
    // 'finance',
    // 'reports',
    // 'settings',
    // 'permissions',
    'users',
    'agencies',
  ],
  agency_admin: [
    'dashboard',
    'visits',
    'patients',
    'schedule',
    'staff',
    'finance',
    'reports',
    'settings',
    'permissions',
    'users',
  ],
  manager: [
    'dashboard',
    'visits',
    'patients',
    'schedule',
    'staff',
    'finance',
    'reports',
  ],
  coordinator: [
    'dashboard',
    'visits',
    'patients',
    'schedule',
    'staff',
  ],
  carer: [
    'dashboard',
    'visits',
    'patients',
    'schedule',
  ],
  patient: [
    'dashboard',
    'schedule',
    'visits',
  ],
};

export function canAccessModule(role: string, moduleId: string): boolean {
  const accessibleModules = ROLE_NAV_ACCESS[role] || [];
  return accessibleModules.includes(moduleId);
}

export function filterNavItemsByRole(items: NavItem[], role: string): NavItem[] {
  const normalizedRole = (role || "").toLowerCase().trim();
  const accessibleModules = ROLE_NAV_ACCESS[normalizedRole] || [];

  if (accessibleModules.length === 0) return items;

  return items.filter((item) => accessibleModules.includes(item.requiredModule));
}

export function isNavItemActive(href: string, pathname: string): boolean {
  if (!href || href === "#") return false;

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;

  if (normalizedHref === "/") {
    return pathname === "/";
  }

  return (
    pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
  );
}

export interface ProfileMenuItem {
  key: string;
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { key: "profile", label: "Profile", href: "/profile", Icon: User },
  { key: "settings", label: "Settings", href: "/settings", Icon: Settings },
];
