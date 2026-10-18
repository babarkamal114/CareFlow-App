// lib/mock/staff-mock-data.ts
// TEMP: mock data to unblock frontend work while backend auth/schema issue is resolved.
// Remove this file (and its usage in page.tsx) once the real API is wired back up.

import type { StaffMember, EmployeeStatus } from "types";

const ROLES = ["manager", "coordinator", "carer", "admin"] as const;
const STATUSES: EmployeeStatus[] = ["ACTIVE", "SUSPENDED", "ON_LEAVE", "TERMINATED"];

const NAMES = [
  "Sarah Williams",
  "James O'Connor",
  "Priya Patel",
  "Dorothy Chen",
  "Robert Ahmed",
  "Barbara Williams",
  "Fatima Khan",
  "Henry Smith",
  "Lucy Clarke",
  "Edna Morris",
  "Michael Turner",
  "Aisha Begum",
];

function makeStaffMember(index: number): StaffMember {
  const name = NAMES[index % NAMES.length];
  const role = ROLES[index % ROLES.length];
  const status = STATUSES[index % STATUSES.length];
  const emailVerified = status !== "TERMINATED";
  const slug = name.toLowerCase().replace(/[^a-z]+/g, ".");

  const createdAt = new Date(2026, 0, 1 + index * 7);
  const updatedAt = new Date(2026, 6, 1 + index * 2);
  const joinDate = createdAt;
  const invitedAt = status === "ON_LEAVE" ? new Date(2026, 7, 10 + index) : null;
  const acceptedAt = status === "ACTIVE" ? new Date(2026, 7, 12 + index) : null;

  return {
    id: `mock-${index}`,
    userId: `mock-user-${index}`,
    name,
    email: `${slug}@careflow.dev`,
    phone: index % 3 === 0 ? null : `07${(700000000 + index * 12345).toString().slice(0, 9)}`,
    profilePicture: null,
    role,
    status,
    userStatus: status === "ACTIVE" ? "active" : status === "ON_LEAVE" ? "invited" : "suspended",
    emailVerified,
    joinDate,
    invitedAt,
    acceptedAt,
    invitedBy: index % 4 === 0 ? "Afzaad Khan" : null,
    createdAt,
    updatedAt,
    deletedAt: null,
  };
}

export const mockStaffMembers: StaffMember[] = Array.from({ length: 12 }, (_, i) =>
  makeStaffMember(i),
);

export const mockStaffStats = {
  total: mockStaffMembers.length,
  active: mockStaffMembers.filter((s) => s.status === "ACTIVE").length,
  onLeave: mockStaffMembers.filter((s) => s.status === "ON_LEAVE").length,
  suspended: mockStaffMembers.filter((s) => s.status === "SUSPENDED").length,
};