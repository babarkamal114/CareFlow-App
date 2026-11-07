'use client';

import { Mail, MessageSquare, X } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { StaffDrawerActionsProps } from "types";
import { DRAWER_ACTION_BUTTON } from "utils";

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
              className={DRAWER_ACTION_BUTTON}
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
              className={DRAWER_ACTION_BUTTON}
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
              className={DRAWER_ACTION_BUTTON}
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