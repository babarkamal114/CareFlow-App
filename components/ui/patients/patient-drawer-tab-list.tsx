"use client";

import { ChevronDown } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import type { PatientDrawerTabId } from "types";

interface DrawerTab {
  value: PatientDrawerTabId;
  label: string;
}

interface PatientDrawerTabListProps {
  mainTabs: readonly DrawerTab[];
  moreTabs: readonly DrawerTab[];
  activeTab: PatientDrawerTabId;
  onSelectTab: (tab: PatientDrawerTabId) => void;
}

/** Main tabs inline, the rest under a "More" menu. */
export function PatientDrawerTabList({
  mainTabs,
  moreTabs,
  activeTab,
  onSelectTab,
}: PatientDrawerTabListProps) {
  const moreActive = moreTabs.find((tab) => tab.value === activeTab);

  return (
    <div className="flex items-center justify-between border-b border-cf-border px-6">
      <TabsList variant="line">
        {mainTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="sm" className="gap-1 text-xs" />}
        >
          {moreActive ? moreActive.label : "More"}
          <ChevronDown className="size-3.5" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {moreTabs.map((tab) => (
            <DropdownMenuItem key={tab.value} onClick={() => onSelectTab(tab.value)}>
              {tab.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}