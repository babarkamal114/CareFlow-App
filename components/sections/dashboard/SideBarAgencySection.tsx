"use client";

import { useState, type ReactElement } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Building2, MoreVertical } from "lucide-react";

export interface SidebarAgencySectionProps {
  initials: string;
  name: string;
  onProfile?: () => void;
}

export function SidebarAgencySection({
  initials,
  name,
  onProfile,
}: SidebarAgencySectionProps): ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar text-xs font-semibold text-sidebar-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-medium text-sidebar-foreground">
              {name}
            </div>
          </div>
          <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 border-sidebar-border bg-sidebar p-1"
        align="end"
      >
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            setOpen(false);
            if (onProfile) onProfile();
          }}
        >
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Agency Profile
        </Button>
      </PopoverContent>
    </Popover>
  );
}
