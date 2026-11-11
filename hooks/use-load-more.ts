"use client";

import { useEffect, useState } from "react";

export function useLoadMore(total: number, pageSize: number, resetKey?: unknown) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, resetKey]);

  return {
    visibleCount,
    hasMore: total > visibleCount,
    remaining: Math.max(total - visibleCount, 0),
    loadMore: () => setVisibleCount((count) => count + pageSize),
  };
}