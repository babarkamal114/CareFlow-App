'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { MoreHorizontal } from 'lucide-react';
import {
  PATIENT_DRAWER_FOOTER_ACTIONS,
  PATIENT_DRAWER_FOOTER_MENU_ACTIONS,
  PATIENT_DRAWER_FOOTER_DISCHARGE_ACTION,
  type PatientDrawerFooterHandlers,
} from 'utils';

type PatientDrawerFooterProps = PatientDrawerFooterHandlers;

export function PatientDrawerFooter(props: PatientDrawerFooterProps) {
  const { onDischarge } = props;
  const { Icon: DischargeIcon, label: dischargeLabel, className: dischargeClass } =
    PATIENT_DRAWER_FOOTER_DISCHARGE_ACTION;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-cf-border bg-cf-surface">
      {PATIENT_DRAWER_FOOTER_ACTIONS.map(({ handler, label, Icon, variant }) => (
        <Button key={handler} onClick={props[handler]} variant={variant} size="sm" className="gap-1.5">
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MoreHorizontal className="h-4 w-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {PATIENT_DRAWER_FOOTER_MENU_ACTIONS.map(({ handler, label, Icon, className }) => (
            <DropdownMenuItem key={handler} onClick={props[handler]} className={className}>
              <Icon className="h-4 w-4" />
              {label}
            </DropdownMenuItem>
          ))}

          {onDischarge && (
            <>
              <div className="my-1 border-t border-cf-border-light" />
              <DropdownMenuItem onClick={onDischarge} className={dischargeClass}>
                <DischargeIcon className="h-4 w-4" />
                {dischargeLabel}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}