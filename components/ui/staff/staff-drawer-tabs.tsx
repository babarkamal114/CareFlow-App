'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  FileText,
  GraduationCap,
  History,
  KeyRound,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
import { STAFF_DRAWER_TABS } from 'utils';
import type { StaffDrawerTabId } from 'utils';

const TAB_ICONS: Record<StaffDrawerTabId, LucideIcon> = {
  profile: UserRound,
  employment: BriefcaseBusiness,
  vetting: ShieldCheck,
  training: GraduationCap,
  availability: CalendarClock,
  documents: FileText,
  permissions: KeyRound,
  activity: History,
};

const TRIGGER_CLASS =
  'h-10 flex-none gap-1.5 rounded-none px-3 text-[13px] font-semibold data-active:text-primary';

/** Gap between adjacent triggers on the line variant of TabsList. */
const TAB_GAP = 4;
/** Gap between the tab list and the overflow trigger. */
const CONTAINER_GAP = 8;
/** Used before the overflow trigger has been measured for the first time. */
const ESTIMATED_OVERFLOW_WIDTH = 96;

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Widths were captured before a label or count badge changed the trigger size. */
function isMeasurementStale(widths: number[], measured: number[]): boolean {
  return widths.some((width, position) => width !== measured[position]);
}

/**
 * How many tab triggers fit on one row. When the full set does not fit, the
 * remainder moves into the overflow menu and `reservedWidth` is kept back for
 * that trigger.
 */
function getFittingTabCount(
  widths: number[],
  availableWidth: number,
  reservedWidth: number
): number {
  const fullWidth =
    widths.reduce((total, width) => total + width, 0) +
    TAB_GAP * Math.max(widths.length - 1, 0);

  if (fullWidth <= availableWidth) return widths.length;

  const budget = availableWidth - reservedWidth;
  let used = 0;
  let visible = 0;

  for (const width of widths) {
    const next = visible === 0 ? width : used + TAB_GAP + width;
    if (next > budget) break;
    used = next;
    visible += 1;
  }

  return Math.max(visible, 1);
}

interface StaffDrawerTabsProps {
  value: StaffDrawerTabId;
  onValueChange: (value: StaffDrawerTabId) => void;
  counts?: Partial<Record<StaffDrawerTabId, number>>;
}

export function StaffDrawerTabs({
  value,
  onValueChange,
  counts,
}: StaffDrawerTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Map<StaffDrawerTabId, HTMLButtonElement>>(new Map());

  const [containerWidth, setContainerWidth] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(STAFF_DRAWER_TABS.length);

  const visibleTabs = STAFF_DRAWER_TABS.slice(0, visibleCount);
  const overflowTabs = STAFF_DRAWER_TABS.slice(visibleCount);
  const activeIsOverflowed = overflowTabs.some((tab) => tab.id === value);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => setContainerWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (visibleCount < STAFF_DRAWER_TABS.length) return;

    const widths = STAFF_DRAWER_TABS.map(
      (tab) => triggerRefs.current.get(tab.id)?.offsetWidth ?? 0
    );
    if (widths.some((width) => width === 0)) return;

    if (isMeasurementStale(tabWidths, widths)) setTabWidths(widths);
  }, [counts, tabWidths, visibleCount]);

  useIsomorphicLayoutEffect(() => {
    if (containerWidth === 0 || tabWidths.length === 0) return;

    const reservedWidth =
      (overflowRef.current?.offsetWidth ?? ESTIMATED_OVERFLOW_WIDTH) +
      CONTAINER_GAP;

    setVisibleCount(
      getFittingTabCount(tabWidths, containerWidth, reservedWidth)
    );
  }, [containerWidth, tabWidths]);

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
              ref={(node: HTMLButtonElement | null) => {
                if (node) triggerRefs.current.set(tab.id, node);
                else triggerRefs.current.delete(tab.id);
              }}
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