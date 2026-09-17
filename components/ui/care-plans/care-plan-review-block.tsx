'use client';

import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
import { Clock, AlertCircle, FileText, CheckCircle } from 'lucide-react';

interface ReviewQueueBlockProps {
  patientName: string;
  patientInitials: string;
  patientImage?: string;
  planName: string;
  version: string;
  type: 'review' | 'approve';
  overdueDays?: number;
  submittedBy: string;
  submittedAt: Date;
}

export function ReviewQueueBlock({
  patientName,
  patientInitials,
  patientImage,
  planName,
  version,
  type,
  overdueDays = 0,
  submittedAt,
}: ReviewQueueBlockProps) {
  const isOverdue = overdueDays > 0;
  const isApprove = type === 'approve';

  const typeLabel = isApprove ? 'Approve' : 'Review';
  const typeColor = isApprove ? 'outline' : 'pastel-info';

  const overdueText = isOverdue 
    ? `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`
    : '';

  return (
    <div className="flex items-center justify-between p-3 border border-cf-border rounded-lg hover:bg-cf-surface-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar className="h-10 w-10 border border-cf-border flex-shrink-0">
          <AvatarImage src={patientImage} alt={patientName} />
          <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
            {patientInitials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-cf-ink truncate">{patientName}</h4>
            {isOverdue && (
              <AlertCircle className="h-3.5 w-3.5 text-cf-red-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-cf-ink-60 truncate">
            {planName} · {version}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {isOverdue && (
              <span className="text-[10px] text-cf-red-500 flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {overdueText}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={typeColor} shape="rounded" badgeSize={'md'}>
          {typeLabel}
        </Badge>
      </div>
    </div>
  );
}