import { BadgeProps } from "@/components/ui";
import { EmployeeStatus } from "types";

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