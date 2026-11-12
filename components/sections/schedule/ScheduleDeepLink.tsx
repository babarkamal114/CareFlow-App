'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface ScheduleDeepLinkProps {
  onAddVisit: (patientId: string) => void;
}

export function ScheduleDeepLink({ onAddVisit }: ScheduleDeepLinkProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handledId = useRef<string | null>(null);

  const patientId = params.get("patientId");
  const wantsAdd = params.get("action") === "add";

  useEffect(() => {
    if (!patientId || !wantsAdd) {
      handledId.current = null;
      return;
    }
    if (handledId.current === patientId) return;
    handledId.current = patientId;

    onAddVisit(patientId);
    router.replace(pathname, { scroll: false });
  }, [patientId, wantsAdd, onAddVisit, router, pathname]);

  return null;
}