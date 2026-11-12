'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface CarePlanDeepLinkProps {
  onAddCarePlan: (patientId: string) => void;
}

export function CarePlanDeepLink({ onAddCarePlan }: CarePlanDeepLinkProps) {
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

    onAddCarePlan(patientId);
    router.replace(pathname, { scroll: false });
  }, [patientId, wantsAdd, onAddCarePlan, router, pathname]);

  return null;
}