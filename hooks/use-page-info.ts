'use client'

import { 
  Users, 
  Calendar, 
  Home, 
  Settings, 
  UserCog,
  Clock,
  FileText,
  Bell,
  Activity,
  UserPlus,
  ClipboardList,
  HeartPulse,
  Stethoscope,
  LayoutDashboard
} from "lucide-react";
import { usePathname } from "next/navigation";


const pageIconMap: Record<string, any> = {
  "dashboard": LayoutDashboard,
  "staff": Users,
  "patients": HeartPulse,
  "visits": Calendar,
  "schedule": Clock,
  "care-plans": ClipboardList,
  "medications": Stethoscope,
  "reports": FileText,
  "settings": Settings,
  "notifications": Bell,
  "activity": Activity,
  "invites": UserPlus,
  "profile": UserCog,
  "subscribers": Users,
};


const pageNameMap: Record<string, string> = {
  "dashboard": "Dashboard",
  "staff": "Staff",
  "patients": "Patients",
  "visits": "Visits",
  "schedule": "Schedule",
  "care-plans": "Care Plans",
  "medications": "Medications",
  "reports": "Reports",
  "settings": "Settings",
  "notifications": "Notifications",
  "activity": "Activity",
  "invites": "Invites",
  "profile": "Profile",
  "subscribers": "Subscribers",
};


export function usePageInfo() {
  const pathname = usePathname();
  
 
  const segments = pathname.split("/").filter(Boolean);
  let currentPage = segments[segments.length - 1] || "dashboard";

  if (currentPage.toLowerCase() === 'dashboard') {
    currentPage = ''
  }
  
  const icon = pageIconMap[currentPage] || LayoutDashboard;
  const displayName = pageNameMap[currentPage] || currentPage;
  

  const previousPage = segments.length > 1 ? segments[segments.length - 2] : null;
  const previousDisplayName = previousPage ? pageNameMap[previousPage] || previousPage : null;

  return {
    currentPage: displayName,
    currentKey: currentPage,
    icon,
    previousPage: previousDisplayName,
    pathname,
  };
}