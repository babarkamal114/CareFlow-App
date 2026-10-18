// components/sections/dashboard/DashboardAttentionBoard.tsx
import React from "react";
import { Badge, BadgeProps, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  User,
  Shield,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getBadgeVariant } from "utils";

type AttentionType =
  | "missed-visit"
  | "no-checkin"
  | "safeguarding"
  | "overdue"
  | "expiring";

interface AttentionItem {
  id: string;
  type: AttentionType;
  title: string;
  description: string;
  detail: string;
  time: string;
  priority: "high" | "medium" | "low";
}

const mockAttentionItems: AttentionItem[] = [
  {
    id: "1",
    type: "missed-visit",
    title: "Missed visit",
    description: "Dorothy Chen",
    detail: "Scheduled 8:30 AM · No check-in recorded",
    time: "12m",
    priority: "high",
  },
  {
    id: "2",
    type: "no-checkin",
    title: "No check-in",
    description: "James Okafor",
    detail: "Visit at 8:30 AM · Carer didn't check in",
    time: "12m",
    priority: "high",
  },
  {
    id: "3",
    type: "safeguarding",
    title: "Safeguarding concern",
    description: "Edna Morris",
    detail: "Financial abuse reported · Family member involved",
    time: "1h",
    priority: "high",
  },
  {
    id: "4",
    type: "overdue",
    title: "Care plans overdue",
    description: "3 patients",
    detail: "R. Ahmed, B. Williams, H. Smith · Due yesterday",
    time: "Today",
    priority: "medium",
  },
  {
    id: "5",
    type: "expiring",
    title: "DBS expiring",
    description: "Lucy Chen",
    detail: "Expires 16 April · 14 days remaining",
    time: "Today",
    priority: "medium",
  },
];

const priorityDotColors: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const typeIcons: Record<AttentionType, React.ReactNode> = {
  "missed-visit": <Clock className="h-3.5 w-3.5 text-cf-ink-60" />,
  "no-checkin": <User className="h-3.5 w-3.5 text-cf-ink-60" />,
  safeguarding: <Shield className="h-3.5 w-3.5 text-cf-ink-60" />,
  overdue: <FileText className="h-3.5 w-3.5 text-cf-ink-60" />,
  expiring: <Calendar className="h-3.5 w-3.5 text-cf-ink-60" />,
};


function DashboardAttentionBoard() {
  return (
    <Card className="border-cf-border w-full ">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Needs Attention
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
          variant="pastel-danger"
          shape={'pill'}
          >
            {mockAttentionItems.filter((i) => i.priority === "high").length} Items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-cf-border">
          {mockAttentionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-cf-surface-muted/50 transition-colors"
            >
              

             
              <div className="flex-shrink-0 text-cf-ink-60 mt-0.5">
                {typeIcons[item.type]}
              </div>

              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-cf-ink">{item.title}</p>
                  <Badge
                    variant={getBadgeVariant(item.type) as BadgeProps['variant']}
                  >
                  </Badge>
                </div>
                <p className="text-xs text-cf-ink-60">{item.description}</p>
                <p className="text-[10px] text-cf-ink-40 mt-0.5">{item.detail}</p>
              </div>

              
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-cf-ink-40">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardAttentionBoard;