'use client';

import { ChevronDown } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import type { StaffDrawerTabId } from "utils";
import { TAB_ICONS, TRIGGER_CLASS } from "utils";
import { useStaffDrawerTabs } from "hooks";
import type { StaffDrawerTabsProps } from "types";

export function StaffDrawerTabs({
  value,
  onValueChange,
  counts,
}: StaffDrawerTabsProps) {
  const {
    containerRef,
    overflowRef,
    registerTrigger,
    visibleTabs,
    overflowTabs,
    activeIsOverflowed,
  } = useStaffDrawerTabs(value, counts);

  return (
    <div
      ref={containerRef}
      className="flex shrink-0 items-center gap-2 border-b border-cf-border px-4 sm:px-6"
    >
      <TabsList
        variant="line"
        className="h-auto w-full min-w-0 flex-1 justify-start overflow-visible bg-transparent"
      >
        {visibleTabs.map((tab) => {
          const Icon = TAB_ICONS[tab.id];
          const count = counts?.[tab.id];

          return (
            <TabsTrigger
              key={tab.id}
              ref={registerTrigger(tab.id)}
              value={tab.id}
              title={tab.description}
              className={TRIGGER_CLASS}
            >
              <Icon className="size-3.5" />
              {tab.label}
              {count ? (
                <span className="rounded-full bg-primary/10 px-1.5 text-[11px] font-bold tabular-nums text-primary">
                  {count}
                </span>
              ) : null}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {overflowTabs.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                ref={overflowRef}
                variant="ghost"
                className={`h-10 flex-none gap-1.5 px-3 text-[13px] font-semibold ${
                  activeIsOverflowed
                    ? 'bg-primary/5 text-primary'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              />
            }
          >
            <ChevronDown className="size-3.5" />
            More
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={(next) => onValueChange(next as StaffDrawerTabId)}
            >
              {overflowTabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                const count = counts?.[tab.id];

                return (
                  <DropdownMenuRadioItem
                    key={tab.id}
                    value={tab.id}
                    closeOnClick
                    className="gap-2"
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    {tab.label}
                    {count ? (
                      <span className="ml-auto rounded-full bg-primary/10 px-1.5 text-[11px] font-bold tabular-nums text-primary">
                        {count}
                      </span>
                    ) : null}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}