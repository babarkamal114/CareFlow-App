"use client";

import { useState } from "react";
import type { LiveActivityFilterKey } from "types";

export function useLiveActivityFilter() {
  const [activeFilter, setActiveFilter] = useState<LiveActivityFilterKey>("all");

  return { activeFilter, setActiveFilter };
}
