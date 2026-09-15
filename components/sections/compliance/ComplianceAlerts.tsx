'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, BadgeProps, ScrollArea } from '@/components/ui';
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  User,
  FileText,
  Calendar,
  Shield,
  GraduationCap,
  ChevronRight,
  XCircle,
} from 'lucide-react';

interface ComplianceAlert {
  id: string;
  type: 'training' | 'document' | 'dbs' | 'mar' | 'note' | 'supervision';
  title: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'urgent' | 'warning' | 'info';
}

interface ComplianceAlertsProps {
  alerts?: ComplianceAlert[];
  onAlertClick?: (id: string) => void;
}

const mockAlerts: ComplianceAlert[] = [
  {
    id: '1',
    type: 'training',
    title: 'Safeguarding training expired',
    description: 'Mark Davis · Expired 3 days ago',
    assignedTo: 'Mark Davis',
    dueDate: '3 days ago',
    status: 'urgent',
  },
  {
    id: '2',
    type: 'document',
    title: '3 care plans unsigned',
    description: 'Awaiting RM sign-off',
    status: 'urgent',
  },
  {
    id: '3',
    type: 'dbs',
    title: 'DBS expiring — Lucy C.',
    description: 'Expires 16 April · 14 days',
    assignedTo: 'Lucy C.',
    dueDate: '14 days',
    status: 'warning',
  },
  {
    id: '4',
    type: 'mar',
    title: '4 MAR entries missing',
    description: "Yesterday's evening round",
    status: 'warning',
  },
  {
    id: '5',
    type: 'note',
    title: '5 notes recorded late',
    description: 'Submitted >2hrs after visit',
    status: 'warning',
  },
  {
    id: '6',
    type: 'supervision',
    title: 'Supervisions due — 4 staff',
    description: 'Due by 16 April',
    dueDate: '16 April',
    status: 'info',
  },
];

const typeIcons = {
  training: GraduationCap,
  document: FileText,
  dbs: Shield,
  mar: FileText,
  note: FileText,
  supervision: User,
};

const statusConfig = {
  urgent: {
    icon: XCircle,
    color: 'text-[var(--cf-error)]',
    bg: 'bg-[var(--cf-error-muted)]',
    border: 'border-red-200 dark:border-red-800',
    badge: 'pastel-danger',
    label: 'Urgent',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-[var(--cf-warning)]',
    bg: 'bg-[var(--cf-warning-muted)]',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'pastel-warning',
    label: 'Warning',
  },
  info: {
    icon: Bell,
    color: 'text-[var(--cf-info)]',
    bg: 'bg-[var(--cf-info-muted)]',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'pastel-info',
    label: 'Info',
  },
};

export function ComplianceAlerts({
  alerts = mockAlerts,
  onAlertClick,
}: ComplianceAlertsProps) {
  const urgentCount = alerts.filter(a => a.status === 'urgent').length;

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cf-surface-muted">
              <Bell className="h-4 w-4 text-cf-ink-60" />
            </div>
            <CardTitle className="text-sm font-semibold text-cf-ink">
              Compliance Alerts
            </CardTitle>
          </div>
          {urgentCount > 0 && (
            <Badge variant="pastel-danger" shape="pill" badgeSize="sm">
              {urgentCount} urgent
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className=" px-4 pb-4">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const status = statusConfig[alert.status];
              const StatusIcon = status.icon;
              const TypeIcon = typeIcons[alert.type] || AlertCircle;

              return (
                <div
                  key={alert.id}
                  onClick={() => onAlertClick?.(alert.id)}
                  className={`p-3 rounded-lg border ${status.border} ${status.bg} transition-all hover:shadow-sm cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${status.bg} border ${status.border} flex-shrink-0 mt-0.5`}>
                      <TypeIcon className={`h-3.5 w-3.5 ${status.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-cf-ink">
                          {alert.title}
                        </p>
                        <Badge variant={status.badge as BadgeProps['variant']} shape="pill" badgeSize="sm" >
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-cf-ink-60 mt-0.5">
                        {alert.description}
                      </p>
                      {alert.assignedTo && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-1 text-xs text-cf-ink-60">
                            <User className="h-3 w-3" />
                            <span>{alert.assignedTo}</span>
                          </div>
                          {alert.dueDate && (
                            <>
                              <span className="text-cf-ink-30">•</span>
                              <div className="flex items-center gap-1 text-xs text-cf-ink-60">
                                <Calendar className="h-3 w-3" />
                                <span>{alert.dueDate}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-cf-ink-30 flex-shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}