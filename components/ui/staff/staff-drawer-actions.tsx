'use client';

import { Mail, MessageSquare, X } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

interface StaffDrawerActionsProps {
  onEmail: () => void;
  onSms: () => void;
  onClose: () => void;
}

const ACTION_BUTTON =
  'text-cf-ink-60 transition-transform duration-200 hover:scale-105 active:scale-95';

export function StaffDrawerActions({ onEmail, onSms, onClose }: StaffDrawerActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Send email"
              className={ACTION_BUTTON}
              onClick={onEmail}
            >
              <Mail className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Send email</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Send SMS"
              className={ACTION_BUTTON}
              onClick={onSms}
            >
              <MessageSquare className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Send SMS</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close drawer"
              className={ACTION_BUTTON}
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Close</TooltipContent>
      </Tooltip>
    </div>
  );
}