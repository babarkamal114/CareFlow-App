"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { STAFF_DRAWER_TABS, CONTAINER_GAP, ESTIMATED_OVERFLOW_WIDTH } from "utils";
import type { StaffDrawerTabId } from "utils";
import { getFittingTabCount, isMeasurementStale } from "utils";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useStaffDrawerTabs(
  value: StaffDrawerTabId,
  counts?: Partial<Record<StaffDrawerTabId, number>>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Map<StaffDrawerTabId, HTMLButtonElement>>(new Map());

  const [containerWidth, setContainerWidth] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(STAFF_DRAWER_TABS.length);

  const visibleTabs = STAFF_DRAWER_TABS.slice(0, visibleCount);
  const overflowTabs = STAFF_DRAWER_TABS.slice(visibleCount);
  const activeIsOverflowed = overflowTabs.some((tab) => tab.id === value);

  /** ref callback to hand to each TabsTrigger so its width can be measured */
  const registerTrigger = (id: StaffDrawerTabId) => (node: HTMLButtonElement | null) => {
    if (node) triggerRefs.current.set(id, node);
    else triggerRefs.current.delete(id);
  };

  // 1. watch the container width
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => setContainerWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 2. measure every trigger while all of them are visible
  useIsomorphicLayoutEffect(() => {
    if (visibleCount < STAFF_DRAWER_TABS.length) return;

    const widths = STAFF_DRAWER_TABS.map(
      (tab) => triggerRefs.current.get(tab.id)?.offsetWidth ?? 0
    );
    if (widths.some((width) => width === 0)) return;

    if (isMeasurementStale(tabWidths, widths)) setTabWidths(widths);
  }, [counts, tabWidths, visibleCount]);

  // 3. decide how many tabs fit
  useIsomorphicLayoutEffect(() => {
    if (containerWidth === 0 || tabWidths.length === 0) return;

    const reservedWidth =
      (overflowRef.current?.offsetWidth ?? ESTIMATED_OVERFLOW_WIDTH) + CONTAINER_GAP;

    setVisibleCount(getFittingTabCount(tabWidths, containerWidth, reservedWidth));
  }, [containerWidth, tabWidths]);

  return {
    containerRef,
    overflowRef,
    registerTrigger,
    visibleTabs,
    overflowTabs,
    activeIsOverflowed,
  };
}
