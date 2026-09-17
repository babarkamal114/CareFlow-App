import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge, BadgeProps } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Filter, Eye } from "lucide-react";
import Link from "next/link";

interface Visit {
  id: string;
  patient: {
    name: string;
    avatar?: string;
    initials: string;
    careType: string;
  };
  carer: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "missed" | "cancelled";
  duration: number;
}

const mockVisits: Visit[] = [
  {
    id: "1",
    patient: {
      name: "Margaret Johnson",
      avatar: "",
      initials: "MJ",
      careType: "Personal Care + Medication",
    },
    carer: "Sarah Williams",
    time: "08:00 - 09:00",
    status: "completed",
    duration: 60,
  },
  {
    id: "2",
    patient: {
      name: "Robert Chen",
      avatar: "",
      initials: "RC",
      careType: "Meal Preparation",
    },
    carer: "James O'Brien",
    time: "09:30 - 10:30",
    status: "in-progress",
    duration: 60,
  },
  {
    id: "3",
    patient: {
      name: "Patricia Smith",
      avatar: "",
      initials: "PS",
      careType: "Medication + Personal Care",
    },
    carer: "Emma Davis",
    time: "11:00 - 12:00",
    status: "scheduled",
    duration: 60,
  },
  {
    id: "4",
    patient: {
      name: "David Wilson",
      avatar: "",
      initials: "DW",
      careType: "Personal Care",
    },
    carer: "Michael Brown",
    time: "13:00 - 14:00",
    status: "scheduled",
    duration: 60,
  },
  {
    id: "5",
    patient: {
      name: "Susan Taylor",
      avatar: "",
      initials: "ST",
      careType: "Medication + Meal + Personal Care",
    },
    carer: "Laura Martinez",
    time: "15:00 - 16:30",
    status: "scheduled",
    duration: 90,
  },
];

type StatusType = "scheduled" | "in-progress" | "completed" | "missed" | "cancelled";

export const statusPastelMap: Record<StatusType, string> = {
  scheduled: "pastel-info",
  "in-progress": "pastel-warning",
  completed: "pastel-success",
  missed: "pastel-danger",
  cancelled: "pastel-neutral",
};

export const statusLabelMap: Record<StatusType, string> = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

export function getStatusBadgeVariant(status: StatusType): string {
  return statusPastelMap[status] || "pastel-neutral";
}


export function formatNameWithInitial(fullName: string): string {
  if (!fullName) return "";
  
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0];
  
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const lastNameInitial = lastName.charAt(0).toUpperCase();
  
  return `${firstName} ${lastNameInitial}.`;
}


function DashboardVisitSection() {
  return (
    <div className="cf-glass-panel w-full rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cf-border">
        <h3 className="text-lg font-semibold text-cf-ink">Today's Visits</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Link href="/visits">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-cf-brand-500">
              <Eye className="h-3.5 w-3.5" />
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-cf-surface-muted hover:bg-cf-surface-muted">
              <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[200px]">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[150px]">
                Carer
              </TableHead>
              <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[120px]">
                Time
              </TableHead>
              <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[100px]">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-cf-ink-60 text-right min-w-[80px]">
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVisits.map((visit) => (
              <TableRow key={visit.id} className="hover:bg-cf-surface-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={visit.patient.avatar} alt={visit.patient.name} />
                      <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
                        {visit.patient.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-cf-ink">
                        {visit.patient.name}
                      </p>
                      <p className="text-xs text-cf-ink-60">
                        {visit.patient.careType}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-cf-ink-60">
                    {formatNameWithInitial(visit.carer)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-cf-ink-60">{visit.time}</span>
                </TableCell>
                <TableCell>
                  <Badge
                  shape={'pill'}
                    variant={getStatusBadgeVariant(visit.status) as BadgeProps['variant']}
                    
                  >
                    {statusLabelMap[visit.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-cf-ink-60">
                    {visit.duration} min
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DashboardVisitSection;